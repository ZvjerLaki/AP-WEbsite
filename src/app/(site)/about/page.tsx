import Link from 'next/link';
import type { Metadata } from 'next';
import { client } from '@/lib/sanity/client';
import { ABOUT_PAGE_QUERY, TEAM_MEMBERS_QUERY } from '@/lib/sanity/queries';
import TeamGrid, { type TeamMember } from '@/components/sections/TeamGrid';
import CTAStrip from '@/components/ui/CTAStrip';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CoreValue {
  name: string;
  description: string;
}

interface AboutPage {
  heroTagline?: string | null;
  heroSubtitle?: string | null;
  heroCtaText?: string | null;
  heroCtaHref?: string | null;
  differenceBody?: string | null;
  visionHeading?: string | null;
  visionBody?: string | null;
  missionHeading?: string | null;
  missionBody?: string | null;
  coreValues?: CoreValue[] | null;
}

// ── Static defaults ───────────────────────────────────────────────────────────

const DEFAULT_HERO_TAGLINE = 'Innovation Powered by Partnership.';
const DEFAULT_HERO_SUBTITLE =
  "Born from a passion for technology and partnership, Authority Partners has spent 28+ years helping ambitious organizations engineer what’s next — together.";

const DEFAULT_DIFFERENCE_BODY =
  'We don\'t just deliver software — we deliver outcomes. Authority Partners was built on the belief that the best technology work happens when client and partner are genuinely aligned: shared goals, shared accountability, shared success. Our model brings Fortune 500–grade engineering discipline to organizations of every size, combining global talent with the responsiveness of a dedicated team that cares about your mission.';

const DEFAULT_VISION: CoreValue = {
  name: 'Our Vision',
  description:
    'To be the most trusted technology partner for organizations navigating digital transformation — building software and AI systems that create lasting competitive advantage.',
};

const DEFAULT_MISSION: CoreValue = {
  name: 'Our Mission',
  description:
    'To engineer exceptional software solutions through genuine partnership, delivering innovation that drives real business outcomes and empowers our clients to lead in their industries.',
};

const DEFAULT_CORE_VALUES: CoreValue[] = [
  {
    name: 'Teamwork',
    description:
      'We win together. Collaboration across disciplines, cultures, and geographies is how we consistently deliver beyond expectations.',
  },
  {
    name: 'Integrity',
    description:
      'Honest communication, transparent processes, and accountability to our commitments define every engagement and every relationship.',
  },
  {
    name: 'Growth',
    description:
      "We invest in our people, our clients' businesses, and our collective capabilities — always with a long-term perspective.",
  },
  {
    name: 'Excellence',
    description:
      'High standards aren\'t optional. We hold ourselves to engineering and partnership quality that makes every client proud.',
  },
  {
    name: 'Respect',
    description:
      'Every team member, client, and partner deserves to be treated with dignity, empathy, and genuine consideration.',
  },
];

const WHY_CHOOSE = [
  {
    heading: '28+ Years of Proven Engineering Excellence',
    body: 'Since 1998, we have delivered mission-critical software for some of the most demanding organizations in the world, building institutional knowledge that accelerates every new engagement.',
  },
  {
    heading: '400+ Vetted Consultants Across 13 Time Zones',
    body: 'Our globally distributed talent network means the right skill is always available — without compromising on quality, culture fit, or accountability.',
  },
  {
    heading: 'End-to-End Delivery: Strategy Through Production',
    body: 'From AI strategy and architecture to full-stack engineering and DevOps, we own the entire delivery lifecycle so your teams can stay focused on the business.',
  },
  {
    heading: 'Fortune 500 Clients, Enterprise-Grade Practices',
    body: 'Our security, compliance, and delivery standards are shaped by the most demanding enterprise environments — and applied consistently across every engagement.',
  },
  {
    heading: 'A Partnership Model Built on Shared Accountability',
    body: 'We structure every engagement around shared goals, transparent communication, and mutual ownership of outcomes — so our success is always tied to yours.',
  },
];

const TIMELINE = [
  {
    year: '1998',
    title: 'Founded',
    description:
      'Authority Partners is established in Irvine, California, with a mission to bridge technology and business outcomes through genuine partnership.',
  },
  {
    year: '2005',
    title: 'Enterprise Growth',
    description:
      'Deepened partnerships across Fortune 500 clients in financial services, healthcare, and technology, establishing our reputation for enterprise-grade delivery.',
  },
  {
    year: '2014',
    title: 'Global Scale',
    description:
      'Expanded our globally distributed delivery capabilities, growing to 400+ consultants operating across 13 time zones.',
  },
  {
    year: '2019',
    title: 'Sarajevo Hub',
    description:
      'Opened the Sarajevo Technology Hub, deepening our Eastern European engineering capabilities and connecting world-class talent to global clients.',
  },
  {
    year: '2020',
    title: 'Istanbul Hub',
    description:
      'Launched the Istanbul Technology Hub, further bridging Europe and the broader technology ecosystem with expanded capacity and specialized talent.',
  },
];

