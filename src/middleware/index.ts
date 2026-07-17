import { createServerClient } from '@supabase/ssr';
import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'fallback-dev-secret-change-in-production',
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('mdrrmo_admin_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      await jwtVerify(token, ADMIN_JWT_SECRET);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(
        new URL('/admin/login?reason=session_expired', request.url),
      );
      response.cookies.delete('mdrrmo_admin_session');
      return response;
    }
  }

  if (pathname === '/admin/login') {
    const token = request.cookies.get('mdrrmo_admin_session')?.value;
    if (token) {
      try {
        await jwtVerify(token, ADMIN_JWT_SECRET);
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch {
        // expired — let them through to login
      }
    }
  }

  const volunteerProtected = ['/profile', '/apply'];
  const isVolunteerProtected = volunteerProtected.some((p) =>
    pathname.startsWith(p),
  );

  if (isVolunteerProtected) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL(
          '/auth/login?redirect=' + encodeURIComponent(pathname),
          request.url,
        ),
      );
    }

    return response;
  }

  const authPages = ['/auth/login', '/auth/register'];
  const isAuthPage = authPages.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/login',
    '/profile',
    '/apply',
    '/auth/login',
    '/auth/register',
  ],
};
