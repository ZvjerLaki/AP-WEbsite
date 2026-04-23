import Link from 'next/link';
import type { Metadata } from 'next';
import { client } from '@/lib/sanity/client';
import { AP_LAB_PAGE_QUERY } from '@/lib/sanity/queries';
import FAQAccordion, { type FAQItem } from '@/components/sections/FAQAccordion';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Step {
  heading: string;
  body: string;
}

interface ApLabPage {
  heroTagline?: string | null;
  heroSubtitle?: string | null;
  heroCtaText?: string | null;
  heroCtaHref?: string | null;
  problemHeading?: string | null;
  problemBody?: string | null;
  solutionHeading?: string | null;
  solutionBody?: string | null;
  steps?: Step[] | null;
  faqs?: FAQItem[] | null;
}

// ── Static defaults ───────────────────────────────────────────────────────────

const DEFAULTS = {
  heroTagline: 'Kickstart Your Tech Career with AP Lab.',
  heroSubtitle:
    'An immersive programme where students and recent graduates build real software alongside Authority Partners engineers — from day one.',
  heroCtaText: 'Apply Now',
  heroCtaHref: '/contact',
  problemHeading: 'Built for Builders-in-Training.',
  problemBody:
    "AP Lab is a structured 12-week programme that places motivated students and recent graduates on live project teams at Authority Partners. You won't be shadowing or doing busywork — you'll be writing code, reviewing PRs, attending standups, and shipping features that real clients depend on.\n\nEvery participant is paired with a senior engineer mentor, enrolled in weekly skills sessions, and supported through the full software development lifecycle. By the time you graduate from AP Lab, you'll have production experience, a portfolio of real work, and a professional network that spans three continents.",
  solutionHeading: 'How to Apply',
  solutionBody:
    'We evaluate candidates on curiosity, technical foundation, and genuine motivation to build — not just grades or credentials. The process is straightforward and takes two to three weeks from application to decision.',
  steps: [
    {
      heading: 'Submit Your Application',
      body: 'Complete the online application with your CV and a short introduction. Tell us what you want to build and why AP Lab interests you.',
    },
    {
      heading: 'Screening Call',
      body: 'A 30-minute conversation with a member of our talent team to learn about your background, goals, and the programme in more detail.',
    },
    {
      heading: 'Technical Assessment',
      body: 'A short take-home challenge designed to show how you think and solve problems. We care about your approach, not just the answer.',
    },
    {
      heading: 'Engineering Interview',
      body: 'A 45-minute technical and cultural conversation with an engineer from the team you would join. Come with questions — this is your chance to meet us too.',
    },
    {
      heading: 'Offer & Onboarding',
      body: 'Successful candidates receive an offer within one week. We move fast and aim to get you started as soon as you are ready.',
    },
  ] satisfies Step[],
} as const;

const PROGRAMME_HIGHLIGHTS = [
  { label: 'Duration', value: '12 Weeks' },
  { label: 'Level', value: 'Students & Graduates' },
  { label: 'Format', value: 'Full-time, Hybrid' },
  { label: 'Locations', value: 'Irvine · Sarajevo · Istanbul' },
];

// ── ISR ───────────────────────────────────────────────────────────────────────

const FETCH_OPTS = { next: { revalidate: 86400, tags: ['ap-lab'] } };

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'AP Lab — Early-Career Programme | Authority Partners',
  description:
    "Launch your engineering career with AP Lab — Authority Partners' 12-week programme for students and recent graduates. Build real software, learn from senior engineers, and grow fast.",
};