const OFFICES = [
  {
    city: 'Irvine, CA',
    role: 'Headquarters',
    detail: 'United States',
    accent: '#185FA5',
  },
  {
    city: 'Sarajevo',
    role: 'Technology Hub',
    detail: 'Bosnia & Herzegovina',
    accent: '#0F6E56',
  },
  {
    city: 'Istanbul',
    role: 'Technology Hub',
    detail: 'Turkey',
    accent: '#534AB7',
  },
];

// ── ISR ───────────────────────────────────────────────────────────────────────

const ABOUT_OPTS = { next: { revalidate: 86400, tags: ['about'] } };
const TEAM_OPTS  = { next: { revalidate: 86400, tags: ['team'] } };

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'About Us | Authority Partners',
  description:
    'Learn about Authority Partners — our story, values, global team, and the partnership model that has driven 28+ years of engineering excellence.',
};

// ── Inline icons ──────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" className="flex-shrink-0 mt-0.5">
      <circle cx="11" cy="11" r="11" fill="#185FA5" fillOpacity="0.1" />
      <path d="M7 11l3 3 5-6" stroke="#185FA5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

// Value icons (one per value, in order)
function IconTeamwork() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 20c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 14c2.21 0 4 1.567 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconIntegrity() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L4 7v5c0 4.418 3.582 8 8 9 4.418-1 8-4.582 8-9V7l-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconGrowth() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17l4-5 4 3 4-6 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconExcellence() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function IconRespect() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21C12 21 4 15.5 4 9.5a4.5 4.5 0 0 1 8-2.83A4.5 4.5 0 0 1 20 9.5C20 15.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

const VALUE_ICONS = [IconTeamwork, IconIntegrity, IconGrowth, IconExcellence, IconRespect];
const VALUE_ACCENTS = ['#185FA5', '#0F6E56', '#534AB7', '#185FA5', '#0F6E56'];

