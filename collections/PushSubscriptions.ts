import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'

export const PushSubscriptions: CollectionConfig = {
  slug: 'push-subscriptions',
  admin: {
    useAsTitle: 'locale',
    defaultColumns: ['user', 'locale', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { user: { equals: req.user.id } }
      return false
    },
    create: ({ req }) => req.user != null,
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
      name: 'subscription',
      type: 'json',
      required: true,
      label: 'Push subscription (endpoint + keys)',
    },
    {
      name: 'locale',
      type: 'text',
      defaultValue: 'tr',
      label: 'Locale',
    },
  ],
  timestamps: true,
}
