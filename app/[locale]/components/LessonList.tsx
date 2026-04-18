'use client'

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
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function LessonList({ lessons, courseSlug, hasAccess, activeLessonId }: LessonListProps) {
  const t = useTranslations('lessons')

  const sorted = [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <ul className="divide-y divide-gray-100">
      {sorted.map((lesson) => {
        const accessible = hasAccess || lesson.isFree
        const isActive = lesson.id === activeLessonId

        return (
          <li key={lesson.id}>
            {accessible ? (
              <Link
                href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors ${
                  isActive ? 'bg-pink-50 border-l-4 border-pink-600' : ''
                }`}
              >
                <span className="text-pink-600 text-lg">▶</span>
                <span className="flex-1 text-sm font-medium text-gray-800">{lesson.title}</span>
                {lesson.isFree && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {t('free')}
                  </span>
                )}
                {lesson.videoDuration && (
                  <span className="text-xs text-gray-400">{formatDuration(lesson.videoDuration)}</span>
                )}
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 opacity-60 cursor-not-allowed">
                <span className="text-gray-400 text-lg">🔒</span>
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
