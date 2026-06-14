import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'sq_session'
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET)

export async function signSession(email) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret())
}

export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload
  } catch {
    return null
  }
}
