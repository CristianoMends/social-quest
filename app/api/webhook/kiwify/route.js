import { NextResponse } from 'next/server'
import { getDb } from '@/app/lib/db'

const APPROVED_EVENTS = new Set([
  'order.approved',
  'order.complete',
  'order.completed',
  'sale.approved',
])

export async function POST(req) {
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const token = body?.token
  if (!token || token !== process.env.KIWIFY_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!APPROVED_EVENTS.has(body?.type)) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  const email = body?.data?.customer?.email || body?.customer?.email
  if (!email) {
    return NextResponse.json({ error: 'No email in payload' }, { status: 400 })
  }

  const orderId = body?.data?.order_id || body?.order_id || null

  const sql = getDb()
  await sql`
    INSERT INTO purchases (email, kiwify_order_id)
    VALUES (${email.toLowerCase().trim()}, ${orderId})
    ON CONFLICT (email) DO UPDATE
      SET kiwify_order_id = EXCLUDED.kiwify_order_id
  `

  return NextResponse.json({ ok: true })
}
