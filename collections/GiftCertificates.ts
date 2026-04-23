import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'

export const GiftCertificates: CollectionConfig = {
  slug: 'gift-certificates',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'amount', 'recipientEmail', 'isUsed', 'expiresAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { purchasedBy: { equals: req.user.id } }
      return false
    },
    create: ({ req }) => Boolean(req.user),
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, index: true },
    { name: 'amount', type: 'number', required: true, label: 'Amount (TRY)' },
    { name: 'purchasedBy', type: 'relationship', relationTo: 'users', index: true },
    { name: 'usedBy', type: 'relationship', relationTo: 'users' },
    { name: 'isUsed', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'expiresAt', type: 'date', required: true },
    { name: 'recipientEmail', type: 'email', required: true },
    { name: 'recipientName', type: 'text', required: true },
    { name: 'message', type: 'textarea' },
  ],
  timestamps: true,
}
