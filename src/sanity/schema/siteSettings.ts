import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    }),
    defineField({
      name: 'officeUSA',
      title: 'Office USA',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'officeBosnia',
      title: 'Office Bosnia',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'officeTurkey',
      title: 'Office Turkey',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'phoneUSA',
      title: 'Phone USA',
      type: 'string',
    }),
    defineField({
      name: 'phoneBosnia',
      title: 'Phone Bosnia',
      type: 'string',
    }),
    defineField({
      name: 'contactFormRecipient',
      title: 'Contact Form Recipient Email',
      type: 'string',
      validation: (rule) =>
        rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email', invert: false }).warning('Must be a valid email address'),
    }),
    defineField({
      name: 'linkedInUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
    },
  },
})
