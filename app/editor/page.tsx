'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../src/hooks/useAuth';
import MonacoEditor from '../../components/editor/MonacoEditor';
import CodePreview from '../../components/editor/CodePreview';
import { 
  Play, 
  Save, 
  Download, 
  Code, 
  Eye, 
  Sparkles,
  ArrowLeft,
  Loader2,
  Wand2,
  FileText,
  GripVertical
} from 'lucide-react';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'preview'>('prompt');
  const [isEditing, setIsEditing] = useState(false);
  const [language, setLanguage] = useState<'javascript' | 'typescript'>('javascript');
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
    if (!generatedCode.trim()) return;
    
    try {
      // Save functionality - you can implement actual save logic here
      console.log('Saving project...', { code: generatedCode, projectId });
      // Example API call:
      // await fetch('/api/projects/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code: generatedCode, projectId })
      // });
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setGeneratedCode(newCode);
    setIsEditing(true);
  };

  const handleLanguageChange = (newLanguage: 'javascript' | 'typescript') => {
    setLanguage(newLanguage);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 glass-effect border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="hover:bg-primary/10 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse-glow" />
                  <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient">AI App Builder</h1>
                  <div className="text-xs text-muted-foreground font-medium">Editor</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                variant="outline"
                onClick={handleSave}
                className="border-2 hover:bg-success/5 hover:border-success/50 hover:text-success"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                className="border-2 hover:bg-primary/5 hover:border-primary/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-[calc(100vh-240px)]">
          <PanelGroup direction="horizontal" className="h-full">
            {/* Enhanced Left Panel - Prompt */}
            <Panel defaultSize={40} minSize={30} className="pr-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="h-full"
              >
                <Card className="flex flex-col h-full glass-effect border-2 border-primary/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-2xl">
                      <div className="p-2 bg-primary/10 rounded-lg mr-3">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div>Describe Your App</div>
                        <div className="text-sm font-normal text-muted-foreground mt-1">
                          Tell AI what you want to build
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="relative flex-1">
                      <Textarea
                        placeholder="Describe the app you want to build in detail...

For example:
• 'Create a modern todo app with dark mode, drag and drop functionality, and local storage'
• 'Build a dashboard with charts, user management, and real-time updates'
• 'Design a landing page with hero section, features, testimonials, and contact form'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 min-h-[300px] resize-none text-lg leading-relaxed border-2 focus:border-primary/50 bg-background/50 backdrop-blur-sm"
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                        {prompt.length} characters
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {/* Quick Suggestions */}
                      <div className="flex flex-wrap gap-2">
                        {['Todo App', 'Dashboard', 'Landing Page', 'E-commerce'].map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => setPrompt(`Create a ${suggestion.toLowerCase()} with modern design and functionality`)}
                            className="text-xs hover:bg-primary/5 hover:border-primary/50"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>

                      {/* Generate Button */}
                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleGenerate}
                          disabled={loading || !prompt.trim()}
                          className="w-full h-14 text-lg btn-gradient shadow-glow hover:shadow-glow-lg relative overflow-hidden"
                        >
                          {loading ? (
                            <>
                              <div className="flex items-center">
                                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                <span>Generating Your App...</span>
                                <div className="loading-dots ml-3">
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-3" />
                              <span>Generate App with AI</span>
                              <Sparkles className="h-4 w-4 ml-3 animate-pulse" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Panel>

            {/* Resize Handle */}
            <PanelResizeHandle className="w-2 bg-transparent hover:bg-primary/20 transition-colors duration-200 flex items-center justify-center group">
              <div className="w-1 h-16 bg-border group-hover:bg-primary/50 rounded-full transition-colors duration-200"></div>
            </PanelResizeHandle>

            {/* Enhanced Right Panel - Code/Preview */}
            <Panel defaultSize={60} minSize={40} className="pl-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-full"
              >
                <Card className="flex flex-col h-full glass-effect border-2 border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-xl">
                        <div className="p-2 bg-primary/10 rounded-lg mr-3">
                          <Code className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div>Generated Code</div>
                          <div className="text-sm font-normal text-muted-foreground mt-1">
                            AI-powered React application {isEditing && '(Modified)'}
                          </div>
                        </div>
                      </CardTitle>
                      <div className="flex items-center space-x-3">
                        {/* Language Selector */}
                        <div className="flex border-2 border-border rounded-lg overflow-hidden">
                          <Button
                            variant={language === 'javascript' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleLanguageChange('javascript')}
                            className={language === 'javascript' ? 'btn-gradient text-xs' : 'hover:bg-primary/5 text-xs'}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            JS
                          </Button>
                          <Button
                            variant={language === 'typescript' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleLanguageChange('typescript')}
                            className={language === 'typescript' ? 'btn-gradient text-xs' : 'hover:bg-primary/5 text-xs'}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            TS
                          </Button>
                        </div>
                        {/* Tab Selector */}
                        <div className="flex border-2 border-border rounded-lg overflow-hidden">
                          <Button
                            variant={activeTab === 'code' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('code')}
                            className={activeTab === 'code' ? 'btn-gradient' : 'hover:bg-primary/5'}
                          >
                            <Code className="h-4 w-4 mr-1" />
                            Code
                          </Button>
                          <Button
                            variant={activeTab === 'preview' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('preview')}
                            className={activeTab === 'preview' ? 'btn-gradient' : 'hover:bg-primary/5'}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    {activeTab === 'code' ? (
                      generatedCode ? (
                        <div className="flex-1">
                          <MonacoEditor
                            value={generatedCode}
                            onChange={handleCodeChange}
                            language={language}
                            height="100%"
                            className="rounded-b-lg overflow-hidden"
                          />
                        </div>
                      ) : (
                        <div className="flex-1 relative p-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                            <div className="text-center">
                              <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                                </div>
                                <div className="relative">
                                  <Code className="h-16 w-16 mx-auto text-primary/50 animate-float" />
                                </div>
                              </div>
                              <h3 className="text-xl font-semibold mb-2">Code Ready to Generate</h3>
                              <p className="text-muted-foreground max-w-sm">
                                Your AI-generated React code will appear here with professional Monaco Editor.
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="flex-1">
                        <CodePreview
                          code={generatedCode}
                          language={language}
                          className="h-full rounded-b-lg overflow-hidden"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}