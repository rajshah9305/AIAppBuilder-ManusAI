import { NextRequest, NextResponse } from 'next/server';
import { getUserProjects, createProject } from '@/lib/database';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const projects = await getUserProjects('1');
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = createProjectSchema.parse(body);

    const project = await createProject({
      name,
      description: description || '',
      prompt: '',
      generatedCode: '',
      userId: '1',
    });

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}