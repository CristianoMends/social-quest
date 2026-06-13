import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Social Quest — Guia Gamificado de 30 Dias',
  description:
    'Um método de 30 dias para vencer o medo de falar com gente, puxar conversa e fazer conexões — sem virar outra pessoa.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
