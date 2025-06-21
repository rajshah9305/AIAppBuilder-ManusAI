import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from './database';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: AuthUser): string {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };
    } catch (error) {
      return null;
    }
  }

  static async register(email: string, name: string, password: string) {
    const existingUser = await DatabaseService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await DatabaseService.createUser(email, name, hashedPassword);
    
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  static async login(email: string, password: string) {
    const user = await DatabaseService.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  static async getCurrentUser(token: string) {
    const decoded = this.verifyToken(token);
    if (!decoded) {
      return null;
    }

    const user = await DatabaseService.getUserById(decoded.id);
    if (!user) {
      return null;
    }

    return { id: user.id, email: user.email, name: user.name };
  }
}