// Why-choose icon
function BulletIcon({ accent }: { accent: string }) {
  return (
    <div
      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${accent}14` }}
    >
      <CheckCircle />
    </div>
  );
}

// ── Office map ────────────────────────────────────────────────────────────────

// Equirectangular projection: x = (lon + 180) * (960/360), y = (90 − lat) * (480/180)
// All coordinates pre-calculated at scale = 2.667 px/degree
function OfficeMap() {
  const pins = [
    { cx: 166, cy: 157, label: 'Irvine, CA',  accent: '#185FA5' },
    { cx: 529, cy: 123, label: 'Sarajevo',    accent: '#0F6E56' },
    { cx: 557, cy: 131, label: 'Istanbul',    accent: '#534AB7' },
  ];

  return (
    <svg
      viewBox="0 0 960 480"
      className="w-full h-auto rounded-2xl"
      aria-label="World map showing office locations in Irvine CA, Sarajevo, and Istanbul"
    >
      {/* Ocean */}
      <rect width="960" height="480" fill="#EEF4FB" rx="16" />

      {/* ── Continents ─────────────────────────────────────────────────────── */}

      {/* North America */}
      <polygon
        points="32,96 149,117 168,152 189,179 240,213 248,184 221,171 267,173 280,147 293,128 320,123 331,101 307,85 280,67 213,45 107,64 67,53"
        fill="#C5D5E8"
        stroke="#B8CCDF"
        strokeWidth="0.8"
      />

      {/* Greenland */}
      <polygon
        points="320,64 333,53 365,45 387,48 392,72 373,80 333,72"
        fill="#C5D5E8"
        stroke="#B8CCDF"
        strokeWidth="0.8"
      />

      {/* South America */}
      <polygon
        points="267,235 315,211 387,261 325,341 299,384 285,355 275,272 267,243"
        fill="#C5D5E8"
        stroke="#B8CCDF"
        strokeWidth="0.8"
      />

      {/* Eurasia (Europe + Russia + Middle East + India + SE Asia as one landmass) */}
      <polygon
        points="456,139 453,101 469,85 507,88 533,51 555,53 853,51 856,115 821,139 805,155 768,187 757,227 720,181 693,219 661,176 640,173 627,208 597,208 565,157 515,155 488,144 467,144"
        fill="#C5D5E8"
        stroke="#B8CCDF"
        strokeWidth="0.8"
      />

      {/* Africa */}
      <polygon
        points="464,144 435,184 435,203 485,227 512,253 512,317 528,331 549,328 573,283 613,208 592,208 565,157 515,155 488,144"
        fill="#C5D5E8"
        stroke="#B8CCDF"
        strokeWidth="0.8"
      />

      {/* Australia */}
      <polygon
        points="795,293 829,272 867,269 883,331 848,333 787,325"
        fill="#C5D5E8"
        stroke="#B8CCDF"
        strokeWidth="0.8"
      />

      {/* ── Pins ───────────────────────────────────────────────────────────── */}
      {pins.map((pin) => (
        <g key={pin.label}>
          <circle cx={pin.cx} cy={pin.cy} r="13" fill={pin.accent} fillOpacity="0.15" />
          <circle cx={pin.cx} cy={pin.cy} r="7"  fill={pin.accent} />
          <circle cx={pin.cx} cy={pin.cy} r="3"  fill="white" />
        </g>
      ))}
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const [page, teamMembers] = await Promise.all([
    client.fetch<AboutPage | null>(ABOUT_PAGE_QUERY, {}, ABOUT_OPTS),
    client.fetch<TeamMember[]>(TEAM_MEMBERS_QUERY, {}, TEAM_OPTS),
  ]);

  const heroTagline    = page?.heroTagline    ?? DEFAULT_HERO_TAGLINE;
  const heroSubtitle   = page?.heroSubtitle   ?? DEFAULT_HERO_SUBTITLE;
  const heroCtaText    = page?.heroCtaText    ?? 'Work With Us';
  const heroCtaHref    = page?.heroCtaHref    ?? '/contact';
  const differenceBody = page?.differenceBody ?? DEFAULT_DIFFERENCE_BODY;
  const visionHeading  = page?.visionHeading  ?? DEFAULT_VISION.name;
  const visionBody     = page?.visionBody     ?? DEFAULT_VISION.description;
  const missionHeading = page?.missionHeading ?? DEFAULT_MISSION.name;
  const missionBody    = page?.missionBody    ?? DEFAULT_MISSION.description;
  const coreValues     = (page?.coreValues && page.coreValues.length > 0)
    ? page.coreValues
    : DEFAULT_CORE_VALUES;

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-ap-dark overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(24,95,165,0.12) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <APMark
          className="absolute right-[-60px] top-[-40px] w-[480px] h-[480px] text-white pointer-events-none select-none"
          style={{ opacity: 0.04 }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/15 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-ap-blue flex-shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/60">About Authority Partners</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.08] tracking-tight mb-6">
            {heroTagline}
          </h1>
          <p className="text-lg md:text-xl text-white/65 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
          <Link
            href={heroCtaHref}
            className="inline-flex items-center gap-2 rounded-full bg-ap-blue text-white font-semibold px-8 py-4 hover:bg-ap-blue/90 transition-colors text-sm md:text-base"
          >
            {heroCtaText}
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ── 2. The Authority Partners Difference ─────────────────────────────── */}
      <section className="bg-ap-surface border-b border-ap-border py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ap-blue mb-4">
                What Sets Us Apart
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-ap-dark leading-tight mb-6 tracking-tight">
                The Authority Partners Difference
              </h2>
              <div className="h-px w-12 bg-ap-blue mb-8" aria-hidden="true" />
              <p className="text-ap-mid leading-relaxed text-base md:text-lg mb-10">
                {differenceBody}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-ap-blue text-white font-semibold px-8 py-3.5 hover:bg-ap-blue/90 transition-colors text-sm"
              >
                Start the Conversation
                <ArrowRight />
              </Link>
            </div>

            {/* Stats column */}
            <div className="grid grid-cols-2 gap-8">
              {[
                { value: '28+', label: 'Years of Experience' },
                { value: '400+', label: 'Expert Consultants' },
                { value: '13', label: 'Time Zones' },
                { value: '500', label: 'Fortune 500 Clients' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-4xl md:text-5xl font-bold text-ap-dark tracking-tight leading-none mb-2">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-ap-mid">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Vision / Mission ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-ap-border py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="rounded-2xl border border-ap-border bg-ap-blue/[0.04] p-8 md:p-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#185FA514' }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="4" stroke="#185FA5" strokeWidth="1.6" />
                  <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M4.93 17.07l1.41-1.41M15.66 6.34l1.41-1.41" stroke="#185FA5" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-ap-dark mb-4">{visionHeading}</h3>
              <p className="text-ap-mid leading-relaxed">{visionBody}</p>
            </div>

            {/* Mission */}
            <div className="rounded-2xl border border-ap-border bg-ap-teal/[0.04] p-8 md:p-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#0F6E5614' }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M11 3L3 8v7l8 4 8-4V8l-8-5Z" stroke="#0F6E56" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M11 3v11M3 8l8 4 8-4" stroke="#0F6E56" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-ap-dark mb-4">{missionHeading}</h3>
              <p className="text-ap-mid leading-relaxed">{missionBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Core Values ───────────────────────────────────────────────────── */}
      <section className="bg-ap-surface border-b border-ap-border py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-ap-blue mb-4">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ap-dark tracking-tight">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {coreValues.slice(0, 5).map((value, i) => {
              const Icon   = VALUE_ICONS[i] ?? VALUE_ICONS[0];
              const accent = VALUE_ACCENTS[i] ?? VALUE_ACCENTS[0];
              return (
                <div
                  key={value.name}
                  className="flex flex-col bg-white rounded-2xl border border-ap-border p-6"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                    style={{ color: accent, backgroundColor: `${accent}14` }}
                  >
                    <Icon />
                  </div>
                  <h3 className="font-bold text-ap-dark text-base mb-2">{value.name}</h3>
                  <p className="text-sm text-ap-mid leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Why Choose Authority Partners ─────────────────────────────────── */}
      <section className="bg-white border-b border-ap-border py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-ap-blue mb-4">
              Why Choose AP
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ap-dark leading-tight tracking-tight max-w-2xl">
              Why Leading Organizations Choose Authority Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {WHY_CHOOSE.map((item) => (
              <div key={item.heading} className="flex gap-4 items-start">
                <BulletIcon accent="#185FA5" />
                <div>
                  <h3 className="font-semibold text-ap-dark text-[1.0625rem] mb-1.5 leading-snug">
                    {item.heading}
                  </h3>
                  <p className="text-ap-mid text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Timeline ──────────────────────────────────────────────────────── */}
      <section className="bg-ap-dark border-b border-white/10 py-20 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-ap-blue mb-4">
              Our Journey
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              28 Years of Engineering Partnership
            </h2>
          </div>

          {/* Desktop: horizontal */}
          <div className="hidden md:block relative">
            {/* Connector line */}
            <div
              className="absolute top-[2.15rem] left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 10%, rgba(255,255,255,0.15) 90%, transparent 100%)' }}
              aria-hidden="true"
            />

            <div className="grid grid-cols-5 gap-4">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="flex flex-col items-center text-center">
                  {/* Dot */}
                  <div className="relative z-10 w-[1.125rem] h-[1.125rem] rounded-full border-2 border-ap-blue bg-ap-dark mb-6 flex-shrink-0">
                    <span
                      className="absolute inset-[3px] rounded-full bg-ap-blue"
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-2xl font-bold text-white mb-2">{item.year}</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-ap-blue mb-3">
                    {item.title}
                  </span>
                  <p className="text-white/50 text-xs leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden flex flex-col gap-8">
            {TIMELINE.map((item) => (
              <div key={item.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-ap-blue bg-ap-dark flex-shrink-0 mt-1 relative">
                    <span className="absolute inset-[2px] rounded-full bg-ap-blue" aria-hidden="true" />
                  </div>
                  <div className="w-px flex-1 mt-2 bg-white/10" aria-hidden="true" />
                </div>
                <div className="pb-2">
                  <span className="text-xl font-bold text-white">{item.year}</span>
                  <span className="ml-3 text-xs font-semibold uppercase tracking-widest text-ap-blue">
                    {item.title}
                  </span>
                  <p className="text-white/50 text-sm leading-relaxed mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Office Locations Map ───────────────────────────────────────────── */}
      <section className="bg-white border-b border-ap-border py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-ap-blue mb-4">
              Global Presence
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ap-dark tracking-tight">
              Where We Work
            </h2>
          </div>

          <div className="mb-10">
            <OfficeMap />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {OFFICES.map((office) => (
              <div
                key={office.city}
                className="flex items-start gap-4 rounded-2xl border border-ap-border p-6"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${office.accent}14` }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M9 1.5C6.51 1.5 4.5 3.51 4.5 6c0 3.375 4.5 10.5 4.5 10.5S13.5 9.375 13.5 6c0-2.49-2.01-4.5-4.5-4.5Z"
                      stroke={office.accent}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <circle cx="9" cy="6" r="1.5" fill={office.accent} />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-ap-dark text-base">{office.city}</p>
                  <p className="text-sm font-semibold" style={{ color: office.accent }}>
                    {office.role}
                  </p>
                  <p className="text-xs text-ap-light mt-0.5">{office.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Management Team ───────────────────────────────────────────────── */}
      {teamMembers.length > 0 && (
        <section className="bg-ap-surface border-b border-ap-border py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-ap-blue mb-4">
                Leadership
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-ap-dark tracking-tight">
                Meet the Team
              </h2>
            </div>

            <TeamGrid members={teamMembers} />
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <CTAStrip
        heading="Ready to Build Something Extraordinary?"
        buttonText="Start the Conversation"
        buttonHref="/contact"
      />
    </>
  );
}
