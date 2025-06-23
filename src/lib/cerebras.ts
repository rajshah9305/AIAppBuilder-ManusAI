const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;
const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions';

interface CerebrasMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CerebrasRequest {
  model: string;
  messages: CerebrasMessage[];
  max_tokens?: number;
  temperature?: number;
}

const SYSTEM_PROMPT = `You are an expert React/Next.js developer. Generate clean, modern, production-ready code based on user requirements.

Rules:
- Use TypeScript
- Use Tailwind CSS for styling
- Use modern React patterns (hooks, functional components)
- Include proper error handling
- Make components responsive
- Add proper TypeScript types
- Include comments for complex logic
- Generate complete, runnable code

Return only the code without explanations.`;

export async function generateAppCode(prompt: string): Promise<string> {
  if (!CEREBRAS_API_KEY) {
    throw new Error('Cerebras API key not configured');
  }

  const request: CerebrasRequest = {
    model: 'llama3.1-70b',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Generate a React component for: ${prompt}` }
    ],
    max_tokens: 4000,
    temperature: 0.7
  };

  try {
    const response = await fetch(CEREBRAS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Failed to generate code';
  } catch (error) {
    console.error('Cerebras API error:', error);
    throw new Error('Failed to generate code with AI');
  }
}

// Fallback function for development/testing
export function runCerebrasJob(data: any): Promise<any> {
  return Promise.resolve({ status: "ok", data });
}