import type { CollectionConfig } from 'payload'

export const UserEvents: CollectionConfig = {
  slug: 'user-events',
  admin: { useAsTitle: 'event' },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'sessionId',
      type: 'text',
    },
    {
      name: 'event',
      type: 'select',
      required: true,
      options: [
        { label: 'Page View', value: 'page_view' },
        { label: 'Course View', value: 'course_view' },
        { label: 'Lesson View', value: 'lesson_view' },
        { label: 'Recipe View', value: 'recipe_view' },
        { label: 'Add to Cart', value: 'add_to_cart' },
        { label: 'Purchase', value: 'purchase' },
        { label: 'Search', value: 'search' },
        { label: 'Time on Page', value: 'time_on_page' },
      ],
    },
    {
      name: 'entityId',
      type: 'text',
    },
    {
      name: 'entityType',
      type: 'select',
      options: [
        { label: 'Course', value: 'course' },
        { label: 'Lesson', value: 'lesson' },
        { label: 'Recipe', value: 'recipe' },
        { label: 'News', value: 'news' },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
  timestamps: true,
}
