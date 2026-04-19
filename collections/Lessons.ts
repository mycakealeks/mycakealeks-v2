import type { CollectionConfig } from 'payload'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название урока',
      required: true,
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      label: 'Курс',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок',
      defaultValue: 0,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Описание',
    },
    {
      name: 'videoId',
      type: 'text',
      label: 'Bunny.net Video ID',
    },
    {
      name: 'videoDuration',
      type: 'number',
      label: 'Длительность (сек)',
    },
    {
      name: 'videoStatus',
      type: 'select',
      label: 'Статус видео',
      defaultValue: 'pending',
      options: [
        { label: 'Ожидает загрузки', value: 'pending' },
        { label: 'Обрабатывается', value: 'processing' },
        { label: 'Готово', value: 'ready' },
        { label: 'Ошибка', value: 'error' },
      ],
    },
    {
      name: 'isFree',
      type: 'checkbox',
      label: 'Бесплатный урок (предпросмотр)',
      defaultValue: false,
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Материалы',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название',
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'Файл',
        },
      ],
    },
  ],
}
