'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface VideoPlayerProps {
  videoId: string
  isFree?: boolean
  userId?: string
  courseId?: string
}

export default function VideoPlayer({ videoId, isFree = false, userId, courseId }: VideoPlayerProps) {
  const t = useTranslations('lessons')
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const params = new URLSearchParams({ isFree: String(isFree) })
        if (userId) params.set('userId', userId)

        const res = await fetch(`/api/bunny/signed-url/${videoId}?${params}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.reason === 'no_access' ? 'locked' : 'error')
        } else {
          setEmbedUrl(data.embedUrl)
        }
      } catch {
        setError('error')
      } finally {
        setLoading(false)
      }
    }

    fetchUrl()
  }, [videoId, isFree, userId])

  if (loading) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error === 'locked') {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-xl flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">🔒</span>
        <p className="text-white text-lg font-semibold">{t('locked')}</p>
        <a
          href={courseId ? `/courses` : '/courses'}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 text-sm"
        >
          {t('buy')}
        </a>
      </div>
    )
  }

  if (error || !embedUrl) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">{t('errorLoading')}</p>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
