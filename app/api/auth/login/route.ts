import { NextResponse } from 'next/server';

// Simple in-memory user store (replace with database in production)
const USERS = [
  { id: '1', email: 'admin@wastenexus.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: '2', email: 'user@wastenexus.com', password: 'user123', role: 'user', name: 'Regular User' },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user (in production, use proper password hashing)
    const user = USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create user session data
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    // Set HTTP-only cookie with user session
    const response = NextResponse.json({
      success: true,
      user: sessionData
    });

    response.cookies.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
