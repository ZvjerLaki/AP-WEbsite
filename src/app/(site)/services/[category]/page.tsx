import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity/client';
import {
  CATEGORY_PAGE_QUERY,
  CATEGORY_SERVICES_QUERY,
  CATEGORY_INSIGHTS_QUERY,
} from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import FAQAccordion, { type FAQItem } from '@/components/sections/FAQAccordion';
import CTAStrip from '@/components/ui/CTAStrip';

// ── Types ────────────────────────────────────────────────────────────────────

type CategorySlug = 'innovate' | 'build' | 'refresh' | 'accelerate';

interface PageData {
  heroTagline?: string | null;
  heroSubtitle?: string | null;
  heroCtaText?: string | null;
  heroCtaHref?: string | null;
  problemHeading?: string | null;
  problemBody?: string | null;
  solutionHeading?: string | null;
  solutionBody?: string | null;
  solutionImage?: { asset: { _ref: string }; alt?: string } | null;
  faqs?: FAQItem[] | null;
}

interface ServiceCard {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription?: string;
}

interface InsightCard {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string | null;
  category: string | null;
  excerpt?: string | null;
  heroImage?: { asset: { _ref: string }; alt?: string };
}

// ── Static defaults per category ─────────────────────────────────────────────

const DEFAULTS: Record<CategorySlug, {
  label: string;
  accent: string;
  heroTagline: string;
  heroSubtitle: string;
  heroCtaText: string;
  problemHeading: string;
  problemBody: string;
  solutionHeading: string;
  solutionBody: string;
}> = {
  innovate: {
    label: 'Innovate',
    accent: '#534AB7',
    heroTagline: "Let's Build the Future Together",
    heroSubtitle:
      'From AI strategy to workforce upskilling, we engineer innovation at scale — not just proof of concepts.',
    heroCtaText: 'Talk to an AI Strategist',
    problemHeading: "Everyone's chasing innovation but few can engineer it at scale.",
    problemBody:
      'The gap between AI experimentation and production value is wide. Most teams lack the frameworks, talent, and institutional knowledge to cross it sustainably.',
    solutionHeading: 'AI That Performs. Innovation That Lasts.',
    solutionBody:
      'We combine strategic advisory with hands-on engineering — so your AI investments create compounding value, not technical debt.',
  },
  build: {
    label: 'Build',
    accent: '#185FA5',
    heroTagline: 'From Blueprint to Production.',
    heroSubtitle:
      'We engineer software and AI systems built for the real world — reliable, scalable, and ready to grow.',
    heroCtaText: 'Start Your Build',
    problemHeading: "Great ideas stall when engineering can't keep pace with ambition.",
    problemBody:
      'Disconnected teams, shifting requirements, and technical shortcuts accumulate into systems that slow you down instead of moving you forward.',
    solutionHeading: 'Engineering That Scales With You.',
    solutionBody:
      'Disciplined delivery from day one. We build systems that hold up under pressure, adapt to change, and give your team a codebase they can be proud of.',
  },
  refresh: {
    label: 'Refresh',
    accent: '#0F6E56',
    heroTagline: 'Modernize Without the Risk.',
    heroSubtitle:
      'We transform legacy systems, infrastructure, and codebases — without disrupting the business that depends on them.',
    heroCtaText: 'Plan Your Modernization',
    problemHeading: 'Legacy systems are expensive to maintain and impossible to move fast with.',
    problemBody:
      'Aging infrastructure creates compounding risk: security gaps, slow delivery cycles, and talent drain. Waiting to modernize only raises the cost.',
    solutionHeading: "Modernization That Doesn't Break What Works.",
    solutionBody:
      'Incremental, low-risk transformation strategies that preserve business continuity while unlocking the speed, security, and flexibility of modern platforms.',
  },
  accelerate: {
    label: 'Accelerate',
    accent: '#1A1A1A',
    heroTagline: 'Scale on Your Terms.',
    heroSubtitle:
      'Flexible talent and delivery models designed to move faster, reach further, and stay aligned with your roadmap.',
    heroCtaText: 'Explore Talent Options',
    problemHeading: "Scaling fast shouldn't mean sacrificing quality or control.",
    problemBody:
      'Hiring cycles are long, offshore models misalign incentives, and staff augmentation without structure creates coordination overhead rather than output.',
    solutionHeading: 'The Right Talent, Embedded in Your Process.',
    solutionBody:
      'Outcome-aligned teams that integrate with your workflows, ship to your standards, and scale up or down as your roadmap demands.',
  },
};

const VALID_CATEGORIES = new Set(Object.keys(DEFAULTS));

// ── Route config ─────────────────────────────────────────────────────────────

export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(DEFAULTS) as CategorySlug[]).map((category) => ({ category }));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
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

// ── Page ──────────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ category: string }> };

