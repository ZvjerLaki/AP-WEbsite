'use client';

import Link from 'next/link';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';

const cards = [
  {
    heading: 'Innovate',
    description:
      'Leverage our experience and R&D to turn emerging technology into a competitive advantage — from AI strategy to validated prototypes with measurable outcomes.',
    href: '/services/innovate',
    accent: 'bg-ap-blue',
    color: 'text-ap-blue',
  },
  {
    heading: 'Refresh',
    description:
      'Eliminate technical debt and modernize legacy systems without disrupting the operations your business depends on, unlocking agility and reducing risk.',
    href: '/services/refresh',
    accent: 'bg-ap-teal',
    color: 'text-ap-teal',
  },
  {
    heading: 'Accelerate',
    description:
      'Strengthen your teams with embedded engineers, staff augmentation, and delivery leadership that scales at the speed of your ambition.',
    href: '/services/accelerate',
    accent: 'bg-ap-purple',
    color: 'text-ap-purple',
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

export default function EngineeredYourWay() {
  const headerRef = useIntersectionObserver<HTMLDivElement>();
  const cardsRef = useIntersectionObserver<HTMLDivElement>();

  return (
    <section className="bg-ap-surface py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={headerRef} className="fade-in-up mb-16 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-ap-dark mb-6 leading-[1.1] tracking-tight">
            Engineered Your Way.
          </h2>
          <p className="text-lg text-ap-mid leading-relaxed">
            From innovation strategy to product delivery, legacy modernization, and scaling your
            teams, we partner with you to engineer intelligent, future-ready systems that drive
            measurable business outcomes.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {cards.map((card) => (
            <div
              key={card.href}
              className="flex flex-col bg-white rounded-2xl border border-ap-border p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className={`w-10 h-1 rounded-full ${card.accent} mb-6`} aria-hidden="true" />
              <h3 className="text-2xl font-bold text-ap-dark mb-3">{card.heading}</h3>
              <p className="text-ap-mid leading-relaxed flex-1 mb-8">{card.description}</p>
              <Link
                href={card.href}
                className={`inline-flex items-center gap-2 text-sm font-semibold ${card.color} hover:opacity-75 transition-opacity`}
              >
                Read more
                <ArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
