'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

const ERRORS = {
  not_found:    'Email não encontrado. Use o email da sua compra.',
  rate_limited: 'Muitas tentativas. Aguarde 15 minutos e tente novamente.',
  default:      'Algo deu errado. Tente novamente.',
}

export default function LoginForm() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [errorKey, setErrorKey] = useState(null)
  const params   = useSearchParams()
  const urlError = params.get('error')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorKey(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        window.location.href = '/game'
        return
      }

      const data = await res.json().catch(() => ({}))
      setErrorKey(data.error ?? 'default')
      setStatus('error')
    } catch {
      setErrorKey('default')
      setStatus('error')
    }
  }

  return (
    <>
      {urlError === 'expired' && (
        <p className="login-alert">Sessão expirada. Entre novamente.</p>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <label className="login-label" htmlFor="email">Email usado na compra</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          className="login-input"
          disabled={status === 'loading'}
          autoComplete="email"
        />
        <button
          type="submit"
          className="login-btn"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Verificando…' : 'Entrar →'}
        </button>

        {status === 'error' && (
          <p className="login-error">{ERRORS[errorKey] ?? ERRORS.default}</p>
        )}
      </form>
    </>
  )
}
