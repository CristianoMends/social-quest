import { Suspense } from 'react'
import LoginForm from '../components/LoginForm'

export const metadata = { title: 'Entrar — Social Quest' }

export default function LoginPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-card__header">
          <span className="login-card__logo">⚔️</span>
          <h1 className="login-card__title">Social Quest</h1>
          <p className="login-card__sub">
            Digite o email usado na compra para receber seu link de acesso.
          </p>
        </div>
        <Suspense fallback={<p className="login-loading">Carregando…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
