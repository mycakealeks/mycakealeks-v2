import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'providerPaymentId',
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Заказ',
    },
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscriptions',
      label: 'Подписка',
    },
    {
      name: 'provider',
      type: 'select',
      label: 'Провайдер',
      required: true,
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'ЮKassa', value: 'yukassa' },
      ],
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Сумма',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Валюта',
      defaultValue: 'TRY',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'pending',
      options: [
        { label: 'Ожидает', value: 'pending' },
        { label: 'Успешно', value: 'succeeded' },
        { label: 'Ошибка', value: 'failed' },
        { label: 'Возврат', value: 'refunded' },
      ],
    },
    {
      name: 'providerPaymentId',
      type: 'text',
      label: 'ID платежа у провайдера',
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Метаданные',
    },
  ],
}
