/**
 * Utility functions for formatting and validating generated code
 */

/**
 * Formats TypeScript/JavaScript code with basic indentation
 */
export function formatCode(code: string): string {
  if (!code || typeof code !== 'string') {
    return '';
  }

  const lines = code.split('\n');
  let indentLevel = 0;
  const indentSize = 2;
  
  const formattedLines = lines.map((line) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      return '';
    }
    
    // Decrease indent for closing brackets/braces
    if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    const formattedLine = ' '.repeat(indentLevel * indentSize) + trimmed;
    
    // Increase indent for opening brackets/braces
    if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
      indentLevel++;
    }
    
    return formattedLine;
  });
  
  return formattedLines.join('\n');
}

/**
 * Validates that the code contains required React imports and exports
 */
export function validateReactComponent(code: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!code || code.trim().length === 0) {
    errors.push('Code is empty');
    return { isValid: false, errors, warnings };
  }
  
  // Check for React import
  if (!code.includes('import React') && !code.includes('import { ') && !code.includes('import * as React')) {
    errors.push('Missing React import statement');
  }
  
  // Check for export
  if (!code.includes('export default') && !code.includes('export {') && !code.includes('module.exports')) {
    errors.push('Missing export statement');
  }
  
  // Check for JSX
  if (!code.includes('<') || !code.includes('>')) {
    warnings.push('No JSX elements found - this might not be a React component');
  }
  
  // Check for function or class component
  const hasFunctionComponent = code.includes('function ') || code.includes('const ') || code.includes('let ');
  const hasClassComponent = code.includes('class ') && code.includes('extends');
  
  if (!hasFunctionComponent && !hasClassComponent) {
    errors.push('No React component declaration found');
  }
  
  // Check for TypeScript interfaces if using TypeScript
  if (code.includes('interface ') || code.includes('type ')) {
    if (!code.includes(': ') && !code.includes('Props')) {
      warnings.push('TypeScript types detected but props typing might be missing');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Extracts the component name from the code
 */
export function extractComponentName(code: string): string {
  // Try to find function component name
  const functionMatch = code.match(/function\s+(\w+)/);
  if (functionMatch) {
    return functionMatch[1];
  }
  
  // Try to find const component name
  const constMatch = code.match(/const\s+(\w+)\s*[:=]/);
  if (constMatch) {
    return constMatch[1];
  }
  
  // Try to find class component name
  const classMatch = code.match(/class\s+(\w+)/);
  if (classMatch) {
    return classMatch[1];
  }
  
  // Try to find export default function name
  const exportMatch = code.match(/export\s+default\s+function\s+(\w+)/);
  if (exportMatch) {
    return exportMatch[1];
  }
  
  return 'GeneratedComponent';
}

/**
 * Adds missing imports to a React component
 */
export function ensureReactImports(code: string): string {
  if (!code.includes('import React')) {
    // Determine what React features are used
    const needsUseState = code.includes('useState');
    const needsUseEffect = code.includes('useEffect');
    const needsOtherHooks = /use[A-Z]\w*/.test(code);
    
    let importStatement = "import React";
    const hooks = [];
    
    if (needsUseState) hooks.push('useState');
    if (needsUseEffect) hooks.push('useEffect');
    
    if (hooks.length > 0 || needsOtherHooks) {
      importStatement += `, { ${hooks.join(', ')}${needsOtherHooks && hooks.length === 0 ? '/* add other hooks as needed */' : ''} }`;
    }
    
    importStatement += " from 'react';\n\n";
    
    return importStatement + code;
  }
  
  return code;
}

/**
 * Cleans up common formatting issues in generated code
 */
export function cleanupCode(code: string): string {
  return code
    // Remove excessive blank lines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Fix spacing around braces
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    // Ensure proper spacing around operators
    .replace(/([a-zA-Z0-9])\s*=\s*([a-zA-Z0-9])/g, '$1 = $2')
    // Remove trailing spaces
    .replace(/[ \t]+$/gm, '')
    // Ensure file ends with newline
    .replace(/([^\n])$/, '$1\n');
}
