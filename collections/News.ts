import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
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
    {
      name: 'title',
      type: 'text',
      label: 'Başlık',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      unique: true,
      index: true,
      admin: { description: 'Boş bırakırsanız başlıktan otomatik oluşturulur.' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Kısa Açıklama',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'İçerik',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      defaultValue: 'trends',
      options: [
        { label: 'Trendler', value: 'trends' },
        { label: 'Tarifler', value: 'recipes' },
        { label: 'Teknikler', value: 'techniques' },
        { label: 'İş Dünyası', value: 'business' },
        { label: 'İlham', value: 'inspiration' },
      ],
    },
    {
      name: 'coverEmoji',
      type: 'text',
      label: 'Emoji',
      defaultValue: '🎂',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Yayın Tarihi',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Durum',
      defaultValue: 'draft',
      options: [
        { label: 'Taslak', value: 'draft' },
        { label: 'Yayında', value: 'published' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Öne Çıkan',
      defaultValue: false,
    },
  ],
}
