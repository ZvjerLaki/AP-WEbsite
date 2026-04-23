'use client';

import { useIntersectionObserver } from '@/lib/useIntersectionObserver';
import PopupTriggerButton from '@/components/ui/PopupTriggerButton';

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

function APMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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

export default function AgenticAI() {
  const gridRef = useIntersectionObserver<HTMLDivElement>();

  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={gridRef}
          className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Left: text */}
          <div className="flex flex-col">
            <div className="inline-flex self-start items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-ap-blue/20 bg-ap-blue-light">
              <span
                className="w-1.5 h-1.5 rounded-full bg-ap-blue animate-pulse flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold tracking-widest uppercase text-ap-blue">
                Live Architecture &amp; Code Walkthrough
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-ap-dark mb-6 leading-[1.1] tracking-tight">
              Agentic AI: Engineered for Impact.
            </h2>

            <p className="text-lg text-ap-mid leading-relaxed mb-5">
              Our Agentic AI as a Service empowers enterprises to automate workflows, accelerate
              decisions and turn scattered, unstructured and siloed data into a strategic advantage.
            </p>

            <p className="text-lg text-ap-mid leading-relaxed mb-10">
              Our custom-built AI solutions are crafted around your organization&apos;s DNA —
              including your language, your knowledge and your processes. The results are intuitive
              systems your teams want to use. We will help you validate an impactful use case with
              user journeys, working prototypes and measurable outcomes.
            </p>

            <PopupTriggerButton className="self-start inline-flex items-center gap-2 rounded-full bg-ap-blue text-white font-semibold px-8 py-4 hover:bg-ap-blue/90 transition-colors text-sm md:text-base">
              Talk to an AI Strategist
              <ArrowRight />
            </PopupTriggerButton>
          </div>

          {/* Right: image */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-ap-dark">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(24,95,165,0.28) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden="true"
            >
              <APMark className="w-[340px] h-[340px] text-white opacity-[0.055]" />
            </div>
            <div className="absolute inset-0 flex items-end p-8">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 max-w-xs">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
                  Agentic AI as a Service
                </p>
                <p className="text-white font-semibold text-lg leading-tight">
                  Built around your organization&apos;s DNA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
