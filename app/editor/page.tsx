'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../src/hooks/useAuth';
import { 
  Play, 
  Save, 
  Download, 
  Code, 
  Eye, 
  Sparkles,
  ArrowLeft,
  Loader2
} from 'lucide-react';

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  wordWrap: 'on' as const,
  readOnly: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  quickSuggestions: true,
  formatOnPaste: true,
  formatOnType: true
};

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'preview'>('prompt');
  const projectId = searchParams.get('project');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, router]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, projectId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedCode(data.code);
        setActiveTab('code');
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Save functionality
    console.log('Saving project...');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-semibold">AI App Builder</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Prompt */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Describe Your App
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Textarea
                placeholder="Describe the app you want to build... For example: 'Create a todo app with dark mode, drag and drop functionality, and local storage'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 min-h-[200px] resize-none"
              />
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={handleGenerate} 
                  disabled={loading || !prompt.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate App
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Code/Preview */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Generated Code
                </CardTitle>
                <div className="flex border rounded-md">
                  <Button
                    variant={activeTab === 'code' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('code')}
                  >
                    Code
                  </Button>
                  <Button
                    variant={activeTab === 'preview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('preview')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {activeTab === 'code' ? (
                <div className="flex-1 bg-gray-900 rounded-md p-4 overflow-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                    {generatedCode || '// Your generated code will appear here...'}
                  </pre>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-md border flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Preview will be available after code generation</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}