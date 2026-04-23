import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'difficulty', 'isFree', 'status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { status: { equals: 'published' } }
    },
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 80)
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'Auto-generated from title if empty' },
    },
    { name: 'description', type: 'textarea' },
    { name: 'content', type: 'richText', label: 'Steps / Content' },
    {
      name: 'ingredients',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'amount', type: 'text' },
      ],
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Easy / Kolay', value: 'easy' },
        { label: 'Medium / Orta', value: 'medium' },
        { label: 'Hard / Zor', value: 'hard' },
      ],
    },
    { name: 'prepTime', type: 'number', label: 'Prep time (minutes)' },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Cake / Kek', value: 'cake' },
        { label: 'Cream / Krem', value: 'cream' },
        { label: 'Decoration / Dekorasyon', value: 'decoration' },
        { label: 'Dough / Hamur', value: 'dough' },
        { label: 'Other / Diğer', value: 'other' },
      ],
    },
    { name: 'coverEmoji', type: 'text', defaultValue: '🎂' },
    { name: 'price', type: 'number', defaultValue: 0 },
    { name: 'isFree', type: 'checkbox', defaultValue: true },
    { name: 'pdfFile', type: 'upload', relationTo: 'media' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
