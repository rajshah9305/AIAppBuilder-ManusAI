'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface CodePreviewProps {
  code: string;
  language: 'javascript' | 'typescript';
  className?: string;
}

export default function CodePreview({ code, language, className = '' }: CodePreviewProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    generatePreview();
  }, [code, language]);

  const generatePreview = async () => {
    if (!code.trim()) {
      setPreviewContent('');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Transform the code to a complete HTML document
      const htmlContent = generateHTMLContent(code);
      setPreviewContent(htmlContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
    } finally {
      setIsLoading(false);
    }
  };

  const generateHTMLContent = (code: string): string => {
    // Basic React/JSX to HTML transformation
    // This is a simplified version - in production you'd want a proper transpiler
    let transformedCode = code;

    // Remove imports and exports
    transformedCode = transformedCode.replace(/^import.*$/gm, '');
    transformedCode = transformedCode.replace(/^export.*$/gm, '');

    // Simple JSX to HTML transformation
    transformedCode = transformedCode.replace(/className/g, 'class');
    transformedCode = transformedCode.replace(/onClick/g, 'onclick');
    transformedCode = transformedCode.replace(/onChange/g, 'onchange');

    // Extract component content
    const componentMatch = transformedCode.match(/return\s*\(([\s\S]*)\);?\s*}/);
    let componentHTML = '';
    
    if (componentMatch) {
      componentHTML = componentMatch[1];
    } else {
      // If no return statement, try to find JSX directly
      const jsxMatch = transformedCode.match(/<[^>]+>[\s\S]*<\/[^>]+>/);
      if (jsxMatch) {
        componentHTML = jsxMatch[0];
      } else {
        componentHTML = transformedCode;
      }
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .preview-wrapper {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            min-height: 400px;
        }
        
        /* Common component styles */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            text-decoration: none;
        }
        
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2563eb;
        }
        
        .btn-secondary {
            background: #6b7280;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #4b5563;
        }
        
        .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 16px;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
            color: #374151;
        }
        
        .form-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .grid {
            display: grid;
            gap: 16px;
        }
        
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        
        @media (max-width: 768px) {
            .grid-cols-2, .grid-cols-3 {
                grid-template-columns: repeat(1, minmax(0, 1fr));
            }
        }
        
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        
        .mb-4 { margin-bottom: 16px; }
        .mb-8 { margin-bottom: 32px; }
        .mt-4 { margin-top: 16px; }
        .mt-8 { margin-top: 32px; }
        
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .space-x-4 > * + * { margin-left: 16px; }
        .space-y-4 > * + * { margin-top: 16px; }
        
        .w-full { width: 100%; }
        .h-full { height: 100%; }
        
        .error {
            color: #ef4444;
            background: #fee2e2;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #fecaca;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="preview-wrapper">
            <div id="root"></div>
        </div>
    </div>
    
    <script type="text/babel">
        const { useState, useEffect } = React;
        
        try {
            // Component code
            ${transformedCode}
            
            // Render to DOM
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(<App />);
        } catch (error) {
            document.getElementById('root').innerHTML = \`
                <div class="error">
                    <h3>Preview Error</h3>
                    <p>\${error.message}</p>
                    <small>Please check your code syntax and try again.</small>
                </div>
            \`;
        }
    </script>
</body>
</html>`;
  };

  const refreshPreview = () => {
    generatePreview();
  };

  const openInNewTab = () => {
    if (previewContent) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(previewContent);
        newWindow.document.close();
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const containerClass = `${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'relative'}`;

  return (
    <div className={containerClass}>
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="h-8 w-8 p-0"
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
              className="h-8 w-8 p-0"
              title="Tablet View"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="h-8 w-8 p-0"
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="text-sm text-muted-foreground">
            {previewMode.charAt(0).toUpperCase() + previewMode.slice(1)} Preview
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPreview}
            disabled={isLoading}
            className="h-8 w-8 p-0 hover:bg-primary/5"
            title="Refresh Preview"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openInNewTab}
            disabled={!previewContent}
            className="h-8 w-8 p-0 hover:bg-primary/5"
            title="Open in New Tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0 hover:bg-primary/5"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-60px)]' : 'h-full'} w-full bg-muted/20 flex items-center justify-center p-4`}>
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Generating preview...</span>
          </div>
        ) : error ? (
          <Card className="p-6 max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-destructive">Preview Error</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshPreview} size="sm" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Card>
        ) : !previewContent ? (
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              </div>
              <div className="relative">
                <Monitor className="h-16 w-16 mx-auto text-primary/50 animate-float" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Preview Ready</h3>
            <p className="text-muted-foreground max-w-sm">
              Your generated code will be rendered here with live preview functionality.
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="bg-white rounded-lg shadow-xl border border-border overflow-hidden"
              style={getPreviewDimensions()}
            >
              <iframe
                ref={iframeRef}
                srcDoc={previewContent}
                className="w-full h-full border-0"
                title="Code Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 text-xs text-muted-foreground bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center space-x-4">
          <span>Preview Mode: {previewMode}</span>
          {previewContent && (
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Ready</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {previewMode !== 'desktop' && (
            <span>{getPreviewDimensions().width} × {getPreviewDimensions().height}</span>
          )}
        </div>
      </div>
    </div>
  );
}
