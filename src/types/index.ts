import type { Image, Slug, PortableTextBlock } from 'sanity';

export interface SanityBase {
  _id: string;
  _type: string;
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
}

export type { Image as SanityImage, Slug, PortableTextBlock };
