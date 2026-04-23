'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// ─── AP Logo Mark (geometric mark from logo.svg) ─────────────────────────────

function APMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="114 -1 54 31"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M131.904 11.9721C130.073 11.9721 128.572 10.4548 128.572 8.60498V3.36716C128.572 1.5173 130.073 0 131.904 0H147.053C148.884 0 151.46 1.05484 152.777 2.34351L162.609 11.9929C163.926 13.2816 165 15.8537 165 17.7036V24.1054C165 25.9552 163.941 26.3969 162.65 25.0875L152.078 14.352C150.787 13.0374 148.226 11.9669 146.395 11.9669H131.909L131.904 11.9721Z" />
      <path d="M150.781 15.9732C152.612 15.9732 154.114 17.4906 154.114 19.3404V24.5782C154.114 26.4281 152.612 27.9454 150.781 27.9454H135.493C133.662 27.9454 131.071 26.9061 129.733 25.6383L119.968 16.337C118.636 15.0691 117.541 12.5126 117.541 10.6627V4.26612C117.541 2.41625 118.616 1.95898 119.927 3.25285L130.438 13.6245C131.749 14.9184 134.321 15.9784 136.156 15.9784H150.776L150.781 15.9732Z" />
    </svg>
  );
}

// ─── Arrow icon ───────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

interface Slide {
  type: 'standard' | 'quote' | 'event';
  label?: string;
  heading?: string;
  subheading?: string;
  quote?: string;
  cta: { text: string; href: string };
  hasMarkBackground?: boolean;
}

const SLIDES: Slide[] = [
  {
    type: 'standard',
    heading: "We Don't Build Alone",
    subheading: "Together We Engineer What's Next",
    cta: { text: 'Start Building Smarter', href: '/services' },
    hasMarkBackground: true,
  },
  {
    type: 'standard',
    heading: 'Rethink AI',
    subheading: 'Digital Experiences from the Ground Up',
    cta: { text: 'Start Your Journey Forward', href: '/services/innovate' },
  },
  {
    type: 'quote',
    quote: '"Authority Partners built with us, not for us and the results speak volumes."',
    cta: { text: 'Explore Success Stories', href: '/stories' },
  },
  {
    type: 'event',
    label: 'Live Architecture & Code Walkthrough',
    heading: 'Production Guardrails for AI Agents',
    subheading: 'Live Architecture & Code Walkthrough by Erol Karabeg',
    cta: { text: 'Watch the recording', href: '/insights/production-guardrails-for-ai-agents' },
  },
];

const INTERVAL_MS = 6000;

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const [markKey, setMarkKey] = useState(0);

  const touchStartX  = useRef<number | null>(null);
  const prevCurrent  = useRef(-1);

  // Re-trigger the AP mark animation each time we land back on slide 0
  useEffect(() => {
    if (current === 0 && prevCurrent.current !== -1 && prevCurrent.current !== 0) {
      setMarkKey((k) => k + 1);
    }
    prevCurrent.current = current;
  }, [current]);

  const goTo = useCallback((index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-rotate; pause when hovered
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      setCurrent((prev) => {
        const dir = delta < 0 ? 1 : -1;
        return (prev + dir + SLIDES.length) % SLIDES.length;
      });
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative bg-ap-dark min-h-[calc(100vh-72px)] flex flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(24,95,165,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Slides */}
      <div className="relative flex-1">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== current}
            className={[
              'absolute inset-0 flex items-center justify-center',
              'transition-opacity duration-700 ease-in-out',
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
            ].join(' ')}
          >
            {/* Slide 1: AP mark watermark */}
            {slide.hasMarkBackground && (
              <div
                key={`mark-${markKey}`}
                className="hero-mark-bg absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <APMark className="w-[520px] h-[520px] text-white" style={{ opacity: 0.055 }} />
              </div>
            )}

            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 text-center">
              {slide.type === 'standard' && (
                <>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.08] tracking-tight">
                    {slide.heading}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/65 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                    {slide.subheading}
                  </p>
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center gap-2 rounded-full bg-ap-blue text-white font-semibold px-8 py-4 hover:bg-ap-blue/90 transition-colors text-sm md:text-base"
                  >
                    {slide.cta.text}
                    <ArrowRight />
                  </Link>
                </>
              )}

              {slide.type === 'quote' && (
                <>
                  <div className="mb-10">
                    <svg
                      className="w-14 h-10 text-ap-blue mx-auto mb-8 opacity-80"
                      viewBox="0 0 56 40"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M0 40V24.4C0 15.4 2.93 8.33 8.8 3.33 14.8-.57 22.1-1.1 30.3 1.08l-2.5 6.67c-4.77-1.1-8.6-.83-11.67.83-2.76 1.42-4.43 4.17-5 8.34H20V40H0Zm33.3 0V24.4c0-9 2.94-16.07 8.8-21.07C48.1-.57 55.4-1.1 63.6 1.08l-2.5 6.67c-4.77-1.1-8.6-.83-11.67.83-2.76 1.42-4.43 4.17-5 8.34H53.3V40H33.3Z" />
                    </svg>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed italic max-w-3xl mx-auto">
                      {slide.quote}
                    </p>
                  </div>
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white font-semibold px-8 py-4 hover:bg-white/10 transition-colors text-sm md:text-base"
                  >
                    {slide.cta.text}
                    <ArrowRight />
                  </Link>
                </>
              )}

              {slide.type === 'event' && (
                <>
                  <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/15 bg-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" aria-hidden="true" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-white/60">
                      {slide.label}
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.08] tracking-tight">
                    {slide.heading}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/65 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                    {slide.subheading}
                  </p>
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center gap-2 rounded-full bg-ap-blue text-white font-semibold px-8 py-4 hover:bg-ap-blue/90 transition-colors text-sm md:text-base"
                  >
                    {slide.cta.text}
                    <ArrowRight />
                  </Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="relative z-20 flex justify-center items-center gap-3 py-8" role="tablist" aria-label="Slide indicators">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={[
              'h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
              i === current ? 'bg-white w-8' : 'bg-white/30 w-2 hover:bg-white/55',
            ].join(' ')}
          />
        ))}
      </div>
    </section>
  );
}
