import type { Metadata } from 'next';
import type { PortableTextBlock } from 'sanity';
import { client } from '@/sanity/lib/client';
import { LEGAL_PAGE_QUERY } from '@/lib/sanity/queries';
import { PortableText } from '@/components/portable-text';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Terms of Service | Authority Partners',
  description: 'Terms of Service for Authority Partners.',
};

interface LegalPage {
  heroTagline?: string | null;
  body?: PortableTextBlock[] | null;
}

export default async function TermsOfServicePage() {
  const page = await client.fetch<LegalPage | null>(
    LEGAL_PAGE_QUERY,
    { identifier: 'terms-of-service' },
    { next: { revalidate: 86400, tags: ['terms-of-service'] } },
  );

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-bold text-ap-dark sm:text-5xl">
          {page?.heroTagline ?? 'Terms of Service'}
        </h1>
        <hr className="my-10 border-ap-border" />
        {page?.body && page.body.length > 0 ? (
          <PortableText value={page.body} />
        ) : (
          <p className="text-ap-light">Content coming soon.</p>
        )}
      </div>
    </main>
  );
}
