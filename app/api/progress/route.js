import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession } from '@/app/lib/auth'
import { getDb } from '@/app/lib/db'

async function getEmail() {
  const store = await cookies()
  const token = store.get('sq_session')?.value
  if (!token) return null
  const session = await verifySession(token)
  return session?.email ?? null
}

export async function GET() {
  const email = await getEmail()
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sql = getDb()
  const [row] = await sql`
    SELECT done, started_at FROM progress WHERE email = ${email} LIMIT 1
  `

  const done = row?.done ?? []
  let startedAt = row?.started_at ?? null

  // Migration: usuários com progresso mas sem started_at recebem uma data virtual
  // para que currentDay = done.length + 1 e possam continuar normalmente
  if (!startedAt && done.length > 0) {
    const d = new Date()
    d.setDate(d.getDate() - done.length)
    startedAt = d.toISOString()
  }

  return NextResponse.json({ done, started_at: startedAt })
}

export async function POST(req) {
  const email = await getEmail()
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { done } = await req.json()
  if (!Array.isArray(done)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const sql = getDb()

  // started_at calculado: hoje menos (missões completas - 1) dias
  // garante que currentDay = done.length + 1 ao persistir pela 1ª vez
  const startedAt = new Date()
  startedAt.setDate(startedAt.getDate() - Math.max(0, done.length - 1))

  await sql`
    INSERT INTO progress (email, done, started_at, updated_at)
    VALUES (${email}, ${sql.json(done)}, ${startedAt.toISOString()}, NOW())
    ON CONFLICT (email) DO UPDATE
      SET done       = EXCLUDED.done,
          updated_at = NOW(),
          started_at = COALESCE(progress.started_at, EXCLUDED.started_at)
  `

  return NextResponse.json({ ok: true })
}
