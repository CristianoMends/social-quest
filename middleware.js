import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET)

export async function middleware(req) {
  const token = req.cookies.get('sq_session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    await jwtVerify(token, secret())
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.delete('sq_session')
    return res
  }
}

export const config = {
  matcher: ['/game/:path*'],
}
