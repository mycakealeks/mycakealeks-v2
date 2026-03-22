import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
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
