import { Inter } from 'next/font/google'
import Script from 'next/script'
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
      <body>
        {children}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','2438821559950418');
          fbq('track','PageView');
        `}</Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=2438821559950418&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  )
}
