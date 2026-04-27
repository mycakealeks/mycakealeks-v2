export function getSessionId(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|;\s*)sid=([^;]*)/)
  if (match) return match[1]
  const sid = crypto.randomUUID()
  document.cookie = `sid=${sid}; path=/; max-age=31536000; samesite=lax`
  return sid
}

export async function trackEvent(
  event: string,
  entityId?: string,
  entityType?: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, entityId, entityType, metadata, sessionId: getSessionId() }),
    }).catch(() => {})
  } catch {
    // fire and forget — never throw
  }
}
