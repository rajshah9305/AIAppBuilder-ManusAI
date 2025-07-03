import { useState } from 'react';
import { GenerateRequest, GenerateResponse } from '../types';

export function useAIGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async (prompt: string, projectId?: string): Promise<GenerateResponse> => {
    setLoading(true);
    setError(null);

    try {
      const request: GenerateRequest = { prompt, projectId };
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result: GenerateResponse = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to generate code');
        return result;
      }

      return result;
    } catch (err) {
      const errorMessage = 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    generateCode,
    loading,
    error,
    clearError,
  };
}