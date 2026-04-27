'use client'

import { useEffect, useState, useRef } from 'react'
import { useLocale } from 'next-intl'

interface Props {
  courseId: string
  courseSlug: string
  courseTitle: string
  userId?: string
}

const COOLDOWN_MS = 24 * 60 * 60 * 1000
const STORAGE_KEY = 'smart_popup_at'

const TEXTS = {
  tr: {
    badge: 'Size özel teklif',
    title: 'Bu kursu almayı düşünüyor musunuz?',
    offer: (pct: number) => `%${pct} indirim fırsatı!`,
    timerLabel: 'Teklifin süresi:',
    btn: 'Şimdi Al',
  },
  ru: {
    badge: 'Персональное предложение',
    title: 'Думаете о покупке?',
    offer: (pct: number) => `Скидка ${pct}% для вас!`,
    timerLabel: 'Предложение истекает:',
    btn: 'Купить сейчас',
  },
  en: {
    badge: 'Special offer for you',
    title: 'Considering this course?',
    offer: (pct: number) => `${pct}% discount just for you!`,
    timerLabel: 'Offer expires in:',
    btn: 'Buy Now',
  },
}

export default function SmartOfferPopup({ courseId, courseSlug, courseTitle, userId }: Props) {
  const locale = useLocale()
  const [visible, setVisible] = useState(false)
  const [discount, setDiscount] = useState(15)
  const [secs, setSecs] = useState(600)
  const shownRef = useRef(false)

  function canShow() {
    if (shownRef.current) return false
    try {
      const last = localStorage.getItem(STORAGE_KEY)
      if (last && Date.now() - parseInt(last, 10) < COOLDOWN_MS) return false
    } catch { /* SSR */ }
    return true
  }

  function show() {
    if (!canShow()) return
    shownRef.current = true
    setVisible(true)
    setSecs(600)
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())) } catch { /* SSR */ }
  }

  useEffect(() => {
    if (userId) {
      fetch(`/api/smart-discounts?userId=${userId}`)
        .then((r) => r.json())
        .then((d) => {
          const match = (d.discounts ?? []).find((x: any) => String(x.courseId) === String(courseId))
          if (match) setDiscount(match.percent)
        })
        .catch(() => {})
    }

    const t30 = setTimeout(show, 30_000)
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) show() }
    document.addEventListener('mouseleave', onLeave)

    return () => {
      clearTimeout(t30)
      document.removeEventListener('mouseleave', onLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, userId])

  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => setSecs((s) => {
      if (s <= 1) { setVisible(false); return 0 }
      return s - 1
    }), 1000)
    return () => clearInterval(id)
  }, [visible])

  if (!visible) return null

  const tx = TEXTS[locale as keyof typeof TEXTS] ?? TEXTS.en
  const mins = Math.floor(secs / 60).toString().padStart(2, '0')
  const sec2 = (secs % 60).toString().padStart(2, '0')
  const href = `/${locale}/checkout?courseId=${courseId}&discount=${discount}`

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 16px 24px', pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: '#fff', borderRadius: 20,
          boxShadow: '0 8px 40px rgba(212,83,126,0.18)',
          padding: '24px 24px 20px', maxWidth: 400, width: '100%',
          border: '1.5px solid #f0d0dc', pointerEvents: 'auto', position: 'relative',
        }}
      >
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          style={{
            position: 'absolute', top: 12, right: 12, background: 'none',
            border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18, lineHeight: 1,
          }}
        >✕</button>

        <div style={{
          display: 'inline-block', background: '#fbeaf0', color: '#d4537e',
          fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, marginBottom: 8,
        }}>
          🎁 {tx.offer(discount)}
        </div>

        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
          {tx.title}
        </h3>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>{courseTitle}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{tx.timerLabel}</span>
          <span style={{
            fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#d4537e',
            background: '#fbeaf0', padding: '2px 8px', borderRadius: 6,
          }}>
            {mins}:{sec2}
          </span>
        </div>

        <a
          href={href}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: 46, borderRadius: 12, background: '#d4537e',
            color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none',
          }}
        >
          {tx.btn} →
        </a>
      </div>
    </div>
  )
}
