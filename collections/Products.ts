import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Название товара' },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, label: 'Slug' },
    { name: 'description', type: 'textarea', label: 'Описание' },
    {
      name: 'vendor',
      type: 'relationship',
      relationTo: 'vendors',
      label: 'Продавец',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Категория',
      options: [
        { label: 'Çikolata / Шоколад', value: 'chocolate' },
        { label: 'Kalıplar / Формы', value: 'molds' },
        { label: 'Aletler / Инструменты', value: 'tools' },
        { label: 'Malzemeler / Ингредиенты', value: 'ingredients' },
        { label: 'Ambalaj / Упаковка', value: 'packaging' },
        { label: 'Dekorasyon / Декор', value: 'decoration' },
        { label: 'Diğer / Другое', value: 'other' },
      ],
    },
    { name: 'price', type: 'number', required: true, label: 'Цена (TRY)' },
    { name: 'oldPrice', type: 'number', label: 'Старая цена (зачёркнутая)' },
    { name: 'stock', type: 'number', defaultValue: 0, label: 'Остаток на складе' },
    {
      name: 'images',
      type: 'array',
      label: 'Фотографии товара',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Фото' },
      ],
    },
    { name: 'inStock', type: 'checkbox', defaultValue: true, label: 'В наличии' },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, label: 'Рекомендуемый' },
    {
      name: 'relatedCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      label: 'Связанные курсы',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      label: 'Статус',
      options: [
        { label: 'Taslak / Черновик', value: 'draft' },
        { label: 'Yayında / Опубликован', value: 'published' },
      ],
    },
  ],
}
