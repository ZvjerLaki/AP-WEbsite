'use client';

import Link from 'next/link';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';

const bullets = [
  'Boost productivity with software designed around how you actually work',
  'Scale confidently with systems that evolve alongside your business',
  'Move faster with the agility and expertise to handle complex tech challenges',
];

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="9" cy="9" r="9" className="fill-ap-blue/10" />
      <path
        d="M5.5 9l2.5 2.5 4.5-4.5"
        stroke="#185FA5"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

export default function TailoredSoftware() {
  const leftRef = useIntersectionObserver<HTMLDivElement>();
  const rightRef = useIntersectionObserver<HTMLDivElement>();

  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: text */}
          <div ref={leftRef} className="stagger-children flex flex-col">

            {/* Section label */}
            <p className="text-xs font-semibold tracking-widest uppercase text-ap-blue mb-6">
              Faster innovation. Smarter operations. Measurable outcomes.
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-ap-dark mb-6 leading-[1.1] tracking-tight">
              Tailored Software. Real Results.
            </h2>

            <p className="text-lg text-ap-mid leading-relaxed mb-10">
              Whether you&apos;re modernizing legacy systems, building from the ground up, or
              accelerating cloud adoption, we work side-by-side with your teams to engineer
              solutions that move your business forward.
            </p>

            <ul className="flex flex-col gap-4 mb-10">
              {bullets.map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-ap-mid leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/services"
              className="self-start inline-flex items-center gap-2 rounded-full bg-ap-blue text-white font-semibold px-8 py-4 hover:bg-ap-blue/90 transition-colors text-sm md:text-base"
            >
              Let&apos;s Build What Works for You
              <ArrowRight />
            </Link>
          </div>

          {/* Right: autoplay video */}
          <div
            ref={rightRef}
            className="fade-in-up relative w-full aspect-video rounded-2xl overflow-hidden bg-ap-dark"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster="/images/video-poster.jpg"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/people-animation.mp4" type="video/mp4" />
            </video>
          </div>

        </div>
      </div>
    </section>
  );
}
