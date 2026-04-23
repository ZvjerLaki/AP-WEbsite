import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/sanity/client';
import { INSIGHTS_GRID_QUERY } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string | null;
  category: 'article' | 'webinar' | 'guide' | null;
  heroImage?: { asset: { _ref: string }; alt?: string };
}

const CATEGORY_LABEL: Record<string, string> = {
  article: 'Article',
  webinar: 'Webinar',
  guide: 'Guide',
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function InsightsGrid() {
  const posts = await client.fetch<SanityPost[]>(
    INSIGHTS_GRID_QUERY,
    {},
    { next: { revalidate: 1800, tags: ['insights'] } },
  );

  if (!posts?.length) return null;

  return (
    <section className="bg-ap-dark py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
            Insights That Power Innovation.
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Thoughts, breakthroughs, and stories from the people building what&apos;s next.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {posts.map((post) => {
            const imageUrl = post.heroImage
              ? urlFor(post.heroImage).width(640).height(400).url()
              : null;

            return (
              <article
                key={post._id}
                className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors duration-300"
              >
                {/* Cover */}
                <div className="relative w-full aspect-[8/5] bg-white/5 flex-shrink-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={post.heroImage?.alt ?? post.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(24,95,165,0.3) 0%, transparent 70%)',
                      }}
                      aria-hidden="true"
                    />
                  )}
                  {post.category && (
                    <span className="absolute top-4 left-4 text-[0.7rem] font-semibold uppercase tracking-widest bg-ap-blue text-white px-2.5 py-1 rounded-full">
                      {CATEGORY_LABEL[post.category] ?? post.category}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-6">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt} className="text-xs font-medium text-white/40 mb-3">
                      {formatDate(post.publishedAt)}
                    </time>
                  )}
                  <h3 className="font-semibold text-white leading-snug mb-4 flex-1">
                    {post.title}
                  </h3>
                  <Link
                    href={`/insights/${post.slug.current}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-ap-blue group-hover:opacity-75 transition-opacity"
                  >
                    Read More
                    <ArrowRight />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white font-semibold px-8 py-4 hover:border-white/50 hover:bg-white/5 transition-colors text-sm md:text-base"
          >
            View All Insights
            <ArrowRight />
          </Link>
        </div>

      </div>
    </section>
  );
}
