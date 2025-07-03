import { NextRequest, NextResponse } from 'next/server';
import { getUserProjects, createProject } from '../../../src/lib/database';
import { ProjectStatus } from '../../../src/types';
import { z } from 'zod';
import { getUserIdFromRequest } from '../../../src/lib/auth';

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await getUserProjects(userId);
    return NextResponse.json({ projects });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = createProjectSchema.parse(body);

    const project = await createProject({
      name,
      description,
      prompt: description || '',
      generatedCode: '',
      userId,
      status: ProjectStatus.DRAFT,
    });

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
