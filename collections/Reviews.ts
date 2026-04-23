import type { CollectionConfig } from 'payload'

const isAdmin = ({ req: { user } }: any) => user?.role === 'admin'
const isLoggedIn = ({ req: { user } }: any) => Boolean(user)

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['user', 'course', 'rating', 'isApproved', 'createdAt'],
  },
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: { description: '1–5 stars' },
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'isApproved',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Approve to show publicly' },
    },
  ],
  timestamps: true,
}
