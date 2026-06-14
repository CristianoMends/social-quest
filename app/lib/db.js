import postgres from 'postgres'

let _sql

export function getDb() {
  if (!_sql) {
    _sql = postgres(process.env.DATABASE_URL, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  }
  return _sql
}
