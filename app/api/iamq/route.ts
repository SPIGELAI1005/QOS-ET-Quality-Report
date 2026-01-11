/**
 * I AM Q - Quality Management AI Assistant
 * Chat endpoint for quality-related questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createLLMClient } from '@/lib/ai/client';
import { getIAmQSystemPrompt } from '@/lib/iamq/systemPrompt';
import { checkRateLimit, getClientIdentifier } from '@/lib/iamq/rateLimiter';
import { validateQuestion } from '@/lib/iamq/inputValidator';
import { classifyQuestion, type QuestionMode } from '@/lib/iamq/questionClassifier';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Enable streaming
export const dynamic = 'force-dynamic';

interface IAmQRequest {
  question: string;
  context?: Record<string, unknown>;
}

interface IAmQResponse {
  answer: string;
  error?: string;
  errorType?: 'rate_limit' | 'validation' | 'api_key' | 'rate_limit_ai' | 'network' | 'unknown';
  retryAfter?: number; // Seconds until rate limit resets
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientId = getClientIdentifier(request);
  
  try {
    // Rate limiting check
    const rateLimit = checkRateLimit(clientId);
    if (!rateLimit.allowed) {
      console.warn('[iamq] Rate limit exceeded for client:', clientId, 'retryAfter:', rateLimit.retryAfter);
      return NextResponse.json<IAmQResponse>(
        {
          answer: '',
          error: `Too many requests. Please wait ${rateLimit.retryAfter} seconds before trying again.`,
          errorType: 'rate_limit',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 60),
            'X-RateLimit-Limit': String(20),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + (rateLimit.retryAfter || 60)),
          },
        }
      );
    }

    // Parse and validate request body
    let body: IAmQRequest;
    try {
      body = (await request.json()) as IAmQRequest;
    } catch (parseError) {
      console.error('[iamq] Failed to parse request body:', parseError);
      return NextResponse.json<IAmQResponse>(
        {
          answer: '',
          error: 'Invalid request format. Please send a valid JSON object.',
          errorType: 'validation',
        },
        { status: 400 }
      );
    }

    // Validate and normalize question
    const validation = validateQuestion(body.question);
    if (!validation.valid) {
      console.warn('[iamq] Validation failed:', validation.error);
      return NextResponse.json<IAmQResponse>(
        {
          answer: '',
          error: validation.error || 'Invalid question format',
          errorType: 'validation',
        },
        { status: 400 }
      );
    }

    // Use normalized question
    const normalizedQuestion = validation.normalized!;

    // Classify question to determine response mode
    const questionMode = classifyQuestion(normalizedQuestion);

    // Log minimal telemetry (no secrets, no personal data)
    console.log('[iamq] Request received:', {
      questionLength: normalizedQuestion.length,
      questionMode,
      hasContext: !!body.context,
      contextKeys: body.context ? Object.keys(body.context).join(',') : undefined,
      clientId: clientId.substring(0, 8) + '...', // Only log partial IP for privacy
      rateLimitRemaining: rateLimit.remaining,
    });

    // Determine provider and get API key
    const provider = (process.env.AI_PROVIDER?.toLowerCase() || 'openai').trim();
    
    // Validate provider
    if (!['openai', 'anthropic'].includes(provider)) {
      console.error('[iamq] Unsupported provider:', provider);
      return NextResponse.json<IAmQResponse>(
        {
          answer: '',
          error: `Unsupported AI provider: ${provider}. Supported providers: openai, anthropic. Set AI_PROVIDER=openai or AI_PROVIDER=anthropic in .env.local`,
          errorType: 'api_key',
        },
        { status: 500 }
      );
    }

    // Get API key: try provider-specific first, then generic, then fallback
    let apiKey: string | undefined;
    if (provider === 'openai') {
      apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    } else if (provider === 'anthropic') {
      apiKey = process.env.ANTHROPIC_API_KEY || process.env.AI_API_KEY;
    }

    if (!apiKey) {
      const requiredVar = provider === 'openai' 
        ? 'OPENAI_API_KEY (or AI_API_KEY as fallback)'
        : 'ANTHROPIC_API_KEY (or AI_API_KEY as fallback)';
      console.error(`[iamq] API key missing for ${provider} - ${requiredVar} not set`);
      return NextResponse.json<IAmQResponse>(
        {
          answer: '',
          error: `${requiredVar} environment variable is required for ${provider} provider. Please configure it in .env.local`,
          errorType: 'api_key',
        },
        { status: 500 }
      );
    }

    // Create LLM client
    const llmClient = createLLMClient();

    if (!llmClient) {
      console.error('[iamq] LLM client not created - API key may be invalid');
      return NextResponse.json<IAmQResponse>(
        {
          answer: '',
          error: 'Failed to initialize AI client. Please check your API key configuration.',
        },
        { status: 500 }
      );
    }

    console.log('[iamq] LLM client created successfully, provider:', provider);

    // Build user message with context and mode (use normalized question)
    let userContent = normalizedQuestion;
    
    // Add mode instruction if chart-related
    if (questionMode === 'chart_explainer') {
      userContent = `[Mode: chart_explainer]\n\n${normalizedQuestion}`;
    }
    
    // Add context if provided
    if (body.context && Object.keys(body.context).length > 0) {
      userContent = `${userContent}\n\nContext:\n${JSON.stringify(body.context, null, 2)}`;
    }

    // Check if client supports streaming (both OpenAI and Anthropic support streaming)
    const supportsStreaming = typeof llmClient.chatStream === 'function';
    
    // Try streaming first, fallback to non-streaming
    if (supportsStreaming) {
      try {
        console.log('[iamq] Attempting streaming response');
        const stream = await llmClient.chatStream!({
          messages: [
            {
              role: 'system',
              content: getIAmQSystemPrompt(),
            },
            {
              role: 'user',
              content: userContent,
            },
          ],
          maxTokens: 2000,
          temperature: 0.7,
        });

        // Both OpenAI and Anthropic clients return transformed text chunks
        // No additional transformation needed in the route
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (streamError) {
        console.warn('[iamq] Streaming failed, falling back to non-streaming:', streamError);
        // Fall through to non-streaming
      }
    }

    // Non-streaming fallback
    console.log('[iamq] Using non-streaming response');
    const llmResponse = await llmClient.chat({
      messages: [
        {
          role: 'system',
          content: getIAmQSystemPrompt(),
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
      maxTokens: 2000,
      temperature: 0.7,
    });

    console.log('[iamq] LLM call completed, has error:', !!llmResponse.error);

    if (llmResponse.error) {
      // Log error without exposing sensitive details
      console.error('[iamq] LLM API error:', llmResponse.errorType, llmResponse.errorDetails?.statusCode);

      let userFriendlyMessage = 'Sorry, I encountered an error processing your question. Please try again.';
      let statusCode = 500;

      if (llmResponse.errorType === 'api_key') {
        const requiredVar = provider === 'openai' 
          ? 'OPENAI_API_KEY (or AI_API_KEY)'
          : 'ANTHROPIC_API_KEY (or AI_API_KEY)';
        userFriendlyMessage = `AI API key is invalid or expired. Please check your ${requiredVar} configuration in .env.local for ${provider} provider.`;
        statusCode = 500;
      } else if (llmResponse.errorType === 'rate_limit') {
        userFriendlyMessage = 'AI API rate limit exceeded. Please wait a moment and try again.';
        statusCode = 429;
      } else if (llmResponse.errorType === 'network') {
        userFriendlyMessage = 'Network error connecting to AI service. Please check your connection and try again.';
        statusCode = 503;
      }

      // Log error telemetry
      const duration = Date.now() - startTime;
      console.error('[iamq] LLM error:', {
        errorType: llmResponse.errorType,
        statusCode: llmResponse.errorDetails?.statusCode,
        duration,
        clientId: clientId.substring(0, 8) + '...',
      });

      return NextResponse.json<IAmQResponse>(
        {
          answer: userFriendlyMessage,
          error: userFriendlyMessage,
          errorType: llmResponse.errorType === 'rate_limit' ? 'rate_limit_ai' : (llmResponse.errorType || 'unknown'),
        },
        { status: statusCode }
      );
    }

    // Log successful response telemetry
    const duration = Date.now() - startTime;
    console.log('[iamq] Success:', {
      duration,
      answerLength: llmResponse.content?.length || 0,
      clientId: clientId.substring(0, 8) + '...',
    });

    return NextResponse.json<IAmQResponse>({
      answer: llmResponse.content || 'Sorry, I couldn\'t generate a response. Please try again.',
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[iamq] Unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
      clientId: clientId.substring(0, 8) + '...',
    });
    
    return NextResponse.json<IAmQResponse>(
      {
        answer: 'An unexpected error occurred. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: 'unknown',
      },
      { status: 500 }
    );
  }
}

