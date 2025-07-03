import { NextRequest, NextResponse } from 'next/server';
import { cerebrasService } from '../../../src/lib/cerebras';
import { createProject, updateProject } from '../../../src/lib/database';
import { ProjectStatus } from '../../../src/types';
import { z } from 'zod';
import { getUserIdFromRequest } from '../../../src/lib/auth';

const generateSchema = z.object({
  prompt: z.string().min(10).max(5000),
  projectId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, projectId } = generateSchema.parse(body);

    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Validate API configuration before processing
    const isApiKeyValid = await cerebrasService.validateApiKey();
    if (!isApiKeyValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI service is not properly configured. Please check your API key.' 
        }, 
        { status: 500 }
      );
    }

    // Update project status to generating if updating existing project
    if (projectId) {
      await updateProject(projectId, {
        status: ProjectStatus.GENERATING,
      });
    }

    // Generate code using Cerebras AI
    const result = await cerebrasService.generate(prompt);
    
    if (!result.code || result.code.trim().length === 0) {
      throw new Error('No code was generated. Please try a more specific prompt.');
    }

    let project;
    if (projectId) {
      project = await updateProject(projectId, {
        generatedCode: result.code,
        status: ProjectStatus.COMPLETED,
      });
    } else {
      // Create a more descriptive project name
      const projectName = prompt.length > 50 
        ? `${prompt.substring(0, 47)}...` 
        : prompt;
      
      project = await createProject({
        name: projectName,
        description: prompt,
        prompt,
        generatedCode: result.code,
        userId,
        status: ProjectStatus.COMPLETED,
      });
    }

    return NextResponse.json({
      success: true,
      code: result.code,
      projectId: project?.id,
    });
  } catch (error: unknown) {
    console.error('Generation API error:', error);
    
    // Update project status to error if we have a projectId
    const body = await request.json().catch(() => ({}));
    const { projectId } = body;
    if (projectId) {
      try {
        await updateProject(projectId, {
          status: ProjectStatus.ERROR,
        });
      } catch (updateError) {
        console.error('Failed to update project status to ERROR:', updateError);
      }
    }

    let errorMessage = 'Code generation failed';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'AI service configuration error. Please check your API key.';
        statusCode = 503;
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'AI service rate limit exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('Unauthorized')) {
        errorMessage = 'Authentication failed';
        statusCode = 401;
      } else {
        errorMessage = error.message;
      }
    }

    if (error instanceof z.ZodError) {
      errorMessage = 'Invalid request data: ' + error.errors.map(e => e.message).join(', ');
      statusCode = 400;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}