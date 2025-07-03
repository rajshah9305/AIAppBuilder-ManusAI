'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Monaco from '@monaco-editor/react';
import { Button } from '../ui/Button';
import { 
  Maximize2, 
  Minimize2, 
  Copy, 
  Download, 
  RotateCcw, 
  Search, 
  Settings,
  Palette,
  Code2,
  Wand2
} from 'lucide-react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'javascript' | 'typescript' | 'html' | 'css' | 'json';
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  minimap?: boolean;
  wordWrap?: boolean;
  fontSize?: number;
  height?: string;
  className?: string;
}

export default function MonacoEditor({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  minimap = true,
  wordWrap = true,
  fontSize = 14,
  height = '100%',
  className = ''
}: MonacoEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorMounted, setEditorMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('vs-dark');

  useEffect(() => {
    setCurrentTheme(theme === 'light' ? 'vs-light' : 'vs-dark');
  }, [theme]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setEditorMounted(true);

    // Configure Monaco editor
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'FF6B6B' },
        { token: 'operator', foreground: '4ECDC4' },
        { token: 'string', foreground: '95E1D3' },
        { token: 'number', foreground: 'F38181' },
        { token: 'regexp', foreground: 'F7DC6F' },
        { token: 'type', foreground: '85C1E9' },
        { token: 'variable', foreground: 'D7DBDD' },
        { token: 'function', foreground: 'BB8FCE' },
        { token: 'constant', foreground: 'F8C471' }
      ],
      colors: {
        'editor.background': '#1a1a1a',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#6A737D',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editor.selectionHighlightBackground': '#add6ff26'
      }
    });

    monaco.editor.defineTheme('custom-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'D73A49' },
        { token: 'operator', foreground: '032F62' },
        { token: 'string', foreground: '032F62' },
        { token: 'number', foreground: '005CC5' },
        { token: 'regexp', foreground: '22863A' },
        { token: 'type', foreground: '6F42C1' },
        { token: 'variable', foreground: '24292E' },
        { token: 'function', foreground: '6F42C1' },
        { token: 'constant', foreground: '005CC5' }
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editorLineNumber.foreground': '#1b1f23',
        'editor.selectionBackground': '#0366d625',
        'editor.inactiveSelectionBackground': '#0366d615'
      }
    });

    // Set custom theme
    monaco.editor.setTheme(theme === 'light' ? 'custom-light' : 'custom-dark');

    // Configure TypeScript/JavaScript settings
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Add React types for better IntelliSense
    const reactTypes = `
      declare namespace React {
        interface Component<P = {}, S = {}> {}
        interface FunctionComponent<P = {}> {
          (props: P): JSX.Element | null;
        }
        interface ComponentClass<P = {}, S = {}> {
          new (props: P): Component<P, S>;
        }
        type FC<P = {}> = FunctionComponent<P>;
        type ReactNode = string | number | boolean | {} | ReactElement<any, any> | ReactNodeArray | ReactPortal | null | undefined;
        interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {}
        interface ReactNodeArray extends Array<ReactNode> {}
        interface ReactPortal {}
        interface JSXElementConstructor<P> {}
      }
      declare namespace JSX {
        interface Element extends React.ReactElement<any, any> {}
        interface IntrinsicElements {
          [elemName: string]: any;
        }
      }
    `;

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      reactTypes,
      'file:///node_modules/@types/react/index.d.ts'
    );

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find').run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.startFindReplaceAction').run();
    });

    // Auto-format on paste
    editor.onDidPaste(() => {
      setTimeout(() => {
        editor.getAction('editor.action.formatDocument').run();
      }, 100);
    });
  };

  const handleSave = () => {
    const currentValue = editorRef.current?.getValue() || '';
    navigator.clipboard.writeText(currentValue);
    // You can add additional save logic here
  };

  const handleCopy = () => {
    const currentValue = editorRef.current?.getValue() || '';
    navigator.clipboard.writeText(currentValue);
  };

  const handleDownload = () => {
    const currentValue = editorRef.current?.getValue() || '';
    const blob = new Blob([currentValue], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'typescript' ? 'tsx' : 'jsx'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const handleFind = () => {
    if (editorRef.current) {
      editorRef.current.getAction('actions.find').run();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: readOnly,
    cursorStyle: 'line',
    automaticLayout: true,
    minimap: { enabled: minimap },
    wordWrap: wordWrap ? 'on' : 'off',
    fontSize: fontSize,
    lineNumbers: 'on',
    glyphMargin: true,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all',
    scrollBeyondLastLine: false,
    scrollbar: {
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      vertical: 'visible',
      horizontal: 'visible',
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12
    },
    overviewRulerBorder: false,
    overviewRulerLanes: 3,
    hideCursorInOverviewRuler: true,
    renderIndentGuides: true,
    highlightActiveIndentGuide: true,
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true
    },
    suggest: {
      showIcons: true,
      showSnippets: true,
      showWords: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showIssues: true,
      showUsers: true,
      showValues: true,
      showConstants: true,
      showEnums: true,
      showEnumMembers: true,
      showKeywords: true,
      showFunctions: true,
      showClasses: true,
      showMethods: true,
      showProperties: true,
      showEvents: true,
      showOperators: true,
      showUnits: true,
      showStructs: true,
      showInterfaces: true,
      showModules: true,
      showVariables: true
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    },
    parameterHints: {
      enabled: true,
      cycle: true
    },
    tabCompletion: 'on',
    wordBasedSuggestions: true,
    acceptSuggestionOnEnter: 'on',
    acceptSuggestionOnCommitCharacter: true,
    snippetSuggestions: 'top',
    emptySelectionClipboard: false,
    copyWithSyntaxHighlighting: true,
    multiCursorModifier: 'ctrlCmd',
    formatOnType: true,
    formatOnPaste: true,
    dragAndDrop: true,
    links: true,
    contextmenu: true,
    mouseWheelZoom: true,
    smoothScrolling: true,
    renderWhitespace: 'selection',
    renderControlCharacters: false,
    fontLigatures: true,
    fontFamily: 'Monaco, "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace'
  };

  const containerClass = `${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'relative'}`;

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Code2 className="h-4 w-4" />
            <span className="font-medium">{language.toUpperCase()}</span>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="text-xs text-muted-foreground">
            {value.split('\n').length} lines
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            disabled={!editorMounted}
            className="h-8 w-8 p-0 hover:bg-primary/5"
            title="Format Code (Ctrl+Shift+F)"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFind}
            disabled={!editorMounted}
            className="h-8 w-8 p-0 hover:bg-primary/5"
            title="Find (Ctrl+F)"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!editorMounted}
            className="h-8 w-8 p-0 hover:bg-primary/5"
            title="Copy to Clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={!editorMounted}
            className="h-8 w-8 p-0 hover:bg-primary/5"
            title="Download File"
          >
            <Download className="h-4 w-4" />
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

      {/* Editor */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-60px)]' : height} w-full`}>
        <Monaco
          height="100%"
          language={language}
          theme={currentTheme}
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          onMount={handleEditorDidMount}
          options={editorOptions}
          loading={
            <div className="flex items-center justify-center h-full bg-background">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Loading editor...</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 text-xs text-muted-foreground bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>{language.toUpperCase()}</span>
          <span>Spaces: 2</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ln {editorRef.current?.getPosition()?.lineNumber || 1}</span>
          <span>Col {editorRef.current?.getPosition()?.column || 1}</span>
          <span>Sel {editorRef.current?.getSelection()?.getSelectionRange().toString() || '0'}</span>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      {isFullscreen && (
        <div className="absolute top-16 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 text-xs">
          <div className="font-medium mb-2">Keyboard Shortcuts</div>
          <div className="space-y-1 text-muted-foreground">
            <div>Ctrl+S - Save/Copy</div>
            <div>Ctrl+F - Find</div>
            <div>Ctrl+Shift+F - Replace</div>
            <div>Ctrl+Shift+P - Command Palette</div>
            <div>Alt+Shift+F - Format Document</div>
            <div>Ctrl+/ - Toggle Comment</div>
            <div>Ctrl+D - Select Next Match</div>
            <div>Ctrl+Shift+L - Select All Matches</div>
          </div>
        </div>
      )}
    </div>
  );
}
