import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'
const isAdminOrSelf = ({ req }: { req: any }) =>
  req.user?.role === 'admin' ? true : req.user ? { user: { equals: req.user.id } } : false

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: { useAsTitle: 'type', defaultColumns: ['user', 'type', 'earnedAt'] },
  access: { read: isAdminOrSelf, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true },
    {
      name: 'type', type: 'select', required: true, index: true,
      options: [
        { label: '🎯 İlk Ders — Первый урок', value: 'first_lesson' },
        { label: '🎓 İlk Kurs — Первый курс', value: 'first_course' },
        { label: '🔥 7 Gün — 7 дней подряд', value: 'streak_7days' },
        { label: '🔥 30 Gün — 30 дней подряд', value: 'streak_30days' },
        { label: '💎 VIP Öğrenci — 3+ курса', value: 'vip_student' },
        { label: '🏆 Usta — Все курсы', value: 'all_courses' },
      ],
    },
    { name: 'earnedAt', type: 'date', label: 'Дата получения' },
  ],
  timestamps: true,
}
