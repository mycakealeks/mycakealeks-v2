import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Название',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL slug',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Тип',
      options: [
        { label: 'Курсы', value: 'courses' },
        { label: 'Рецепты', value: 'recipes' },
      ],
    },
  ],
}
