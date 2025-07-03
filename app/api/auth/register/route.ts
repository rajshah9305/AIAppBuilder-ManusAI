import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '../../../../src/lib/database';
import { generateToken } from '../../../../src/lib/auth';
import { AuthResponse } from '../../../../src/types';
import { registerSchema } from '../../../../src/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const user = await createUser({ name, email, password });
    const token = generateToken(user.id, user.email);
    
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = NextResponse.json<AuthResponse>({
      success: true,
      user: userWithoutPassword,
      token,
    });

    // Set HTTP-only cookie for additional security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<AuthResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
