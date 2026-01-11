/**
 * Generic LLM API client
 * Supports multiple providers through environment configuration
 */

export interface LLMRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  error?: string;
  errorType?: 'api_key' | 'rate_limit' | 'network' | 'unknown';
  errorDetails?: {
    message: string;
    code?: string;
    statusCode?: number;
  };
}

/**
 * Generic LLM client interface
 */
export interface LLMClient {
  chat(request: LLMRequest): Promise<LLMResponse>;
  chatStream?(request: LLMRequest): Promise<ReadableStream<Uint8Array>>;
}

/**
 * OpenAI-compatible client
 */
class OpenAICompatibleClient implements LLMClient {
  constructor(
    private apiKey: string,
    private baseUrl: string = 'https://api.openai.com/v1',
    private model: string = 'gpt-4o-mini'
  ) {}

  async chat(request: LLMRequest): Promise<LLMResponse> {
    try {
      const body: Record<string, unknown> = {
        model: this.model,
        messages: request.messages,
        max_completion_tokens: request.maxTokens ?? 2000,
        stream: false, // Non-streaming for regular chat
      };
      
      // Only add temperature if explicitly provided (some models don't support it)
      if (request.temperature !== undefined) {
        body.temperature = request.temperature;
      }
      
      console.log('[OpenAICompatibleClient] Making API call:', {
        baseUrl: this.baseUrl,
        model: this.model,
        messagesCount: request.messages.length,
        maxTokens: body.max_completion_tokens,
      });
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: { error?: { message?: string; code?: string; type?: string } } = {};
        
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // If parsing fails, use raw text
        }

        const errorMessage = errorData.error?.message || errorText;
        const errorCode = errorData.error?.code || errorData.error?.type;
        
        // Detect error type
        let errorType: 'api_key' | 'rate_limit' | 'network' | 'unknown' = 'unknown';
        if (response.status === 401 || errorCode === 'invalid_api_key' || errorMessage.toLowerCase().includes('api key')) {
          errorType = 'api_key';
        } else if (response.status === 429 || errorCode === 'rate_limit_exceeded') {
          errorType = 'rate_limit';
        } else if (response.status >= 500 || errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('timeout')) {
          errorType = 'network';
        }

        return {
          content: '',
          error: `API error (${response.status}): ${errorText}`,
          errorType,
          errorDetails: {
            message: errorMessage,
            code: errorCode,
            statusCode: response.status,
          },
        };
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      if (!content || content.trim().length === 0) {
        console.warn('[OpenAICompatibleClient] Empty content received from API');
        return {
          content: '',
          error: 'AI service returned empty content. The model may have failed to generate a response.',
          errorType: 'unknown',
          errorDetails: {
            message: 'Empty content from API response',
          },
        };
      }
      
      return {
        content,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: '',
        error: errorMessage,
        errorType: errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch') ? 'network' : 'unknown',
        errorDetails: {
          message: errorMessage,
        },
      };
    }
  }

  async chatStream(request: LLMRequest): Promise<ReadableStream<Uint8Array>> {
    const body: Record<string, unknown> = {
      model: this.model,
      messages: request.messages,
      max_completion_tokens: request.maxTokens ?? 2000,
      stream: true,
    };
    
    if (request.temperature !== undefined) {
      body.temperature = request.temperature;
    }
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Streaming API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Transform OpenAI SSE format to text chunks
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const transformStream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }

            // Decode chunk and append to buffer
            buffer += decoder.decode(value, { stream: true });
            
            // Process complete lines (SSE format: "data: {...}\n\n")
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                // Check for [DONE] marker
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content || '';
                  
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (e) {
                  // Skip invalid JSON lines
                  console.warn('[OpenAICompatibleClient] Failed to parse SSE data:', data);
                }
              }
            }
          }
        } catch (error) {
          console.error('[OpenAICompatibleClient] Stream error:', error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return transformStream;
  }
}

/**
 * Anthropic-compatible client
 */
class AnthropicCompatibleClient implements LLMClient {
  constructor(
    private apiKey: string,
    private model: string = 'claude-3-5-sonnet-20241022'
  ) {}

  async chatStream(request: LLMRequest): Promise<ReadableStream<Uint8Array>> {
    // Separate system messages from user/assistant messages
    const systemMessages = request.messages.filter((msg) => msg.role === 'system');
    const conversationMessages = request.messages.filter((msg) => msg.role !== 'system');
    const systemContent = systemMessages.map((msg) => msg.content).join('\n\n');

    const requestBody: Record<string, unknown> = {
      model: this.model,
      max_tokens: request.maxTokens ?? 2000,
      messages: conversationMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: true,
    };

    // Add system message if present (Anthropic supports system messages)
    if (systemContent) {
      requestBody.system = systemContent;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Anthropic streaming API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Anthropic response body is null');
    }

    // Anthropic uses Server-Sent Events (SSE) format similar to OpenAI
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const transformStream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }

