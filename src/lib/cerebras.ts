import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { validateReactComponent, ensureReactImports, cleanupCode, formatCode } from '../utils/codeFormatter';

// Initialize Cerebras client
const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

interface CodeGenerationResult {
  code: string;
  files?: { [filename: string]: string };
}

/**
 * Creates a comprehensive prompt for generating React applications
 */
function createReactAppPrompt(userDescription: string): string {
  return `You are an expert React developer. Generate a complete, functional React application based on the following description:

"${userDescription}"

Requirements:
1. Generate a complete React component that can be run immediately
2. Use modern React with TypeScript and functional components with hooks
3. Include proper TypeScript interfaces and types
4. Use Tailwind CSS for styling with responsive design
5. Include proper error handling and loading states where appropriate
6. Follow React best practices and clean code principles
7. Include proper accessibility attributes
8. Make the component interactive and functional
9. Use modern ES6+ syntax

The generated code should be production-ready and follow these patterns:
- Use proper component structure with clear prop interfaces
- Include inline comments only for complex logic
- Use semantic HTML elements
- Implement proper state management with useState/useEffect where needed
- Handle edge cases and provide fallbacks

Generate ONLY the React component code. Do not include explanations, markdown formatting, or additional text. Start directly with the import statements and end with the export statement.

Example structure:
\`\`\`tsx
import React, { useState, useEffect } from 'react';

interface ComponentProps {
  // Define props here
}

export default function GeneratedComponent({ ...props }: ComponentProps) {
  // Component implementation
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
}
\`\`\`

Generate the complete React component now:`;
}

/**
 * Parses the AI response to extract clean code
 */
function parseGeneratedCode(response: string): string {
  // Remove markdown code blocks if present
  let cleanCode = response.trim();
  
  // Remove ```tsx, ```javascript, ```jsx, or ``` at the beginning
  cleanCode = cleanCode.replace(/^```(?:tsx|javascript|jsx|js|ts)?\n?/i, '');
  
  // Remove trailing ```
  cleanCode = cleanCode.replace(/\n?```$/i, '');
  
  // Ensure the code starts with import statements or component declaration
  if (!cleanCode.match(/^(import|export|interface|type|function|const|class)/)) {
    // If the code doesn't start properly, try to find the actual code block
    const codeBlockMatch = cleanCode.match(/```(?:tsx|javascript|jsx|js|ts)?\n?([\s\S]*?)\n?```/i);
    if (codeBlockMatch) {
      cleanCode = codeBlockMatch[1];
    }
  }
  
  return cleanCode.trim();
}

/**
 * Validates that the generated code is a valid React component
 */
function validateReactCode(code: string): boolean {
  // Basic validation checks
  const hasImport = code.includes('import') || code.includes('require');
  const hasExport = code.includes('export') || code.includes('module.exports');
  const hasReact = code.includes('React') || code.includes('useState') || code.includes('useEffect');
  const hasJSX = code.includes('<') && code.includes('>');
  
  return hasExport && (hasReact || hasJSX);
}

/**
 * Generates React application code using Cerebras AI
 */
export async function generateAppCode(prompt: string): Promise<string> {
  try {
    if (!process.env.CEREBRAS_API_KEY) {
      throw new Error('CEREBRAS_API_KEY environment variable is not set');
    }

    const systemPrompt = createReactAppPrompt(prompt);
    
    const response = await cerebras.chat.completions.create({
      model: 'llama3.1-70b',
      messages: [
        {
          role: 'system',
          content: 'You are an expert React developer who generates clean, functional React components.'
        },
        {
          role: 'user',
          content: systemPrompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
      top_p: 0.9,
    });

    const choice = response.choices?.[0] as any;
    if (!choice?.message?.content) {
      throw new Error('No response received from Cerebras AI');
    }

    let generatedCode = parseGeneratedCode(choice.message.content);
    
    // Ensure React imports are present
    generatedCode = ensureReactImports(generatedCode);
    
    // Clean up and format the code
    generatedCode = cleanupCode(generatedCode);
    generatedCode = formatCode(generatedCode);
    
    // Validate the generated code
    const validation = validateReactComponent(generatedCode);
    if (!validation.isValid) {
      console.warn('Generated code validation warnings:', validation.warnings);
      if (validation.errors.length > 0) {
        throw new Error(`Generated code validation failed: ${validation.errors.join(', ')}`);
      }
    }

    return generatedCode;
  } catch (error) {
    console.error('Error generating code with Cerebras AI:', error);
    
    // Provide a fallback implementation
    const fallbackCode = `import React, { useState } from 'react';

interface GeneratedAppProps {
  title?: string;
}

export default function GeneratedApp({ title = "Generated Application" }: GeneratedAppProps) {
  const [message, setMessage] = useState<string>('Hello from your generated app!');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
          <p className="text-gray-600 mb-4">
            Based on your prompt: "${prompt}"
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-blue-800">{message}</p>
          </div>
          <button
            onClick={() => setMessage('Button clicked! The app is working.')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Test Interaction
          </button>
        </div>
      </div>
    </div>
  );
}`;

    // If AI generation fails, return fallback with error context
    if (error instanceof Error) {
      throw new Error(`AI generation failed: ${error.message}`);
    } else {
      throw new Error('AI generation failed with unknown error');
    }
  }
}

/**
 * Enhanced service interface for code generation
 */
export const cerebrasService = {
  async generate(prompt: string): Promise<CodeGenerationResult> {
    try {
      const code = await generateAppCode(prompt);
      return { code };
    } catch (error) {
      console.error('Cerebras service error:', error);
      throw error;
    }
  },

  async generateWithFiles(prompt: string): Promise<CodeGenerationResult> {
    // Future enhancement: generate multiple files for complex applications
    const code = await generateAppCode(prompt);
    
    return {
      code,
      files: {
        'App.tsx': code,
        'styles.css': `/* Generated styles for: ${prompt} */\n/* Add any additional styles here */`
      }
    };
  },

  async validateApiKey(): Promise<boolean> {
    try {
      if (!process.env.CEREBRAS_API_KEY) {
        return false;
      }
      
      // Test API key with a simple request
      const response = await cerebras.chat.completions.create({
        model: 'llama3.1-70b',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      });
      
      const choice = response.choices?.[0] as any;
      return !!choice?.message?.content;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }
};

// Export types for use in other modules
export type { CodeGenerationResult };
