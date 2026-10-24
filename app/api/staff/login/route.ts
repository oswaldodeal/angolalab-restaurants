import { NextRequest, NextResponse } from 'next/server';
import { makeSession, STAFF_COOKIE, validPassword } from '@/lib/staff-auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return new NextResponse('Forbidden', { status: 403 });
  const data = await request.formData();
  const password = data.get('password');
  if (typeof password !== 'string' || !validPassword(password)) {
    return NextResponse.redirect(new URL('/staff/review/login?error=1', request.url), 303);
  }
  const response = NextResponse.redirect(new URL('/staff/review', request.url), 303);
  response.cookies.set(STAFF_COOKIE, makeSession(), {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/staff',
    maxAge: 60 * 60 * 8,
  });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
