import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
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
