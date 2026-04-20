import { createHmac, timingSafeEqual } from 'crypto'

const secret = () => process.env.PAYLOAD_SECRET || 'fallback-dev-secret'

export function signToken(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', secret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifyToken<T extends Record<string, unknown>>(token: string): (T & { exp?: number }) | null {
  try {
    const dot = token.lastIndexOf('.')
    if (dot < 0) return null
    const data = token.slice(0, dot)
    const sig = token.slice(dot + 1)
    const expected = createHmac('sha256', secret()).update(data).digest('base64url')
    const sigBuf = Buffer.from(sig + '==', 'base64url')
    const expBuf = Buffer.from(expected + '==', 'base64url')
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString()) as T & { exp?: number }
    if (parsed.exp && parsed.exp < Date.now()) return null
    return parsed
  } catch {
    return null
  }
}
