import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/app/lib/auth'

export async function POST(req) {
  const res = NextResponse.redirect(new URL('/login', req.url))
  res.cookies.delete(SESSION_COOKIE)
  return res
}
