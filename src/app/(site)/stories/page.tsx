import { Suspense } from 'react';
import { client } from '@/lib/sanity/client';
import { STORIES_ALL_QUERY } from '@/lib/sanity/queries';
import StoriesPageClient, { type SanityStory } from '@/components/sections/StoriesPageClient';
import CTAStrip from '@/components/ui/CTAStrip';

export default async function StoriesPage() {
  const stories = await client.fetch<SanityStory[]>(
    STORIES_ALL_QUERY,
    {},
    { next: { revalidate: 3600, tags: ['stories'] } },
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-ap-border pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-ap-dark leading-[1.08] tracking-tight mb-4 max-w-3xl">
            Partnerships That Drive Progress.
          </h1>
          <p className="text-lg md:text-xl text-ap-mid leading-relaxed max-w-2xl">
            Real Impact. Real Voices. Success Stories That Speak for Themselves.
          </p>
        </div>
      </section>

      {/* Grid + search + pagination */}
      <Suspense fallback={<div className="bg-ap-surface py-16 md:py-24" aria-hidden="true" />}>
        <StoriesPageClient stories={stories ?? []} />
      </Suspense>

      <CTAStrip />
    </>
  );
}
