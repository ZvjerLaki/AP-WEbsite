import Link from 'next/link';
import type { Metadata } from 'next';
import InsightsGrid from '@/components/sections/InsightsGrid';

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Careers | Authority Partners',
  description:
    'Join the team that engineers excellence. Explore open roles, career paths, and what it means to build what\'s next at Authority Partners.',
};

// ── Static data ───────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    title: 'Career Paths',
    description:
      "We're built for builders. AP offers structured growth across software engineering, AI/ML, cloud, and technical leadership — with mentorship, certifications, and real-world projects that accelerate every career.",
    accent: '#185FA5',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 17V13a7 7 0 0 1 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 17v-4a7 7 0 0 0-7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Growing Opportunities',
    description:
      'Our project pipeline spans Fortune 500 enterprises to ambitious scale-ups. Every engagement brings new technologies, new challenges, and genuine opportunities to shape outcomes that matter.',
    accent: '#0F6E56',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 17l4-5 4 3 4-6 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 8h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Benefits',
    description:
      'Competitive compensation. Comprehensive health coverage. Flexible remote and hybrid work. Generous PTO, 401(k) matching, and continued education support — because great work starts with being taken care of.',
    accent: '#534AB7',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21C12 21 4 15.5 4 9.5a4.5 4.5 0 0 1 8-2.83A4.5 4.5 0 0 1 20 9.5C20 15.5 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Fun Activities',
    description:
      'Hackathons, lunch-and-learns, team offsites, and a culture that celebrates every win — big and small. At AP, the people you build with are some of the best you will ever meet.',
    accent: '#185FA5',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2l1.8 5.4H19l-4.5 3.3 1.7 5.3L12 13l-4.2 3 1.7-5.3L5 7.4h5.2L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// ── Icon helpers ──────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

export default function CareersPage() {
  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-ap-dark overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(24,95,165,0.14) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <APMark
          className="absolute right-[-60px] top-[-40px] w-[480px] h-[480px] text-white pointer-events-none select-none"
          style={{ opacity: 0.04 }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/15 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-ap-blue flex-shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/60">Careers at Authority Partners</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.08] tracking-tight mb-5">
            Build What&apos;s Next With Us.
          </h1>
          <p className="text-lg md:text-xl text-white/65 font-light leading-relaxed mb-10 max-w-xl mx-auto">
            Join the Team That Engineers Excellence.
          </p>

          <a
            href="#discover-jobs"
            className="inline-flex items-center gap-2 rounded-full bg-ap-blue text-white font-semibold px-8 py-4 hover:bg-ap-blue/90 transition-colors text-sm md:text-base"
          >
            Shape the Future. Start Here.
            <ArrowDown />
          </a>
        </div>
      </section>

      {/* ── 2. Benefits ──────────────────────────────────────────────────────── */}
      <section className="bg-ap-surface border-b border-ap-border py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-ap-blue mb-4">
              Life at AP
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ap-dark tracking-tight">
              More Than a Job. A Career That Moves You.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex flex-col bg-white rounded-2xl border border-ap-border p-6 md:p-7"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                  style={{ color: benefit.accent, backgroundColor: `${benefit.accent}14` }}
                >
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-ap-dark text-base mb-2">{benefit.title}</h3>
                <p className="text-sm text-ap-mid leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. AP Lab ────────────────────────────────────────────────────────── */}
      <section className="relative bg-ap-dark border-b border-white/10 overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(15,110,86,0.18) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <APMark
          className="absolute right-[-40px] bottom-[-40px] w-[420px] h-[420px] text-white pointer-events-none select-none"
          style={{ opacity: 0.035 }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-ap-teal/30 bg-ap-teal/10">
              <span className="w-1.5 h-1.5 rounded-full bg-ap-teal flex-shrink-0" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-widest uppercase text-ap-teal">
                Early Career Program
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1] tracking-tight mb-6">
              Kickstart Your Tech Career with AP Lab.
            </h2>

            <p className="text-lg text-white/65 leading-relaxed mb-10">
              AP Lab is our dedicated early-career program — purpose-built for students and recent
              graduates who are ready to learn by building. You will work alongside experienced
              engineers on real projects, develop skills that matter in the market, and launch a
              career with one of the industry&apos;s most respected technology partnerships.
            </p>

            <Link
              href="/careers/ap-lab"
              className="inline-flex items-center gap-2 rounded-full bg-ap-teal text-white font-semibold px-8 py-4 hover:bg-ap-teal/90 transition-colors text-sm md:text-base"
            >
              Explore AP Lab
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Job listings (CATS widget placeholder) ────────────────────────── */}
      <section className="bg-white border-b border-ap-border">
        <div id="discover-jobs" className="py-16 text-center scroll-mt-[72px]">
          <p>Job listings — CATS widget placeholder</p>
          <p className="text-sm text-gray-400">
            Embed code: CATSone portal → Settings → Integrations
          </p>
        </div>
      </section>

      {/* ── 5. No Match Today? ───────────────────────────────────────────────── */}
      <section className="bg-ap-surface border-b border-ap-border py-20 md:py-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-ap-dark mb-4 tracking-tight">
            No Match Today?
          </h2>
          <p className="text-ap-mid leading-relaxed mb-8">
            Open positions change constantly. Register your profile and we&apos;ll reach out the
            moment a role matches your skills and ambitions.
          </p>
          <a
            href="https://authoritypartnersinc.catsone.com/careers/86212-General/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ap-blue text-white font-semibold px-8 py-3.5 hover:bg-ap-blue/90 transition-colors text-sm"
          >
            Stay in the Loop
            <ArrowRight />
          </a>
        </div>
      </section>

      {/* ── 6. Insights strip ────────────────────────────────────────────────── */}
      <InsightsGrid />
    </>
  );
}
