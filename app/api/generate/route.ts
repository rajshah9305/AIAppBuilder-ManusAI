import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { cerebrasService } from '@/lib/cerebras';
import { DatabaseService } from '@/lib/database';
import { z } from 'zod';

const generateSchema = z.object({
  prompt: z.string().min(10),
  projectId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await AuthService.getCurrentUser(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { prompt, projectId } = generateSchema.parse(body);

    // Generate app structure using Cerebras
    const appStructure = await cerebrasService.generateAppStructure(prompt);

    let project;
    if (projectId) {
      // Update existing project
      project = await DatabaseService.updateProject(projectId, user.id, {
        code: JSON.stringify(appStructure),
        status: 'generated',
      });
    } else {
      // Create new project
      project = await DatabaseService.createProject({
        name: `Generated App - ${new Date().toLocaleDateString()}`,
        description: prompt,
        userId: user.id,
        code: JSON.stringify(appStructure),
      });
      
      await DatabaseService.updateProject(project.id, user.id, {
        status: 'generated',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        project,
        appStructure,
      },
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Generation failed',
      },
      { status: 500 }
    );
  }
}