/**
 * Smoke test script for I AM Q API route
 * 
 * Usage:
 *   npm run dev  # In one terminal
 *   npx tsx scripts/test-iamq.ts  # In another terminal
 * 
 * Or if the server is already running:
 *   npx tsx scripts/test-iamq.ts
 * 
 * This script tests the /api/iamq endpoint without requiring real API keys.
 * It will pass if the endpoint returns a proper response structure (even if it's an error about missing keys).
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';
const ENDPOINT = `${API_URL}/api/iamq`;

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

const results: TestResult[] = [];

function logResult(result: TestResult) {
  results.push(result);
  const icon = result.passed ? '✓' : '✗';
  const status = result.passed ? 'PASS' : 'FAIL';
  console.log(`${icon} [${status}] ${result.name}`);
  if (result.message) {
    console.log(`   ${result.message}`);
  }
  if (result.details) {
    console.log(`   Details: ${result.details}`);
  }
}

async function testIAMQEndpoint(): Promise<void> {
  console.log('🧪 Testing I AM Q API endpoint...\n');
  console.log(`📍 Endpoint: ${ENDPOINT}\n`);

  // Test 1: Basic request with trivial question
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'What is PPM?',
      }),
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('text/plain')) {
      // Streaming response
      const text = await response.text();
      logResult({
        name: 'Basic request (streaming)',
        passed: response.status === 200 && text.length > 0,
        message: `Status: ${response.status}, Response length: ${text.length} chars`,
        details: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      });
    } else {
      // JSON response
      const data = await response.json();
      
      if (response.status === 200) {
        // Success case
        logResult({
          name: 'Basic request (success)',
          passed: typeof data.answer === 'string' && data.answer.length > 0,
          message: `Status: ${response.status}, Answer length: ${data.answer.length} chars`,
          details: data.answer.substring(0, 100) + (data.answer.length > 100 ? '...' : ''),
        });
      } else if (response.status === 500 && data.error) {
        // Expected error when API key is missing
        const isExpectedError = 
          data.error.includes('environment variable is required') ||
          data.error.includes('API key') ||
          data.error.includes('configuration');
        
        logResult({
          name: 'Basic request (missing API key)',
          passed: isExpectedError,
          message: `Status: ${response.status}, Error type: ${data.errorType || 'unknown'}`,
          details: data.error,
        });
      } else {
        // Unexpected error
        logResult({
          name: 'Basic request',
          passed: false,
          message: `Unexpected status: ${response.status}`,
          details: JSON.stringify(data, null, 2),
        });
      }
    }
  } catch (error) {
    logResult({
      name: 'Basic request (network error)',
      passed: false,
      message: 'Failed to connect to API',
      details: error instanceof Error ? error.message : String(error),
    });
  }

  // Test 2: Request with context
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'Why is my PPM zero?',
        context: {
          page: 'dashboard',
          selectedPlants: ['145', '175'],
        },
      }),
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('text/plain')) {
      const text = await response.text();
      logResult({
        name: 'Request with context (streaming)',
        passed: response.status === 200 && text.length > 0,
        message: `Status: ${response.status}, Response length: ${text.length} chars`,
      });
    } else {
      const data = await response.json();
      logResult({
        name: 'Request with context',
        passed: response.status === 200 || (response.status === 500 && data.errorType === 'api_key'),
        message: `Status: ${response.status}`,
        details: response.status === 200 ? `Answer: ${data.answer.substring(0, 50)}...` : `Error: ${data.error}`,
      });
    }
  } catch (error) {
    logResult({
      name: 'Request with context',
      passed: false,
      message: 'Failed to connect to API',
      details: error instanceof Error ? error.message : String(error),
    });
  }

  // Test 3: Invalid JSON
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const data = await response.json();
    logResult({
      name: 'Invalid JSON handling',
      passed: response.status === 400 && data.errorType === 'validation',
      message: `Status: ${response.status}, Error type: ${data.errorType || 'unknown'}`,
      details: data.error,
    });
  } catch (error) {
    logResult({
      name: 'Invalid JSON handling',
      passed: false,
      message: 'Unexpected error',
      details: error instanceof Error ? error.message : String(error),
    });
  }

  // Test 4: Empty question (should be normalized or rejected)
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: '   ',
      }),
    });

    const data = await response.json();
    logResult({
      name: 'Empty question handling',
      passed: response.status === 400 || response.status === 500,
      message: `Status: ${response.status}`,
      details: data.error || 'No error message',
    });
  } catch (error) {
    logResult({
      name: 'Empty question handling',
      passed: false,
      message: 'Unexpected error',
      details: error instanceof Error ? error.message : String(error),
    });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = passed === total;

  console.log(`\n📊 Test Results: ${passed}/${total} passed\n`);

  if (allPassed) {
    console.log('✅ All tests passed! The I AM Q endpoint is working correctly.');
    console.log('\n💡 Note: If you see "missing API key" errors, that\'s expected when');
    console.log('   AI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY is not set.');
    console.log('   The endpoint is still functioning correctly - it\'s just missing credentials.');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Check the details above.');
    console.log('\n💡 Make sure the Next.js dev server is running:');
    console.log('   npm run dev');
    process.exit(1);
  }
}

// Run the tests
testIAMQEndpoint().catch((error) => {
  console.error('❌ Fatal error running tests:', error);
  process.exit(1);
});

