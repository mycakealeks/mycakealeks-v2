import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название курса',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'emoji',
      type: 'text',
      label: 'Эмодзи',
      defaultValue: '🎂',
    },
    {
      name: 'level',
      type: 'select',
      label: 'Уровень',
      defaultValue: 'beginner',
      options: [
        { label: 'Başlangıç / Başlangıç', value: 'beginner' },
        { label: 'Orta / Средний', value: 'intermediate' },
        { label: 'İleri / Продвинутый', value: 'advanced' },
      ],
    },
    {
      name: 'oldPrice',
      type: 'number',
      label: 'Старая цена (зачёркнутая)',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Цена ($)',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Категория',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'draft',
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'Опубликован', value: 'published' },
      ],
    },
    {
      name: 'modules',
      type: 'array',
      label: 'Модули',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название модуля',
        },
        {
          name: 'lessons',
          type: 'array',
          label: 'Уроки',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Название урока',
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: 'Ссылка на видео (Bunny.net)',
            },
            {
              name: 'duration',
              type: 'number',
              label: 'Длительность (мин)',
            },
          ],
        },
      ],
    },
  ],
}
