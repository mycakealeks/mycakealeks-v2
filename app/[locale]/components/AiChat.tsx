'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function AiChat() {
  const t = useTranslations('aiChat')
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!message.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      setReply(data.reply)
    } catch (e) {
      setReply(t('errorConnection'))
    }
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '320px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      padding: '16px',
      zIndex: 9999
    }}>
      <h3 style={{ color: '#db2777', fontWeight: 'bold', marginBottom: '12px' }}>
        🎂 {t('title')}
      </h3>
      <textarea
        style={{
          width: '100%',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px',
          fontSize: '14px',
          height: '80px',
          resize: 'none',
          boxSizing: 'border-box'
        }}
        placeholder={t('placeholder')}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          width: '100%',
          marginTop: '8px',
          background: '#db2777',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '10px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        {loading ? t('loading') : t('submit')}
      </button>
      {reply && (
        <div style={{
          marginTop: '12px',
          fontSize: '14px',
          color: '#374151',
          background: '#fdf2f8',
          borderRadius: '8px',
          padding: '12px'
        }}>
          {reply}
        </div>
      )}
    </div>
  )
}
