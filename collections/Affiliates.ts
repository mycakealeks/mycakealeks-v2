import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'

export const Affiliates: CollectionConfig = {
  slug: 'affiliates',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['user', 'code', 'status', 'totalEarned', 'pendingPayout', 'createdAt'],
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
      unique: true,
      index: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Affiliate code',
    },
    {
      name: 'commissionRate',
      type: 'number',
      defaultValue: 20,
      label: 'Commission % per sale',
      min: 0,
      max: 100,
    },
    {
      name: 'totalEarned',
      type: 'number',
      defaultValue: 0,
      label: 'Total earned (TRY)',
      admin: { readOnly: true },
    },
    {
      name: 'pendingPayout',
      type: 'number',
      defaultValue: 0,
      label: 'Pending payout (TRY)',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending review', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      name: 'payoutMethod',
      type: 'text',
      label: 'Payout details (bank / IBAN / PayPal)',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Application notes / social links',
    },
  ],
  timestamps: true,
}
