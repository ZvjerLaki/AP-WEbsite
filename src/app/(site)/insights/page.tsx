import { Suspense } from 'react';
import { client } from '@/lib/sanity/client';
import { INSIGHTS_ALL_QUERY } from '@/lib/sanity/queries';
import InsightsPageClient, { type SanityPost } from '@/components/sections/InsightsPageClient';
import CTAStrip from '@/components/ui/CTAStrip';

export default async function InsightsPage() {
  const posts = await client.fetch<SanityPost[]>(
    INSIGHTS_ALL_QUERY,
    {},
    { next: { revalidate: 1800, tags: ['insights'] } },
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-ap-border pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-ap-dark leading-[1.08] tracking-tight mb-4 max-w-3xl">
            News That Moves.<br />
            Insights That Matter.
          </h1>
          <p className="text-lg md:text-xl text-ap-mid leading-relaxed max-w-2xl">
            Thoughts, breakthroughs, and stories from the people building what&apos;s next.
          </p>
        </div>
      </section>

      {/* Grid + search + pagination — useSearchParams requires Suspense boundary */}
      <Suspense fallback={<div className="bg-ap-surface py-16 md:py-24" aria-hidden="true" />}>
        <InsightsPageClient posts={posts ?? []} />
      </Suspense>

      <CTAStrip />
    </>
  );
}
