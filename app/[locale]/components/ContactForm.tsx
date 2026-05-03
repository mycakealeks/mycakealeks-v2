'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'

const LABELS: Record<string, {
  title: string; subtitle: string; name: string; email: string;
  message: string; send: string; sending: string; success: string; error: string
}> = {
  tr: {
    title: 'Bizimle İletişime Geçin',
    subtitle: 'Kurslar hakkında sorularınız mı var? Bize yazın!',
    name: 'Adınız',
    email: 'E-posta adresiniz',
    message: 'Mesajınız',
    send: 'Gönder',
    sending: 'Gönderiliyor...',
    success: 'Mesajınız iletildi! 24 saat içinde yanıt vereceğiz.',
    error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
  },
  ru: {
    title: 'Связаться с нами',
    subtitle: 'Вопросы о курсах? Напишите нам!',
    name: 'Ваше имя',
    email: 'Email',
    message: 'Сообщение',
    send: 'Отправить',
    sending: 'Отправляем...',
    success: 'Сообщение отправлено! Мы ответим в течение 24 часов.',
    error: 'Произошла ошибка. Пожалуйста, попробуйте снова.',
  },
  en: {
    title: 'Contact Us',
    subtitle: 'Questions about our courses? Write to us!',
    name: 'Your name',
    email: 'Email address',
    message: 'Your message',
    send: 'Send Message',
    sending: 'Sending...',
    success: 'Message sent! We\'ll reply within 24 hours.',
    error: 'Something went wrong. Please try again.',
  },
}

export default function ContactForm() {
  const locale = useLocale()
  const l = LABELS[locale] ?? LABELS.tr
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const canSubmit = name.trim() && email.trim() && message.trim() && status !== 'loading'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) {
        setStatus('success')
        setName(''); setEmail(''); setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-14 md:py-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{l.title}</h2>
          <p className="text-gray-500">{l.subtitle}</p>
        </div>

        {status === 'success' ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
          >
            <p className="text-3xl mb-3">✅</p>
            <p className="font-semibold text-green-800">{l.success}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l.name}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l.message}</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-500">{l.error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3 rounded-xl font-semibold text-white text-base transition disabled:opacity-50"
              style={{ background: '#d4537e' }}
            >
              {status === 'loading' ? l.sending : l.send}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
