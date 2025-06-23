import { NextRequest, NextResponse } from 'next/server';
import { generateAppCode } from '../../../src/lib/cerebras';
import { createProject, updateProject } from '../../../src/lib/database';
import { ProjectStatus } from '../../../src/types';
import { z } from 'zod';
import { getUserIdFromRequest } from '../../../src/lib/auth';

const generateSchema = z.object({
  prompt: z.string().min(10),
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

    const generatedCode = await generateAppCode(prompt);

    let project;
    if (projectId) {
      project = await updateProject(projectId, {
        generatedCode,
        status: ProjectStatus.COMPLETED,
      });
    } else {
      project = await createProject({
        name: `Generated App - ${new Date().toLocaleDateString()}`,
        description: prompt,
        prompt,
        generatedCode,
        userId,
        status: ProjectStatus.COMPLETED,
      });
    }

    return NextResponse.json({
      success: true,
      code: generatedCode,
      projectId: project?.id,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}