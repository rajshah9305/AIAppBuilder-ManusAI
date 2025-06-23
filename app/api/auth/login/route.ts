import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, comparePassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user || !(await comparePassword(password, user.password || ''))) {
    throw new Error('Invalid credentials');
  }
  return user;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await authenticateUser(email, password);
    const token = generateToken(user.id, user.email);

    return NextResponse.json({
      success: true,
      data: { user, token },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Login failed',
      },
      { status: 401 }
    );
  }
}