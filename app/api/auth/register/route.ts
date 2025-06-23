import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, hashPassword, generateToken } from '@/lib/auth';
import { createUser } from '@/lib/database';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

// Separate service function for user creation
async function createNewUser(email: string, name: string, password: string) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = await createUser({ name, email, password: hashedPassword });
  const token = generateToken(user.id, user.email);

  return { user, token };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = registerSchema.parse(body);

    const { user, token } = await createNewUser(email, name, password);

    return NextResponse.json({
      success: true,
      data: { user, token },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Registration failed',
      },
      { status: 400 }
    );
  }
}