// ── Icon helpers ──────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function APMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="114 -1 54 31" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M131.904 11.9721C130.073 11.9721 128.572 10.4548 128.572 8.60498V3.36716C128.572 1.5173 130.073 0 131.904 0H147.053C148.884 0 151.46 1.05484 152.777 2.34351L162.609 11.9929C163.926 13.2816 165 15.8537 165 17.7036V24.1054C165 25.9552 163.941 26.3969 162.65 25.0875L152.078 14.352C150.787 13.0374 148.226 11.9669 146.395 11.9669H131.909L131.904 11.9721Z" />
      <path d="M150.781 15.9732C152.612 15.9732 154.114 17.4906 154.114 19.3404V24.5782C154.114 26.4281 152.612 27.9454 150.781 27.9454H135.493C133.662 27.9454 131.071 26.9061 129.733 25.6383L119.968 16.337C118.636 15.0691 117.541 12.5126 117.541 10.6627V4.26612C117.541 2.41625 118.616 1.95898 119.927 3.25285L130.438 13.6245C131.749 14.9184 134.321 15.9784 136.156 15.9784H150.776L150.781 15.9732Z" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ApLabPage() {
  const page = await client.fetch<ApLabPage | null>(AP_LAB_PAGE_QUERY, {}, FETCH_OPTS);

  const heroTagline    = page?.heroTagline    ?? DEFAULTS.heroTagline;
  const heroSubtitle   = page?.heroSubtitle   ?? DEFAULTS.heroSubtitle;
  const heroCtaText    = page?.heroCtaText    ?? DEFAULTS.heroCtaText;
  const heroCtaHref    = page?.heroCtaHref    ?? DEFAULTS.heroCtaHref;
  const problemHeading = page?.problemHeading ?? DEFAULTS.problemHeading;
  const problemBody    = page?.problemBody    ?? DEFAULTS.problemBody;
  const solutionHeading = page?.solutionHeading ?? DEFAULTS.solutionHeading;
  const solutionBody   = page?.solutionBody   ?? DEFAULTS.solutionBody;
  const steps          = (page?.steps && page.steps.length > 0) ? page.steps : DEFAULTS.steps;
  const faqs: FAQItem[] = page?.faqs ?? [];

  // Split problemBody on double newline so multi-paragraph defaults render correctly
  const problemParagraphs = problemBody.split('\n\n').filter(Boolean);

  const isExternal = heroCtaHref.startsWith('http');

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-ap-dark overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(15,110,86,0.18) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <APMark
          className="absolute right-[-60px] top-[-40px] w-[480px] h-[480px] text-white pointer-events-none select-none"
          style={{ opacity: 0.04 }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-white/40 mb-8">
            <Link href="/careers" className="hover:text-white/70 transition-colors">Careers</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/60">AP Lab</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-ap-teal/30 bg-ap-teal/10">
            <span className="w-1.5 h-1.5 rounded-full bg-ap-teal flex-shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-widest uppercase text-ap-teal">Early Career Programme</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.08] tracking-tight mb-5">
            {heroTagline}
          </h1>
          <p className="text-lg md:text-xl text-white/65 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            {heroSubtitle}
          </p>

          {/* Programme highlight chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-10" aria-label="Programme highlights">
            {PROGRAMME_HIGHLIGHTS.map((h) => (
              <div
                key={h.label}
                className="inline-flex flex-col items-center px-5 py-2.5 rounded-xl border border-white/10 bg-white/5"
              >
                <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/40 mb-0.5">{h.label}</span>
                <span className="text-sm font-semibold text-white">{h.value}</span>
              </div>
            ))}
          </div>

          {isExternal ? (
            <a
              href={heroCtaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ap-teal text-white font-semibold px-8 py-4 hover:bg-ap-teal/90 transition-colors text-sm md:text-base"
            >
              {heroCtaText}
              <ArrowRight />
            </a>
          ) : (
            <Link
              href={heroCtaHref}
              className="inline-flex items-center gap-2 rounded-full bg-ap-teal text-white font-semibold px-8 py-4 hover:bg-ap-teal/90 transition-colors text-sm md:text-base"
            >
              {heroCtaText}
              <ArrowRight />
            </Link>
          )}
        </div>
      </section>

      {/* ── 2. Programme description ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-ap-border py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ap-teal mb-4">
                About the Programme
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-ap-dark leading-tight tracking-tight mb-6">
                {problemHeading}
              </h2>
              <div className="h-px w-12 bg-ap-teal mb-8" aria-hidden="true" />
              <div className="space-y-5">
                {problemParagraphs.map((para, i) => (
                  <p key={i} className="text-ap-mid leading-relaxed text-base md:text-lg">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* What you'll do cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="12" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="3" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 15.5h7M15.5 12v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                  heading: 'Real Projects',
                  body: 'Ship code to production systems real clients depend on — no shadow projects.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M5 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                  heading: 'Senior Mentorship',
                  body: 'Every participant is paired one-to-one with an experienced AP engineer.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path d="M11 3L3 8v7l8 4 8-4V8l-8-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      <path d="M11 3v11M3 8l8 4 8-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  ),
                  heading: 'Full SDLC',
                  body: 'Requirements, architecture, implementation, testing, and deployment — the whole lifecycle.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path d="M3 17l4-5 4 3 4-6 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17 8h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  heading: 'Career Launchpad',
                  body: 'Leave with production experience, a real portfolio, and a network across three continents.',
                },
              ].map((card) => (
                <div
                  key={card.heading}
                  className="rounded-2xl border border-ap-border bg-ap-surface p-5"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ color: '#0F6E56', backgroundColor: '#0F6E5614' }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-ap-dark text-sm mb-1.5">{card.heading}</h3>
                  <p className="text-xs text-ap-mid leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. How to Apply ──────────────────────────────────────────────────── */}
      <section className="bg-ap-surface border-b border-ap-border py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-ap-teal mb-4 text-center">
              Application Process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ap-dark tracking-tight text-center mb-4">
              {solutionHeading}
            </h2>
            <p className="text-ap-mid leading-relaxed text-center mb-14 text-base md:text-lg">
              {solutionBody}
            </p>

            {/* Steps */}
            <ol className="space-y-6" aria-label="Application steps">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-5">
                  {/* Step number */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#0F6E56' }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 mt-2 bg-ap-border" aria-hidden="true" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`bg-white rounded-2xl border border-ap-border p-5 flex-1 ${i < steps.length - 1 ? 'mb-0' : ''}`}>
                    <h3 className="font-bold text-ap-dark text-base mb-1.5">{step.heading}</h3>
                    <p className="text-sm text-ap-mid leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── 4. FAQs (only if Sanity has data) ────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="bg-white border-b border-ap-border py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ap-dark text-center mb-12 tracking-tight">
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* ── 5. CTA ───────────────────────────────────────────────────────────── */}
      <div className="bg-ap-dark">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-white text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-4 tracking-tight">
            Ready to Launch Your Career?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Applications are reviewed on a rolling basis. Don&apos;t wait — the next cohort fills up fast.
          </p>
          {isExternal ? (
            <a
              href={heroCtaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ap-teal text-white font-semibold px-8 py-3.5 text-sm hover:bg-ap-teal/90 transition-colors"
            >
              {heroCtaText}
              <ArrowRight />
            </a>
          ) : (
            <Link
              href={heroCtaHref}
              className="inline-flex items-center gap-2 rounded-full bg-ap-teal text-white font-semibold px-8 py-3.5 text-sm hover:bg-ap-teal/90 transition-colors"
            >
              {heroCtaText}
              <ArrowRight />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