            // Decode chunk and append to buffer
            buffer += decoder.decode(value, { stream: true });
            
            // Process complete lines (SSE format: "event: message_start\ndata: {...}\n\n")
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                // Check for [DONE] marker or event: message_stop
                if (data === '[DONE]' || data.trim() === '') {
                  continue;
                }

                try {
                  const json = JSON.parse(data);
                  // Anthropic format: { type: 'content_block_delta', delta: { text: '...' } }
                  const text = json.delta?.text || json.content_block?.text || '';
                  
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch (e) {
                  // Skip invalid JSON lines
                  console.warn('[AnthropicCompatibleClient] Failed to parse SSE data:', data);
                }
              }
            }
          }
        } catch (error) {
          console.error('[AnthropicCompatibleClient] Stream error:', error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return transformStream;
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    try {
      console.log('[AnthropicCompatibleClient] Making API call:', {
        model: this.model,
        messagesCount: request.messages.length,
        maxTokens: request.maxTokens ?? 2000,
      });
      
      // Separate system messages from user/assistant messages
      const systemMessages = request.messages.filter((msg) => msg.role === 'system');
      const conversationMessages = request.messages.filter((msg) => msg.role !== 'system');
      const systemContent = systemMessages.map((msg) => msg.content).join('\n\n');

      const requestBody: Record<string, unknown> = {
        model: this.model,
        max_tokens: request.maxTokens ?? 2000,
        messages: conversationMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      };

      // Add system message if present (Anthropic supports system messages)
      if (systemContent) {
        requestBody.system = systemContent;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: { error?: { message?: string; code?: string; type?: string } } = {};
        
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // If parsing fails, use raw text
        }

        const errorMessage = errorData.error?.message || errorText;
        const errorCode = errorData.error?.code || errorData.error?.type;
        
        // Detect error type
        let errorType: 'api_key' | 'rate_limit' | 'network' | 'unknown' = 'unknown';
        if (response.status === 401 || errorCode === 'invalid_api_key' || errorMessage.toLowerCase().includes('api key')) {
          errorType = 'api_key';
        } else if (response.status === 429 || errorCode === 'rate_limit_exceeded') {
          errorType = 'rate_limit';
        } else if (response.status >= 500 || errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('timeout')) {
          errorType = 'network';
        }

        return {
          content: '',
          error: `API error (${response.status}): ${errorText}`,
          errorType,
          errorDetails: {
            message: errorMessage,
            code: errorCode,
            statusCode: response.status,
          },
        };
      }

      const data = await response.json();
      const content = data.content[0]?.text || '';
      
      if (!content || content.trim().length === 0) {
        console.warn('[AnthropicCompatibleClient] Empty content received from API');
        return {
          content: '',
          error: 'AI service returned empty content. The model may have failed to generate a response.',
          errorType: 'unknown',
          errorDetails: {
            message: 'Empty content from API response',
          },
        };
      }
      
      return {
        content,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: '',
        error: errorMessage,
        errorType: errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch') ? 'network' : 'unknown',
        errorDetails: {
          message: errorMessage,
        },
      };
    }
  }
}

/**
 * Create LLM client from environment variables
 * Supports provider-specific API keys or generic AI_API_KEY as fallback
 */
export function createLLMClient(): LLMClient | null {
  const provider = (process.env.AI_PROVIDER?.toLowerCase() || 'openai').trim();
  const model = process.env.AI_MODEL;
  const baseUrl = process.env.AI_BASE_URL;

  // Get API key: try provider-specific first, then generic fallback
  let apiKey: string | undefined;
  if (provider === 'openai') {
    apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  } else if (provider === 'anthropic') {
    apiKey = process.env.ANTHROPIC_API_KEY || process.env.AI_API_KEY;
  } else {
    // Unknown provider, try generic key
    apiKey = process.env.AI_API_KEY;
  }

  if (!apiKey) {
    return null;
  }

  switch (provider) {
    case 'openai':
      return new OpenAICompatibleClient(apiKey, baseUrl, model);
    case 'anthropic':
      return new AnthropicCompatibleClient(apiKey, model);
    default:
      // Default to OpenAI-compatible for unknown providers
      console.warn(`[createLLMClient] Unknown provider "${provider}", defaulting to OpenAI-compatible`);
      return new OpenAICompatibleClient(apiKey, baseUrl, model);
  }
}
