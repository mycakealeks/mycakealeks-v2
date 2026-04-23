import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'

export const Referrals: CollectionConfig = {
  slug: 'referrals',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['referrer', 'referee', 'code', 'status', 'reward', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { referrer: { equals: req.user.id } }
      return false
    },
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'referrer', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'referee', type: 'relationship', relationTo: 'users', index: true },
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Converted', value: 'converted' },
      ],
    },
    { name: 'reward', type: 'number', defaultValue: 0, label: 'Points rewarded' },
  ],
  timestamps: true,
}
