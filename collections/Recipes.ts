import type { CollectionConfig } from 'payload'

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название рецепта',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
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
      name: 'ingredients',
      type: 'array',
      label: 'Ингредиенты',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Название',
        },
        {
          name: 'amount',
          type: 'text',
          label: 'Количество',
        },
      ],
    },
    {
      name: 'pdfFile',
      type: 'upload',
      relationTo: 'media',
      label: 'PDF файл',
    },
  ],
}
