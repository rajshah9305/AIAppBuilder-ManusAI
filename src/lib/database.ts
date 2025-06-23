import { User, Project, ProjectStatus } from '@/types';

// Mock database functions - replace with actual Prisma calls in production
const users: User[] = [];
const projects: Project[] = [];

export async function getUser(id: string): Promise<User | null> {
  return users.find(u => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find(u => u.email === email) || null;
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const user: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  users.push(user);
  return user;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  return projects.filter(p => p.userId === userId);
}

export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const project: Project = {
    ...projectData,
    id: Date.now().toString(),
    status: ProjectStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  projects.push(project);
  return project;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date()
  };
  return projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  projects.splice(index, 1);
  return true;
}

export async function getProject(id: string): Promise<Project | null> {
  return projects.find(p => p.id === id) || null;
}