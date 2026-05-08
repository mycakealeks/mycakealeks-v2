'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface Message {
  role: 'user' | 'bot'
  text: string
}

export default function HomeMiniChat() {
  const t = useTranslations('home')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: t('aiChatBot') },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'bot', text: data.reply || '...' }])
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: '⚠️' }])
    }
    setLoading(false)
  }

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-y-auto p-4 space-y-3" style={{ height: 220 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="text-sm px-4 py-2.5 rounded-2xl max-w-[85%]"
              style={
                m.role === 'user'
                  ? { background: '#d4537e', color: '#fff', borderBottomRightRadius: 4 }
                  : { background: '#f3f4f6', color: '#374151', borderBottomLeftRadius: 4 }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="text-sm px-4 py-2.5 rounded-2xl bg-gray-100 text-gray-400" style={{ borderBottomLeftRadius: 4 }}>
              ···
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-gray-100 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={t('aiChatYou')}
          className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-pink-400"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          style={{ background: '#d4537e' }}
        >
          →
        </button>
      </div>
    </div>
  )
}
