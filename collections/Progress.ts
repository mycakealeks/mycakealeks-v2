import type { CollectionConfig } from 'payload'

export const Progress: CollectionConfig = {
  slug: 'progress',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Пользователь',
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
      name: 'lesson',
      type: 'relationship',
      relationTo: 'lessons',
      label: 'Урок',
      required: true,
    },
    {
      name: 'completed',
      type: 'checkbox',
      label: 'Завершён',
      defaultValue: false,
    },
    {
      name: 'completedAt',
      type: 'date',
      label: 'Дата завершения',
    },
    {
      name: 'watchedSeconds',
      type: 'number',
      label: 'Просмотрено секунд',
      defaultValue: 0,
    },
  ],
}
