import type { CollectionConfig } from 'payload'

export const ProductOrders: CollectionConfig = {
  slug: 'product-orders',
  admin: { useAsTitle: 'id' },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'buyer', type: 'relationship', relationTo: 'users', label: 'Покупатель' },
    { name: 'vendor', type: 'relationship', relationTo: 'vendors', label: 'Продавец' },
    { name: 'product', type: 'relationship', relationTo: 'products', label: 'Товар' },
    { name: 'quantity', type: 'number', defaultValue: 1, label: 'Количество' },
    { name: 'price', type: 'number', label: 'Цена на момент покупки (TRY)' },
    { name: 'commission', type: 'number', label: 'Комиссия платформы (TRY)' },
    { name: 'vendorPayout', type: 'number', label: 'К выплате продавцу (TRY)' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      label: 'Статус',
      options: [
        { label: 'Beklemede / Ожидание', value: 'pending' },
        { label: 'Ödendi / Оплачен', value: 'paid' },
        { label: 'Kargoya Verildi / Отправлен', value: 'shipped' },
        { label: 'Teslim Edildi / Доставлен', value: 'delivered' },
        { label: 'İade / Возврат', value: 'refunded' },
      ],
    },
    { name: 'shippingAddress', type: 'json', label: 'Адрес доставки' },
    { name: 'createdAt', type: 'date', label: 'Дата заказа' },
  ],
}
