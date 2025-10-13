import { NextResponse } from 'next/server';
import { signup } from '@/lib/action';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req: Request) {
  const body = await req.json();
  const result = await signup(body);
  if (result.error) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }
  // Auto-login after signup (generate JWT and set cookie)
  const user = result.user;
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  const response = NextResponse.json({ user });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
