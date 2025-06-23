export async function generateAppCode(prompt: string): Promise<string> {
  // Mock implementation - replace with actual Cerebras API call
  return `// Generated code based on: ${prompt}\n\nfunction generatedApp() {\n  console.log('Hello from generated app!');\n  return 'Generated application';\n}\n\nexport default generatedApp;`;
}

export const cerebrasService = {
  async generate(prompt: string) {
    return { code: await generateAppCode(prompt) };
  }
};