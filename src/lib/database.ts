import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  code: string;
  preview?: string;
  status: 'draft' | 'generated' | 'deployed';
  createdAt: Date;
  updatedAt: Date;
}

export class DatabaseService {
  static async createUser(email: string, name: string, hashedPassword: string) {
    return await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
  }

  static async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
    });
  }

  static async getUserById(id: string) {
    return await db.user.findUnique({
      where: { id },
    });
  }

  static async createProject(data: {
    name: string;
    description: string;
    userId: string;
    code?: string;
  }) {
    return await db.project.create({
      data: {
        ...data,
        code: data.code || '',
        status: 'draft',
      },
    });
  }

  static async getProjectsByUserId(userId: string) {
    return await db.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async getProjectById(id: string, userId: string) {
    return await db.project.findFirst({
      where: { id, userId },
    });
  }

  static async updateProject(id: string, userId: string, data: Partial<Project>) {
    return await db.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  static async deleteProject(id: string, userId: string) {
    return await db.project.delete({
      where: { id },
    });
  }
}