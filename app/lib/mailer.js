import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendMagicLink(to, link) {
  await transporter.sendMail({
    from: `"Social Quest" <${process.env.GMAIL_USER}>`,
    to,
    subject: '⚔️ Seu acesso ao Social Quest',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:36px 32px;background:#0f0f1e;border-radius:18px;color:#e2e2f0;">
        <h1 style="margin:0 0 8px;font-size:22px;color:#22d3ee;">⚔️ Social Quest</h1>
        <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin:0 0 28px;">
          Clique no botão abaixo para acessar seu mapa de jornada.<br/>
          O link expira em <strong style="color:#fff;">15 minutos</strong>.
        </p>
        <a href="${link}"
           style="display:inline-block;padding:15px 32px;background:#22d3ee;color:#0a0a1e;text-decoration:none;border-radius:12px;font-weight:800;font-size:15px;letter-spacing:-0.01em;">
          Acessar meu progresso →
        </a>
        <p style="margin:28px 0 0;font-size:12px;color:rgba(255,255,255,0.25);">
          Se você não solicitou esse link, ignore este email.
        </p>
      </div>
    `,
  })
}
