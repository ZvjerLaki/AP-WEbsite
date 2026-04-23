'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';

export interface StoryCard {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  imageAlt: string;
}

// Card width in px — must match the w-[] class on <article>
const CARD_W = 336;
const GAP = 20;

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StoriesCarousel({ stories }: { stories: StoryCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useIntersectionObserver<HTMLDivElement>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const dragOrigin = useRef<{ x: number; scrollLeft: number } | null>(null);

  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener('scroll', syncArrows, { passive: true });
    const ro = new ResizeObserver(syncArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', syncArrows);
      ro.disconnect();
    };
  }, [syncArrows]);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * (CARD_W + GAP), behavior: 'smooth' });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    dragOrigin.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    el.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragOrigin.current) return;
    trackRef.current!.scrollLeft = dragOrigin.current.scrollLeft - (e.clientX - dragOrigin.current.x);
  };

  const onDragEnd = () => {
    dragOrigin.current = null;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  };

  if (!stories.length) return null;

  return (
    <>
      {/* Heading + arrow controls */}
      <div
        ref={headerRef}
        className="fade-in-up max-w-7xl mx-auto px-6 lg:px-8 mb-10 flex items-end justify-between gap-6"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-ap-dark leading-[1.1] tracking-tight">
          Real Impact. Real Voices.
        </h2>
        <div className="flex gap-2 flex-shrink-0 mb-1">
          <button
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            aria-label="Previous stories"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-ap-border bg-white text-ap-mid hover:border-ap-blue hover:text-ap-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            aria-label="Next stories"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-ap-border bg-white text-ap-mid hover:border-ap-blue hover:text-ap-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Scroll track — left edge aligns with the max-w-7xl container above */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto scrollbar-none pb-6 cursor-grab select-none"
          style={{
            paddingLeft: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
            paddingRight: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
            scrollSnapType: 'x mandatory',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
        >
          {stories.map((story) => (
            <article
              key={story._id}
              className="w-[336px] flex-shrink-0 flex flex-col rounded-2xl overflow-hidden border border-ap-border bg-white hover:shadow-md transition-shadow duration-300"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Cover image */}
              <div className="relative w-full aspect-[3/2] bg-ap-dark flex-shrink-0">
                {story.imageUrl ? (
                  <Image
                    src={story.imageUrl}
                    alt={story.imageAlt}
                    fill
                    className="object-cover"
                    sizes="336px"
                    draggable={false}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(24,95,165,0.35) 0%, transparent 70%), linear-gradient(135deg, #1A1A1A 0%, #2e2e2e 100%)',
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-[0.95rem] font-semibold text-ap-dark leading-snug mb-4 flex-1">
                  {story.title}
                </h3>
                <Link
                  href={`/stories/${story.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-ap-blue hover:opacity-75 transition-opacity"
                >
                  Read Success Story
                  <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
