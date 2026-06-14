import { cookies } from 'next/headers'
import { verifySession } from '../lib/auth'
import GameMap from '../components/GameMap'

export default async function GamePage() {
  const store = await cookies()
  const token = store.get('sq_session')?.value
  const session = token ? await verifySession(token) : null

  return <GameMap userEmail={session?.email ?? null} />
}
