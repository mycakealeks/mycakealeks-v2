'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import VideoPlayer from './VideoPlayer'

interface Attachment {
  id: string
  title?: string
  file?: { url: string; filename: string }
}

interface Props {
  lessonId: string
  lessonTitle: string
  lessonNumber: number
  totalLessons: number
  courseId: string
  videoId?: string
  isFree?: boolean
  attachments?: Attachment[]
}

export default function LessonProgressClient({
  lessonId, lessonTitle, lessonNumber, totalLessons, courseId, videoId, isFree, attachments,
}: Props) {
  const t = useTranslations()
  const [userId, setUserId] = useState<string | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [completing, setCompleting] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const fetchProgress = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`/api/progress?userId=${uid}&courseId=${courseId}`)
      const data = await res.json()
      setCompletedIds(new Set(
        (data.docs ?? [])
          .filter((p: any) => p.completed)
          .map((p: any) => (typeof p.lesson === 'object' ? p.lesson.id : p.lesson) as string)
      ))
    } catch {}
  }, [courseId])

  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.json())
      .then(async d => {
        if (d?.id) {
          setUserId(d.id)
          await fetchProgress(d.id)
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [fetchProgress])

  const isCompleted = completedIds.has(lessonId)
  const pct = totalLessons > 0 ? Math.round((completedIds.size / totalLessons) * 100) : 0
  const allDone = totalLessons > 0 && completedIds.size >= totalLessons

  const handleComplete = async () => {
    if (!userId || isCompleted || completing) return
    setCompleting(true)
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courseId, lessonId }),
      })
      await fetchProgress(userId)
    } catch {}
    setCompleting(false)
  }

  return (
    <div>
      {/* Progress bar */}
      {loaded && userId && (
        <div className="rounded-xl px-4 py-3 mb-4" style={{ background: '#fbeaf0' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold" style={{ color: '#d4537e' }}>
              {t('lesson.lessonCount', { current: lessonNumber, total: totalLessons })}
              {' '}— {pct}% {t('lesson.progressDone')}
            </span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 8, background: '#fff' }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${pct}%`, background: '#d4537e', borderRadius: 4 }}
            />
          </div>
        </div>
      )}

      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{lessonTitle}</h1>

      {videoId ? (
        <VideoPlayer videoId={videoId} isFree={isFree} courseId={courseId} />
      ) : (
        <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
          <p className="text-gray-400">{t('lessons.noVideo')}</p>
        </div>
      )}

      {/* Complete button */}
      {loaded && userId && (
        <div className="mt-6">
          {allDone ? (
            <div
              className="rounded-xl p-5 text-center"
              style={{ background: '#fbeaf0', border: '1.5px solid #f0d0dc' }}
            >
              <p className="text-3xl mb-2">🎉</p>
              <p className="font-bold text-gray-900 mb-1">{t('lesson.congratulations')}</p>
              <p className="text-sm text-gray-500 mb-4">{t('lesson.courseFinished')}</p>
              <a
                href={`/api/certificate/${courseId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-2.5 text-sm inline-flex"
              >
                🏆 {t('lesson.getCertificate')}
              </a>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isCompleted || completing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
              style={
                isCompleted
                  ? { background: '#dcfce7', color: '#16a34a', cursor: 'default' }
                  : { background: '#d4537e', color: '#fff' }
              }
            >
              {completing
                ? '...'
                : isCompleted
                  ? `✓ ${t('lesson.completed')}`
                  : `✅ ${t('lesson.complete')}`}
            </button>
          )}
        </div>
      )}

      {/* Attachments */}
      {attachments && attachments.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-gray-800 mb-3">{t('lessons.materials')}</h2>
          <ul className="space-y-2">
            {attachments.map((att) => (
              <li key={att.id}>
                {att.file?.url ? (
                  <a
                    href={att.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    style={{ color: '#d4537e' }}
                  >
                    📎 {att.title || att.file.filename}
                  </a>
                ) : (
                  <span className="text-gray-500 text-sm">📎 {att.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
