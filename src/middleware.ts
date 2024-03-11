import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = request.cookies.get('session')?.value;

  const endpoint = new URL('/api/auth/is-authenticated', request.url);

  const auth: { isAuthenticated: boolean; token: { uid: string } } =
    await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ session }),
    }).then((response) => response.json());

  if (!auth.isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (auth.isAuthenticated && !pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
};
