import { NextResponse } from 'next/server'
import { getDb } from '@/app/lib/db'

const APPROVED_EVENTS = new Set([
  'order_approved',
  'order_complete',
  'order_completed',
  'sale_approved',
])

export async function POST(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token') ?? ''

  console.log('[kiwify] token recebido:', token ? `${token.slice(0, 6)}…` : '(vazio)')

  if (!token || token !== process.env.KIWIFY_WEBHOOK_TOKEN) {
    console.warn('[kiwify] token inválido — 401')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    console.error('[kiwify] JSON inválido no body')
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[kiwify] payload:', JSON.stringify(body, null, 2))

  const eventType = body?.webhook_event_type ?? body?.type
  if (!APPROVED_EVENTS.has(eventType)) {
    console.log('[kiwify] evento ignorado:', eventType)
    return NextResponse.json({ ok: true, ignored: true })
  }

  const email = body?.Customer?.email || body?.customer?.email || body?.data?.customer?.email
  if (!email) {
    console.error('[kiwify] email não encontrado no payload')
    return NextResponse.json({ error: 'No email in payload' }, { status: 400 })
  }

  const orderId = body?.order_id || body?.data?.order_id || null
  console.log('[kiwify] salvando compra — email:', email, '| orderId:', orderId)

  const sql = getDb()
  await sql`
    INSERT INTO purchases (email, kiwify_order_id)
    VALUES (${email.toLowerCase().trim()}, ${orderId})
    ON CONFLICT (email) DO UPDATE
      SET kiwify_order_id = EXCLUDED.kiwify_order_id
  `

  console.log('[kiwify] compra salva com sucesso')
  return NextResponse.json({ ok: true })
}
