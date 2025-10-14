import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');
    
    if (!userSession?.value) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userData = JSON.parse(userSession.value);
    
    return NextResponse.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Session check error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