export default async function ServiceCategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.has(category)) notFound();

  const slug = category as CategorySlug;
  const def = DEFAULTS[slug];

  const [pageData, services, insights] = await Promise.all([
    client.fetch<PageData | null>(
      CATEGORY_PAGE_QUERY,
      { category: slug },
      { next: { revalidate: 3600, tags: ['services'] } },
    ),
    client.fetch<ServiceCard[]>(
      CATEGORY_SERVICES_QUERY,
      { category: slug },
      { next: { revalidate: 3600, tags: ['services'] } },
    ),
    client.fetch<InsightCard[]>(
      CATEGORY_INSIGHTS_QUERY,
      {},
      { next: { revalidate: 3600, tags: ['insights'] } },
    ),
  ]);

  // Merge Sanity data over static defaults
  const heroTagline    = pageData?.heroTagline    ?? def.heroTagline;
  const heroSubtitle   = pageData?.heroSubtitle   ?? def.heroSubtitle;
  const heroCtaText    = pageData?.heroCtaText    ?? def.heroCtaText;
  const heroCtaHref    = pageData?.heroCtaHref    ?? '/contact';
  const problemHeading = pageData?.problemHeading ?? def.problemHeading;
  const problemBody    = pageData?.problemBody    ?? def.problemBody;
  const solutionHeading = pageData?.solutionHeading ?? def.solutionHeading;
  const solutionBody   = pageData?.solutionBody   ?? def.solutionBody;
  const faqs: FAQItem[] = pageData?.faqs ?? [];

  const solutionImageUrl = pageData?.solutionImage
    ? urlFor(pageData.solutionImage).width(800).height(600).url()
    : null;

  const accentRgb = def.accent;

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-ap-border overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: accentRgb }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Category pill */}
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase"
            style={{
              borderColor: `${accentRgb}33`,
              color: accentRgb,
              backgroundColor: `${accentRgb}0f`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: accentRgb }}
              aria-hidden="true"
            />
            {def.label}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3rem] font-bold text-ap-dark leading-[1.08] tracking-tight mb-6 max-w-3xl">
            {heroTagline}
          </h1>
          <p className="text-lg md:text-xl text-ap-mid leading-relaxed max-w-2xl mb-10">
            {heroSubtitle}
          </p>
          <Link
            href={heroCtaHref}
            className="inline-flex items-center gap-2 rounded-full text-white font-semibold px-8 py-3.5 text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: accentRgb }}
          >
            {heroCtaText}
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ── 2. Problem / Solution ────────────────────────────────────────── */}
      <section className="bg-ap-surface py-20 md:py-28 border-b border-ap-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <p
                className="text-base font-semibold mb-4 tracking-wide"
                style={{ color: accentRgb }}
              >
                The Challenge
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-ap-mid leading-snug mb-8">
                {problemHeading}
              </h2>
              <div
                className="h-px w-12 mb-8"
                style={{ backgroundColor: accentRgb }}
                aria-hidden="true"
              />
              <h3 className="text-2xl md:text-3xl font-bold text-ap-dark leading-snug mb-5">
                {solutionHeading}
              </h3>
              <p className="text-ap-mid leading-relaxed text-base md:text-lg">
                {solutionBody}
              </p>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-ap-border">
              {solutionImageUrl ? (
                <Image
                  src={solutionImageUrl}
                  alt={pageData?.solutionImage?.alt ?? solutionHeading}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse 80% 70% at 40% 50%, ${accentRgb}26 0%, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Services Grid ─────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 border-b border-ap-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ap-dark leading-tight mb-3">
              {def.label} Services
            </h2>
            <p className="text-ap-mid text-lg">{def.heroSubtitle}</p>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((service) => (
                <article
                  key={service._id}
                  className="group flex flex-col bg-white border border-ap-border rounded-2xl p-6 hover:shadow-md transition-all duration-300"
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
                    href={`/services/${slug}/${service.slug.current}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold
                      group-hover:gap-3 transition-all duration-200"
                    style={{ color: accentRgb }}
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

      {/* ── 4. FAQ ───────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="bg-ap-surface py-20 md:py-28 border-b border-ap-border">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ap-dark mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* ── 5. Insights Strip ────────────────────────────────────────────── */}
      {insights.length > 0 && (
        <section className="bg-ap-dark py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                Related Insights
              </h2>
              <p className="text-white/60 text-lg">
                Thinking and research to help you go further.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {insights.map((post) => {
                const imageUrl = post.heroImage
                  ? urlFor(post.heroImage).width(640).height(400).url()
                  : null;
                return (
                  <article
                    key={post._id}
                    className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors duration-300"
                  >
                    <div className="relative w-full aspect-[8/5] bg-white/5 flex-shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={post.heroImage?.alt ?? post.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(24,95,165,0.3) 0%, transparent 70%)',
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt} className="text-xs font-medium text-white/40 mb-3">
                          {formatDate(post.publishedAt)}
                        </time>
                      )}
                      <h3 className="font-semibold text-white leading-snug mb-4 flex-1">
                        {post.title}
                      </h3>
                      <Link
                        href={`/insights/${post.slug.current}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-ap-blue group-hover:opacity-75 transition-opacity"
                      >
                        Read More
                        <ArrowRight />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="text-center">
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white font-semibold px-8 py-4 hover:border-white/50 hover:bg-white/5 transition-colors text-sm"
              >
                View All Insights
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTAStrip />
    </>
  );
}
