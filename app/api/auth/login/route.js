import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getDb } from '@/app/lib/db'
import { signSession, SESSION_COOKIE } from '@/app/lib/auth'

const RATE_LIMIT   = 5   // tentativas
const WINDOW_MIN   = 15  // minutos

function getIp(headersList) {
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req) {
  const sql         = getDb()
  const headersList = await headers()
  const ip          = getIp(headersList)
  const windowStart = new Date(Date.now() - WINDOW_MIN * 60 * 1000)

  // ── Rate limit ──
  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM   login_attempts
    WHERE  ip = ${ip}
    AND    attempted_at > ${windowStart}
  `

  if (count >= RATE_LIMIT) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  // ── Registrar tentativa ──
  await sql`INSERT INTO login_attempts (ip) VALUES (${ip})`

  // ── Validar body ──
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const email = body?.email?.toLowerCase().trim()
  if (!email) {
    return NextResponse.json({ error: 'email_required' }, { status: 400 })
  }

  // ── Verificar compra ──
  const [purchase] = await sql`
    SELECT email FROM purchases WHERE email = ${email} LIMIT 1
  `

  if (!purchase) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // ── Criar sessão ──
  const jwt = await signSession(email)

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: '/',
  })

  return res
}
