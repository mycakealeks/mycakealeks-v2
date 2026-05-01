'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface Lesson {
  id: string
  title: string
  videoDuration?: number
  isFree?: boolean
  order?: number
}

interface LessonListProps {
  lessons: Lesson[]
  courseSlug: string
  hasAccess: boolean
  activeLessonId?: string
  courseId?: string
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function LessonList({ lessons, courseSlug, hasAccess, activeLessonId, courseId }: LessonListProps) {
  const t = useTranslations('lessons')
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!courseId) return
    fetch('/api/users/me')
      .then(r => r.json())
      .then(async d => {
        if (!d?.id) return
        const res = await fetch(`/api/progress?userId=${d.id}&courseId=${courseId}`)
        const data = await res.json()
        setCompletedIds(new Set(
          (data.docs ?? [])
            .filter((p: any) => p.completed)
            .map((p: any) => (typeof p.lesson === 'object' ? p.lesson.id : p.lesson) as string)
        ))
      })
      .catch(() => {})
  }, [courseId])

  const sorted = [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <ul className="divide-y divide-gray-100">
      {sorted.map((lesson) => {
        const accessible = hasAccess || lesson.isFree
        const isActive = lesson.id === activeLessonId
        const isDone = completedIds.has(lesson.id)

        const statusIcon = isDone
          ? <span className="text-green-500 text-base flex-shrink-0">✅</span>
          : isActive
            ? <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full" style={{ background: '#d4537e' }} />
            : accessible
              ? <span className="text-pink-400 text-sm flex-shrink-0">▶</span>
              : <span className="text-gray-400 text-base flex-shrink-0">🔒</span>

        return (
          <li key={lesson.id}>
            {accessible ? (
              <Link
                href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors ${
                  isActive ? 'bg-pink-50 border-l-4 border-pink-600' : ''
                }`}
              >
                {statusIcon}
                <span className={`flex-1 text-sm font-medium ${isDone ? 'text-gray-400 line-through-none' : 'text-gray-800'}`}>
                  {lesson.title}
                </span>
                {lesson.isFree && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                    {t('free')}
                  </span>
                )}
                {lesson.videoDuration && (
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatDuration(lesson.videoDuration)}</span>
                )}
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 opacity-60 cursor-not-allowed">
                {statusIcon}
                <span className="flex-1 text-sm font-medium text-gray-500">{lesson.title}</span>
                {lesson.videoDuration && (
                  <span className="text-xs text-gray-400">{formatDuration(lesson.videoDuration)}</span>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
