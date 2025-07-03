import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '../../../../src/lib/database';
import { comparePassword, generateToken } from '../../../../src/lib/auth';
import { AuthResponse } from '../../../../src/types';
import { loginSchema } from '../../../../src/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(password, user.password!);
    if (!isValidPassword) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

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
    console.error('Login error:', error);
    return NextResponse.json<AuthResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
