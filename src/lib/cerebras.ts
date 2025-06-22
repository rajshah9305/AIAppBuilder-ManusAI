interface CerebrasResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface CerebrasStreamChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
  }>;
}

export interface GenerationOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export class CerebrasService {
  private static instance: CerebrasService;
  private apiKey: string;
  private baseUrl: string = 'https://api.cerebras.ai/v1';

  constructor() {
    this.apiKey = process.env.CEREBRAS_API_KEY || '';
  }

  static getInstance(): CerebrasService {
    if (!CerebrasService.instance) {
      CerebrasService.instance = new CerebrasService();
    }
    return CerebrasService.instance;
  }

  async generateCode(options: GenerationOptions): Promise<string> {
    const {
      prompt,
      systemPrompt = "You are an expert React developer. Generate clean, production-ready code with modern best practices.",
      temperature = 0.2,
      maxTokens = 2048,
      stream = false
    } = options;

    if (!this.apiKey) {
      return this.getFallbackCode(prompt);
    }

    try {
      if (stream) {
        return await this.generateStreamingCode(prompt, systemPrompt, temperature, maxTokens);
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: prompt
            }
          ],
          model: "llama-3.3-70b",
          max_completion_tokens: maxTokens,
          temperature,
          top_p: 1
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CerebrasResponse = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackCode(prompt);
    } catch (error) {
      console.error('Cerebras API Error:', error);
      return this.getFallbackCode(prompt);
    }
  }

  async generateStreamingCode(
    prompt: string, 
    systemPrompt: string, 
    temperature: number, 
    maxTokens: number
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: prompt
            }
          ],
          model: "llama-3.3-70b",
          stream: true,
          max_completion_tokens: maxTokens,
          temperature,
          top_p: 1
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let fullResponse = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed: CerebrasStreamChunk = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              fullResponse += content;
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      return fullResponse || this.getFallbackCode(prompt);
    } catch (error) {
      console.error('Cerebras Streaming Error:', error);
      return this.getFallbackCode(prompt);
    }
  }

  async generateAppStructure(description: string): Promise<{
    components: Record<string, string>;
    styles: string;
    packageJson: string;
  }> {
    const prompt = `Create a complete React application: "${description}"

Generate a JSON response with this exact structure:
{
  "components": {
    "App.tsx": "complete React component code here"
  },
  "styles": "tailwind css classes and custom styles",
  "packageJson": "package.json content as string"
}

Requirements:
- Use React 18 with TypeScript
- Use Tailwind CSS for styling
- Include proper component structure
- Add responsive design
- Make it production-ready
- Return ONLY valid JSON`;

    const systemPrompt = `You are an expert React developer. Generate clean, production-ready code. Always return valid JSON format only.`;

    try {
      const response = await this.generateCode({
        prompt,
        systemPrompt,
        temperature: 0.1,
        maxTokens: 4000
      });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          components: parsed.components || { "App.tsx": this.getFallbackCode(description) },
          styles: parsed.styles || "/* Tailwind CSS styles */",
          packageJson: parsed.packageJson || this.getFallbackPackageJson()
        };
      }

      return this.getFallbackStructure(description);
    } catch (error) {
      console.error('App structure generation error:', error);
      return this.getFallbackStructure(description);
    }
  }

  private getFallbackCode(description: string): string {
    return `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Generated App
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            ${description}
          </p>
        </header>
        
        <main className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Interactive Counter</h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <span className="text-4xl font-bold text-blue-600">{count}</span>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => setCount(count - 1)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Decrease
              </button>
              <button
                onClick={() => setCount(0)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setCount(count + 1)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Increase
              </button>
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-8 text-gray-500">
          <p>Generated by AI App Builder</p>
        </footer>
      </div>
    </div>
  );
}

export default App;`;
  }

  private getFallbackStructure(description: string) {
    return {
      components: {
        "App.tsx": this.getFallbackCode(description)
      },
      styles: "/* Tailwind CSS styles */",
      packageJson: this.getFallbackPackageJson()
    };
  }

  private getFallbackPackageJson(): string {
    return JSON.stringify({
      "name": "generated-app",
      "version": "1.0.0",
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "typescript": "^5.0.0",
        "tailwindcss": "^3.3.0"
      },
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start"
      }
    }, null, 2);
  }
}

export const cerebrasService = CerebrasService.getInstance();