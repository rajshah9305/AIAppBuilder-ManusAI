import { Cerebras } from '@cerebras/cerebras_cloud_sdk';

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export interface GenerationOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export class CerebrasService {
  private static instance: CerebrasService;

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

    try {
      if (stream) {
        return await this.generateStreamingCode(prompt, systemPrompt, temperature, maxTokens);
      }

      const completion = await client.chat.completions.create({
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
        model: "llama-4-scout-17b-16e-instruct",
        max_completion_tokens: maxTokens,
        temperature,
        top_p: 1
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Cerebras API Error:', error);
      throw new Error('Failed to generate code with Cerebras AI');
    }
  }

  async generateStreamingCode(
    prompt: string, 
    systemPrompt: string, 
    temperature: number, 
    maxTokens: number
  ): Promise<string> {
    try {
      const stream = await client.chat.completions.create({
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
        model: "llama-4-scout-17b-16e-instruct",
        stream: true,
        max_completion_tokens: maxTokens,
        temperature,
        top_p: 1
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
      }

      return fullResponse;
    } catch (error) {
      console.error('Cerebras Streaming Error:', error);
      throw new Error('Failed to generate streaming code with Cerebras AI');
    }
  }

  async generateAppStructure(description: string): Promise<{
    components: Record<string, string>;
    styles: string;
    packageJson: string;
  }> {
    const prompt = `Create a complete React application: "${description}"

Generate a JSON response with:
{
  "components": {
    "App.tsx": "main app component code",
    "components/Header.tsx": "header component code"
  },
  "styles": "tailwind css classes",
  "packageJson": "package.json content"
}

Use React 18, TypeScript, Tailwind CSS. Make it production-ready.`;

    const systemPrompt = `You are an expert React developer. Generate clean, production-ready code. Always return valid JSON.`;

    try {
      const response = await this.generateCode({
        prompt,
        systemPrompt,
        temperature: 0.1,
        maxTokens: 4000
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getFallbackStructure(description);
    } catch (error) {
      console.error('App structure generation error:', error);
      return this.getFallbackStructure(description);
    }
  }

  private getFallbackStructure(description: string) {
    return {
      components: {
        "App.tsx": `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Generated App</h1>
          <p className="text-lg text-gray-600">${description}</p>
        </header>
        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
            <p className="text-gray-700">Your AI-generated React application is ready.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;`
      },
      styles: "/* Tailwind CSS styles */",
      packageJson: JSON.stringify({
        "name": "generated-app",
        "version": "1.0.0",
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "typescript": "^5.0.0",
          "tailwindcss": "^3.3.0"
        }
      }, null, 2)
    };
  }
}

export const cerebrasService = CerebrasService.getInstance();