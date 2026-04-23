'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity/image';

export interface SanityStory {
  _id: string;
  title: string;
  slug: { current: string };
  heroImage?: { asset: { _ref: string }; alt?: string } | null;
}

const PAGE_SIZE = 6;

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StoryCard({ story }: { story: SanityStory }) {
  const imageUrl = story.heroImage
    ? urlFor(story.heroImage).width(640).height(400).url()
    : null;

  return (
    <article className="group flex flex-col bg-white border border-ap-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative w-full aspect-[3/2] bg-ap-surface flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={story.heroImage?.alt ?? story.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(24,95,165,0.12) 0%, transparent 70%), linear-gradient(135deg, #f7f7f5 0%, #ebebea 100%)',
            }}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-semibold text-ap-dark leading-snug mb-4 flex-1 text-[1.0625rem]">
          {story.title}
        </h3>
        <Link
          href={`/stories/${story.slug.current}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ap-blue group-hover:gap-3 transition-all duration-200"
        >
          Read Case Study
          <ArrowRight />
        </Link>
      </div>
    </article>
  );
}

export default function StoriesPageClient({ stories }: { stories: SanityStory[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  const urlPage = Number(searchParams.get('page') ?? '1');

  const filtered = query.trim()
    ? stories.filter((s) =>
        s.title.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : stories;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = query ? 1 : Math.min(Math.max(1, urlPage), totalPages);
  const pageStories = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete('page');
    else params.set('page', String(page));
    const qs = params.toString();
    router.push(`/stories${qs ? `?${qs}` : ''}`);
  }

  return (
    <section className="bg-ap-surface py-16 md:py-24 border-b border-ap-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Search */}
        <div className="mb-10 max-w-md">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ap-light pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-ap-border bg-white text-ap-dark placeholder:text-ap-light text-sm focus:outline-none focus:ring-2 focus:ring-ap-blue/20 focus:border-ap-blue transition-colors"
            />
          </div>
          {query && (
            <p className="mt-3 text-sm text-ap-light">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        {/* Grid */}
        {pageStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {pageStories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-ap-mid text-lg">No stories found.</p>
          </div>
        )}

        {/* Pagination */}
        {!query && totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-ap-border text-sm font-medium text-ap-mid bg-white hover:bg-ap-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M10 4l-4 4 4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={
                  page === currentPage
                    ? 'w-10 h-10 rounded-lg text-sm font-semibold bg-ap-blue text-white'
                    : 'w-10 h-10 rounded-lg text-sm font-medium border border-ap-border text-ap-mid bg-white hover:bg-ap-surface transition-colors'
                }
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-ap-border text-sm font-medium text-ap-mid bg-white hover:bg-ap-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </nav>
        )}

      </div>
    </section>
  );
}
