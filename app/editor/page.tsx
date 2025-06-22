'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, ArrowLeft, Loader2, Play, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';

export default function EditorPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectName, setProjectName] = useState('');

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();
      if (result.success) {
        const appStructure = result.data.appStructure;
        const mainComponent = appStructure.components['App.tsx'] || 
                            Object.values(appStructure.components)[0];
        setGeneratedCode(mainComponent);
        setProjectName(result.data.project?.name || 'Generated App');
        toast.success('App generated successfully!');
      } else {
        toast.error(result.error || 'Generation failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedCode) {
      toast.error('No code to download');
      return;
    }

    const blob = new Blob([generatedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'App.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const handlePreview = () => {
    if (!generatedCode) {
      toast.error('No code to preview');
      return;
    }
    
    // Create a simple preview in a new window
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>App Preview</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="root"></div>
          <script>
            // This is a simplified preview - in production you'd use proper bundling
            console.log('Preview mode - code would be rendered here');
          </script>
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-semibold">AI App Editor</h1>
              </div>
            </div>
            {generatedCode && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handlePreview}>
                  <Play className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Describe Your App
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the app you want to build in detail...

Examples:
• Create a todo app with add, edit, delete functionality and dark mode
• Build a weather dashboard with current conditions and 5-day forecast
• Make a calculator app with basic arithmetic operations
• Design a portfolio website with projects showcase and contact form"
                  className="flex-1 min-h-[200px] resize-none"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate App with AI
                    </>
                  )}
                </Button>
                {projectName && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Project: {projectName}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Code Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Code</span>
                  {generatedCode && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      ✓ Ready
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="h-full border-t">
                  <Editor
                    height="100%"
                    defaultLanguage="typescript"
                    value={generatedCode || '// Your AI-generated React code will appear here...\n// Describe your app in the left panel and click "Generate App with AI"'}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      readOnly: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                    onChange={(value) => setGeneratedCode(value || '')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}