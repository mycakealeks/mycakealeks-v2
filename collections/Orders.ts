import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Пользователь',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Товары',
      fields: [
        {
          name: 'itemType',
          type: 'select',
          label: 'Тип',
          options: [
            { label: 'Курс', value: 'course' },
            { label: 'Рецепт', value: 'recipe' },
          ],
        },
        {
          name: 'course',
          type: 'relationship',
          relationTo: 'courses',
          label: 'Курс',
        },
        {
          name: 'recipe',
          type: 'relationship',
          relationTo: 'recipes',
          label: 'Рецепт',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Цена',
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      label: 'Итого ($)',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'pending',
      options: [
        { label: 'Ожидает оплаты', value: 'pending' },
        { label: 'Оплачен', value: 'paid' },
        { label: 'Отменён', value: 'cancelled' },
      ],
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Валюта',
      defaultValue: 'TRY',
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Способ оплаты',
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'ЮKassa', value: 'yukassa' },
      ],
    },
    {
      name: 'paymentId',
      type: 'text',
      label: 'ID платежа',
    },
    {
      name: 'stripePaymentId',
      type: 'text',
      label: 'Stripe Payment ID (legacy)',
      admin: { condition: () => false },
    },
  ],
}
