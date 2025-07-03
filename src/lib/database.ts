import { User, Project, ProjectStatus } from '../types';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Helper function to map database project to our Project type
function mapDatabaseProject(dbProject: any): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description,
    prompt: dbProject.prompt,
    generatedCode: dbProject.code,
    userId: dbProject.userId,
    status: mapDatabaseStatus(dbProject.status),
    createdAt: dbProject.createdAt,
    updatedAt: dbProject.updatedAt,
  };
}

// Helper function to map our ProjectStatus enum to database status
function mapStatusToDatabase(status: ProjectStatus): string {
  return status.toLowerCase();
}

// Helper function to map database status to our ProjectStatus enum
function mapDatabaseStatus(status: string): ProjectStatus {
  switch (status.toUpperCase()) {
    case 'DRAFT':
      return ProjectStatus.DRAFT;
    case 'GENERATING':
      return ProjectStatus.GENERATING;
    case 'COMPLETED':
      return ProjectStatus.COMPLETED;
    case 'ERROR':
      return ProjectStatus.ERROR;
    default:
      return ProjectStatus.DRAFT;
  }
}

export async function createUser(data: { name: string; email: string; password: string }): Promise<User> {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      throw new Error('User with this email already exists');
    }
    throw new Error('Failed to create user');
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return projects.map(mapDatabaseProject);
  } catch (error) {
    throw new Error('Failed to fetch user projects');
  }
}

export async function createProject(data: {
  name: string;
  description?: string;
  prompt: string;
  generatedCode: string;
  userId: string;
  status: ProjectStatus;
}): Promise<Project> {
  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description || data.prompt,
        code: data.generatedCode,
        status: mapStatusToDatabase(data.status),
        userId: data.userId,
      },
    });

    return mapDatabaseProject(project);
  } catch (error) {
    throw new Error('Failed to create project');
  }
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  try {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.generatedCode !== undefined) updateData.code = data.generatedCode;
    if (data.status !== undefined) updateData.status = mapStatusToDatabase(data.status);

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return mapDatabaseProject(project);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return null; // Record not found
    }
    throw new Error('Failed to update project');
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) return null;

    return mapDatabaseProject(project);
  } catch (error) {
    throw new Error('Failed to fetch project');
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await prisma.project.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return false; // Record not found
    }
    throw new Error('Failed to delete project');
  }
}

export class DatabaseService {
  static async getProjects(userId: string): Promise<Project[]> {
    return getUserProjects(userId);
  }

  static async createProject(data: {
    name: string;
    description?: string;
    prompt: string;
    generatedCode: string;
    userId: string;
    status: ProjectStatus;
  }): Promise<Project> {
    return createProject(data);
  }

  static async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
    return updateProject(id, data);
  }

  static async deleteProject(id: string): Promise<boolean> {
    return deleteProject(id);
  }
}