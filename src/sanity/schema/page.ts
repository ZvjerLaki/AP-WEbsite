import { defineType, defineField, defineArrayMember } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'identifier',
      title: 'Identifier',
      type: 'string',
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'About', value: 'about' },
          { title: 'Contact', value: 'contact' },
          { title: 'AP Lab', value: 'ap-lab' },
          { title: 'Privacy Policy', value: 'privacy-policy' },
          { title: 'Terms of Service', value: 'terms-of-service' },
          { title: 'Disclaimer', value: 'disclaimer' },
          { title: 'Services – Innovate', value: 'innovate' },
          { title: 'Services – Build', value: 'build' },
          { title: 'Services – Refresh', value: 'refresh' },
          { title: 'Services – Accelerate', value: 'accelerate' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Button Text',
      type: 'string',
      description: 'e.g. "Talk to an AI Strategist"',
    }),
    defineField({
      name: 'heroCtaHref',
      title: 'Hero CTA Button URL',
      type: 'string',
      description: 'Defaults to /contact if left blank.',
    }),

    // ── Problem / Solution ────────────────────────────────────────────────────
    defineField({
      name: 'problemHeading',
      title: 'Problem Heading',
      type: 'string',
      description: 'The challenge statement shown in the Problem/Solution section.',
    }),
    defineField({
      name: 'problemBody',
      title: 'Problem Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'solutionHeading',
      title: 'Solution Heading',
      type: 'string',
    }),
    defineField({
      name: 'solutionBody',
      title: 'Solution Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'solutionImage',
      title: 'Solution Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),

    // ── About page ───────────────────────────────────────────────────────────
    defineField({
      name: 'differenceBody',
      title: 'The Authority Partners Difference — Body',
      type: 'text',
      rows: 4,
    }),
    defineField({ name: 'visionHeading', title: 'Vision Heading', type: 'string' }),
    defineField({ name: 'visionBody', title: 'Vision Body', type: 'text', rows: 3 }),
    defineField({ name: 'missionHeading', title: 'Mission Heading', type: 'string' }),
    defineField({ name: 'missionBody', title: 'Mission Body', type: 'text', rows: 3 }),
    defineField({
      name: 'coreValues',
      title: 'Core Values',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Value Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'name' } },
        }),
      ],
    }),

    // ── AP Lab / generic steps ───────────────────────────────────────────────
    defineField({
      name: 'steps',
      title: 'Steps',
      description: 'Ordered steps — used for How to Apply on the AP Lab page.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Step Heading', type: 'string' }),
            defineField({ name: 'body', title: 'Step Description', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),

    // ── FAQs ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string' }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
    }),

    // ── Generic body (used by non-category pages) ─────────────────────────────
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({ name: 'href', title: 'URL', type: 'url' }),
                ],
              },
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'identifier',
      subtitle: 'heroTagline',
    },
  },
})
