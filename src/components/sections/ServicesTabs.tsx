'use client';

import Link from 'next/link';
import { useState } from 'react';

export interface SanityService {
  _id: string;
  title: string;
  slug: { current: string };
  category: 'innovate' | 'build' | 'refresh' | 'accelerate';
  shortDescription?: string;
}

type CategoryId = 'innovate' | 'build' | 'refresh' | 'accelerate';

const CATEGORIES: {
  id: CategoryId;
  label: string;
  heading: string;
  intro: string;
  accent: string;
}[] = [
  {
    id: 'innovate',
    label: 'Innovate',
    heading: "Reimagine What's Possible",
    intro:
      'From AI strategy to hands-on upskilling, we help teams move from curiosity to capability at enterprise scale.',
    accent: '#534AB7',
  },
  {
    id: 'build',
    label: 'Build',
    heading: 'Ship with Confidence',
    intro:
      'End-to-end engineering for AI-native and modern software — from proof-of-concept to production-grade systems.',
    accent: '#185FA5',
  },
  {
    id: 'refresh',
    label: 'Refresh',
    heading: 'Modernize Without Risk',
    intro:
      'Transform legacy codebases, infrastructure, and platforms without disrupting the business that depends on them.',
    accent: '#0F6E56',
  },
  {
    id: 'accelerate',
    label: 'Accelerate',
    heading: 'Scale on Your Terms',
    intro:
      'Flexible talent and delivery models designed to move faster, reach further, and stay aligned with your roadmap.',
    accent: '#1A1A1A',
  },
];

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

export default function ServicesTabs({ services }: { services: SanityService[] }) {
  const [activeId, setActiveId] = useState<CategoryId>('innovate');

  const active = CATEGORIES.find((c) => c.id === activeId)!;
  const filtered = services.filter((s) => s.category === activeId);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Tab bar */}
        <div
          className="flex gap-2 mb-12 overflow-x-auto scrollbar-none pb-1"
          role="tablist"
          aria-label="Service categories"
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(cat.id)}
                className={`
                  flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold
                  transition-colors duration-200 outline-none
                  focus-visible:ring-2 focus-visible:ring-offset-2
                  ${isActive
                    ? 'text-white'
                    : 'text-ap-mid bg-ap-surface hover:bg-ap-border'
                  }
                `}
                style={isActive ? { backgroundColor: cat.accent } : undefined}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Category heading + intro */}
        <div className="mb-10 max-w-2xl">
          <div
            className="inline-block h-1 w-10 rounded-full mb-4"
            style={{ backgroundColor: active.accent }}
            aria-hidden="true"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-ap-dark leading-tight mb-3">
            {active.heading}
          </h2>
          <p className="text-ap-mid text-lg leading-relaxed">{active.intro}</p>
        </div>

        {/* Service cards */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((service) => (
              <article
                key={service._id}
                className="group flex flex-col bg-white border border-ap-border rounded-2xl p-6
                  hover:shadow-md transition-all duration-300"
                style={{ ['--accent' as string]: active.accent }}
              >
                <h3 className="font-semibold text-ap-dark text-[1.0625rem] leading-snug mb-3 flex-1">
                  {service.title}
                </h3>
                {service.shortDescription && (
                  <p className="text-ap-mid text-sm leading-relaxed mb-6 line-clamp-3">
                    {service.shortDescription}
                  </p>
                )}
                <Link
                  href={`/services/${activeId}/${service.slug.current}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold
                    group-hover:gap-3 transition-all duration-200"
                  style={{ color: active.accent }}
                >
                  Explore
                  <ArrowRight />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-ap-mid">Services coming soon.</p>
        )}
      </div>
    </section>
  );
}
