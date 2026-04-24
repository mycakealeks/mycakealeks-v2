import type { CollectionConfig } from 'payload'

export const Passkeys: CollectionConfig = {
  slug: 'passkeys',
  admin: { useAsTitle: 'credentialId' },
  access: {
    create: () => false,
    read: ({ req }) => req.user?.role === 'admin' || (req.user != null),
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'credentialId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'publicKey',
      type: 'text',
      required: true,
    },
    {
      name: 'counter',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'deviceType',
      type: 'text',
    },
    {
      name: 'transports',
      type: 'text',
    },
  ],
}
