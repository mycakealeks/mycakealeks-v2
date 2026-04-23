import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'
const isAdminOrSelf = ({ req }: { req: any }) =>
  req.user?.role === 'admin' ? true : req.user ? { user: { equals: req.user.id } } : false

export const Points: CollectionConfig = {
  slug: 'points',
  admin: { useAsTitle: 'reason', defaultColumns: ['user', 'points', 'type', 'reason', 'createdAt'] },
  access: { read: isAdminOrSelf, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'points', type: 'number', required: true, label: 'Баллы' },
    {
      name: 'type', type: 'select', required: true,
      options: [{ label: 'Начислено', value: 'earned' }, { label: 'Потрачено', value: 'spent' }],
    },
    {
      name: 'reason', type: 'select', required: true,
      options: [
        { label: 'Покупка курса', value: 'course_purchase' },
        { label: 'Покупка рецепта', value: 'recipe_purchase' },
        { label: 'Реферал', value: 'referral' },
        { label: 'Промоакция', value: 'promotion' },
        { label: 'Бонус', value: 'bonus' },
        { label: 'Трата баллов', value: 'spend' },
      ],
    },
    { name: 'orderId', type: 'text', label: 'ID заказа (опционально)' },
  ],
  timestamps: true,
}
