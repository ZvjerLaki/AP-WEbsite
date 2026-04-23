'use client';

import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';

// ─── Stat counter ─────────────────────────────────────────────────────────────

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 28,  suffix: '+', label: 'Years of Experience' },
  { value: 400, suffix: '+', label: 'Consultants' },
  { value: 13,  suffix: '',  label: 'Time Zones' },
  { value: 500, suffix: '',  label: 'Fortune 500 Clients' },
];

// Ease-out quad
function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}

function useCountUp(target: number, duration = 1400, active: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(easeOut(progress) * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [active, target, duration]);

  return count;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  // Fortune 500 shows "Fortune 500" not a counting number
  const isFortune = stat.label === 'Fortune 500 Clients';
  const count = useCountUp(isFortune ? 500 : stat.value, 1400, active);

  return (
    <div className="flex flex-col">
      <div className="text-4xl md:text-5xl font-bold text-ap-dark tracking-tight leading-none mb-2">
        {isFortune ? (
          <>Fortune {active ? count : 0}</>
        ) : (
          <>{active ? count : 0}{stat.suffix}</>
        )}
      </div>
      <p className="text-sm font-medium text-ap-mid">{stat.label}</p>
    </div>
  );
}

// ─── ArrowRight icon ──────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function GlobalTalent() {
  const textRef  = useIntersectionObserver<HTMLDivElement>();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  const activateStats = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting) setStatsActive(true);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setStatsActive(true);
      return;
    }
    const observer = new IntersectionObserver(activateStats, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [activateStats]);

  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: text */}
          <div ref={textRef} className="stagger-children flex flex-col">
            <p className="text-xs font-semibold tracking-widest uppercase text-ap-blue mb-6">
              Global minds, local execution. Designed around you.
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-ap-dark mb-6 leading-[1.1] tracking-tight">
              Global Talent. Local Precision. Engineered for Scale.
            </h2>

            <p className="text-lg text-ap-mid leading-relaxed mb-10">
              With over 28 years of experience, Authority Partners brings together globally
              distributed teams of top engineering talent to build software that moves your
              business forward. From custom development to digital transformation, our agile
              approach helps you scale efficiently without sacrificing quality.
            </p>

            <Link
              href="/about"
              className="self-start inline-flex items-center gap-2 rounded-full bg-ap-blue text-white font-semibold px-8 py-4 hover:bg-ap-blue/90 transition-colors text-sm md:text-base"
            >
              See What Our Teams Can Do
              <ArrowRight />
            </Link>
          </div>

          {/* Right: stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 gap-x-10 gap-y-12 pt-2"
          >
            {STATS.map((stat) => (
              <StatItem key={stat.label} stat={stat} active={statsActive} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
