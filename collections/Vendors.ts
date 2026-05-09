import type { CollectionConfig } from 'payload'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Название' },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, label: 'Slug' },
    { name: 'description', type: 'textarea', label: 'Описание' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Логотип' },
    { name: 'website', type: 'text', label: 'Сайт' },
    {
      name: 'commissionRate',
      type: 'number',
      defaultValue: 15,
      label: 'Комиссия платформы (%)',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      label: 'Статус',
      options: [
        { label: 'Beklemede / Ожидание', value: 'pending' },
        { label: 'Aktif / Активен', value: 'active' },
        { label: 'Askıya Alındı / Приостановлен', value: 'suspended' },
      ],
    },
    { name: 'contactEmail', type: 'email', label: 'Email для связи' },
    { name: 'payoutMethod', type: 'text', label: 'Способ выплаты' },
    { name: 'totalSales', type: 'number', defaultValue: 0, label: 'Общий объём продаж (TRY)' },
    { name: 'user', type: 'relationship', relationTo: 'users', label: 'Аккаунт продавца' },
  ],
}
