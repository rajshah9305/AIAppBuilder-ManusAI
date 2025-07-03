import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/Card";
import {
  X,
  Sparkles,
  Loader2,
  Lightbulb,
  Rocket,
  Code
} from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

const projectTemplates = [
  {
    name: "Todo App",
    description: "A simple task management application",
    icon: <Code className="h-5 w-5" />,
    prompt: "Create a todo app with add, edit, delete, and mark complete functionality"
  },
  {
    name: "Dashboard",
    description: "Analytics dashboard with charts",
    icon: <Rocket className="h-5 w-5" />,
    prompt: "Build an analytics dashboard with charts, metrics, and data visualization"
  },
  {
    name: "Landing Page",
    description: "Modern marketing website",
    icon: <Lightbulb className="h-5 w-5" />,
    prompt: "Design a modern landing page with hero section, features, and contact form"
  }
];

export function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setSelectedTemplate(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });

      if (response.ok) {
        const project = await response.json();
        onProjectCreated(project);
        setName('');
        setDescription('');
        setSelectedTemplate(null);
        onClose();
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (index: number) => {
    const template = projectTemplates[index];
    setSelectedTemplate(index);
    setName(template.name);
    setDescription(template.prompt);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl"
          >
            <Card className="glass-effect border-2 border-primary/20 shadow-2xl">
              {/* Header */}
              <CardHeader className="relative pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Create New Project</CardTitle>
                      <p className="text-muted-foreground mt-1">
                        Start building your AI-powered application
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Quick Templates */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Start Templates</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {projectTemplates.map((template, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => handleTemplateSelect(index)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                          selectedTemplate === index
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`p-1.5 rounded-lg ${
                            selectedTemplate === index ? 'bg-primary text-white' : 'bg-muted'
                          }`}>
                            {template.icon}
                          </div>
                          <span className="font-medium">{template.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Project Name *
                      </label>
                      <Input
                        placeholder="Enter your project name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 text-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Description
                      </label>
                      <Textarea
                        placeholder="Describe what you want to build..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px] resize-none"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 h-12"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !name.trim()}
                      className="flex-1 h-12 btn-gradient"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Create Project
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}