import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: { useAsTitle: 'code', defaultColumns: ['code', 'type', 'value', 'usedCount', 'isActive', 'expiresAt'] },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.code) data.code = String(data.code).toUpperCase().trim()
        return data
      },
    ],
  },
  fields: [
    { name: 'code', type: 'text', label: 'Код купона', required: true, unique: true, index: true },
    {
      name: 'type', type: 'select', label: 'Тип скидки', required: true, defaultValue: 'percentage',
      options: [{ label: 'Процент (%)', value: 'percentage' }, { label: 'Фиксированная сумма (TRY)', value: 'fixed' }],
    },
    { name: 'value', type: 'number', label: 'Размер скидки', required: true, min: 0 },
    { name: 'minOrderAmount', type: 'number', label: 'Минимальная сумма заказа', defaultValue: 0 },
    { name: 'maxUses', type: 'number', label: 'Макс. использований (0 = без лимита)', defaultValue: 0 },
    { name: 'usedCount', type: 'number', label: 'Использовано', defaultValue: 0, admin: { readOnly: true } },
    { name: 'expiresAt', type: 'date', label: 'Срок действия' },
    { name: 'isActive', type: 'checkbox', label: 'Активен', defaultValue: true },
    {
      name: 'applicableCourses', type: 'relationship', relationTo: 'courses', hasMany: true,
      label: 'Применимые курсы (пусто = все)', admin: { description: 'Оставьте пустым для применения ко всем курсам' },
    },
  ],
}
