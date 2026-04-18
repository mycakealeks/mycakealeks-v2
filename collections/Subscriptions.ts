import type { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
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
      name: 'plan',
      type: 'select',
      label: 'Тариф',
      required: true,
      options: [
        { label: 'Месяц', value: 'monthly' },
        { label: 'Год', value: 'yearly' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'active',
      options: [
        { label: 'Активна', value: 'active' },
        { label: 'Отменена', value: 'cancelled' },
        { label: 'Истекла', value: 'expired' },
        { label: 'Пробный период', value: 'trialing' },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Дата начала',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Дата окончания',
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Провайдер оплаты',
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'ЮKassa', value: 'yukassa' },
      ],
    },
    {
      name: 'providerSubscriptionId',
      type: 'text',
      label: 'ID подписки у провайдера',
    },
  ],
}
