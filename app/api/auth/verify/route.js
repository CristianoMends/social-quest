import { NextResponse } from 'next/server'
import { getDb } from '@/app/lib/db'
import { signSession, SESSION_COOKIE } from '@/app/lib/auth'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=invalid', req.url))
  }

  const sql = getDb()
  const [row] = await sql`
    SELECT * FROM magic_tokens
    WHERE token = ${token} AND used = false
    LIMIT 1
  `

  if (!row) {
    return NextResponse.redirect(new URL('/login?error=expired', req.url))
  }

  if (new Date(row.expires_at) < new Date()) {
    return NextResponse.redirect(new URL('/login?error=expired', req.url))
  }

  await sql`UPDATE magic_tokens SET used = true WHERE token = ${token}`

  const jwt = await signSession(row.email)

  const res = NextResponse.redirect(new URL('/game', req.url))
  res.cookies.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return res
}
