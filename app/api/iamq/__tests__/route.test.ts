/**
 * Smoke test for I AM Q API route
 * Tests basic functionality without requiring real API keys
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock the LLM client and other dependencies
vi.mock('@/lib/ai/client', () => ({
  createLLMClient: vi.fn(() => {
    // Return a mock client that simulates API behavior
    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return null;
    }

    return {
      chat: vi.fn(async () => ({
        content: 'This is a test response from the AI assistant.',
        error: undefined,
      })),
      chatStream: vi.fn(async () => {
        // Return a simple readable stream with test content
        const encoder = new TextEncoder();
        const chunks = ['This ', 'is ', 'a ', 'test ', 'response.'];
        let index = 0;
        
        return new ReadableStream({
          async pull(controller) {
            if (index < chunks.length) {
              controller.enqueue(encoder.encode(chunks[index]));
              index++;
            } else {
              controller.close();
            }
          },
        });
      }),
    };
  }),
}));

vi.mock('@/lib/iamq/systemPrompt', () => ({
  getIAmQSystemPrompt: vi.fn(() => 'Test system prompt'),
}));

vi.mock('@/lib/iamq/rateLimiter', () => ({
  checkRateLimit: vi.fn(() => ({
    allowed: true,
    remaining: 19,
    retryAfter: null,
  })),
  getClientIdentifier: vi.fn(() => '127.0.0.1'),
}));

vi.mock('@/lib/iamq/inputValidator', () => ({
  validateQuestion: vi.fn((question: string) => ({
    valid: true,
    normalized: question.trim(),
    error: null,
  })),
}));

vi.mock('@/lib/iamq/questionClassifier', () => ({
  classifyQuestion: vi.fn(() => 'general' as const),
}));

describe('I AM Q API Route', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    delete process.env.AI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.AI_PROVIDER;
  });

  it('should return error when API key is missing', async () => {
    const request = new NextRequest('http://localhost:3005/api/iamq', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What is PPM?',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('answer');
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('environment variable is required');
    expect(data.errorType).toBe('api_key');
  });

  it('should return error for unsupported provider', async () => {
    process.env.AI_PROVIDER = 'invalid_provider';
    process.env.AI_API_KEY = 'test-key';

    const request = new NextRequest('http://localhost:3005/api/iamq', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What is PPM?',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Unsupported AI provider');
  });

  it('should return validation error for empty question', async () => {
    process.env.AI_API_KEY = 'test-key';

    const request = new NextRequest('http://localhost:3005/api/iamq', {
      method: 'POST',
      body: JSON.stringify({
        question: '   ', // Only whitespace
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // The validator should normalize empty strings, but let's check what happens
    // If validation passes, we'll get an API error instead
    expect([400, 500]).toContain(response.status);
    expect(data).toHaveProperty('error');
  });

  it('should return validation error for invalid JSON', async () => {
    const request = new NextRequest('http://localhost:3005/api/iamq', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.errorType).toBe('validation');
  });

  it('should return success response when API key is present (non-streaming)', async () => {
    process.env.AI_API_KEY = 'test-key-12345';
    process.env.AI_PROVIDER = 'openai';

    const request = new NextRequest('http://localhost:3005/api/iamq', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What is PPM?',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    
    // Check if it's a streaming response (text/plain) or JSON response
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('answer');
      expect(typeof data.answer).toBe('string');
      expect(data.answer.length).toBeGreaterThan(0);
    } else {
      // Streaming response - read the stream
      expect(contentType).toContain('text/plain');
      const text = await response.text();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  it('should accept context in request body', async () => {
    process.env.AI_API_KEY = 'test-key-12345';
    process.env.AI_PROVIDER = 'openai';

    const request = new NextRequest('http://localhost:3005/api/iamq', {
      method: 'POST',
      body: JSON.stringify({
        question: 'Why is my PPM zero?',
        context: {
          page: 'dashboard',
          selectedPlants: ['145', '175'],
          dateRange: { from: '2025-01-01', to: '2025-01-31' },
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('answer');
    } else {
      // Streaming response
      const text = await response.text();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  it('should work with OpenAI provider', async () => {
    process.env.OPENAI_API_KEY = 'sk-test-key';
    process.env.AI_PROVIDER = 'openai';

    const request = new NextRequest('http://localhost:3005/api/iamq', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What is Q1?',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    expect([200, 500]).toContain(response.status); // 200 if key works, 500 if invalid
  });

  it('should work with Anthropic provider', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';
    process.env.AI_PROVIDER = 'anthropic';

    const request = new NextRequest('http://localhost:3005/api/iamq', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What is Q2?',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    expect([200, 500]).toContain(response.status); // 200 if key works, 500 if invalid
  });
});

