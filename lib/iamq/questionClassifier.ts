/**
 * Question classifier for I AM Q
 * Detects question types to apply appropriate response templates
 */

export type QuestionMode = 'chart_explainer' | 'general';

/**
 * Classify a question to determine the response mode
 */
export function classifyQuestion(question: string): QuestionMode {
  const normalized = question.toLowerCase().trim();
  
  // Chart-related keywords
  const chartKeywords = [
    'chart',
    'graph',
    'trend',
    'bar',
    'line',
    'table',
    'visualization',
    'plot',
    'diagram',
    'figure',
    'what does this chart',
    'explain this chart',
    'how to read',
    'what does the chart show',
    'chart meaning',
  ];

  // Check if question contains any chart-related keywords
  const isChartQuestion = chartKeywords.some(keyword => normalized.includes(keyword));

  return isChartQuestion ? 'chart_explainer' : 'general';
}

