import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: any }) => req.user?.role === 'admin'
const isAdminOrSelf = ({ req }: { req: any }) =>
  req.user?.role === 'admin' || (req.user != null)

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: () => true,          // allow public registration
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'Имя',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Фамилия',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Роль',
      defaultValue: 'customer',
      access: {
        // only admins can set/change role
        update: isAdmin,
      },
      options: [
        { label: 'Покупатель', value: 'customer' },
        { label: 'Администратор', value: 'admin' },
      ],
    },
    {
      name: 'purchasedCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      label: 'Купленные курсы',
    },
    {
      name: 'purchasedRecipes',
      type: 'relationship',
      relationTo: 'recipes',
      hasMany: true,
      label: 'Купленные рецепты',
    },
  ],
}
