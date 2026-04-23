import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'sanity';
import { client } from '@/lib/sanity/client';
import {
  SERVICE_META_QUERY,
  SERVICE_PAGE_QUERY,
  RELATED_SERVICES_QUERY,
} from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import ServiceBody from '@/components/portable-text/ServiceBody';
import FAQAccordion, { type FAQItem } from '@/components/sections/FAQAccordion';
import CTAStrip from '@/components/ui/CTAStrip';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ServiceDoc {
  title: string;
  slug: { current: string };
  category: string;
  shortDescription?: string;
  heroTagline?: string;
  ctaText?: string;
  icon?: { asset: { _ref: string }; alt?: string };
  longDescription?: PortableTextBlock[];
  faqs?: FAQItem[];
}

interface RelatedService {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription?: string;
}

// ── Static route manifest ─────────────────────────────────────────────────────

const ALL_SERVICES = [
  { category: 'innovate', service: 'ai-academy' },
  { category: 'innovate', service: 'agentic-ai-assessment' },
  { category: 'innovate', service: 'agentic-ai-innovation' },
  { category: 'innovate', service: 'productivity-acceleration' },
  { category: 'innovate', service: 'product-discovery' },
  { category: 'build',    service: 'agentic-ai-production' },
  { category: 'build',    service: 'product-planning-workshop' },
  { category: 'build',    service: 'software-engineering' },
  { category: 'build',    service: 'qa-and-automation' },
  { category: 'refresh',  service: 'cloud-native-migration' },
  { category: 'refresh',  service: 'codebase-refresh' },
  { category: 'refresh',  service: 'microservices-transformation' },
  { category: 'refresh',  service: 'encompass-epc-migration' },
  { category: 'accelerate', service: 'staff-augmentation' },
  { category: 'accelerate', service: 'dedicated-nearshore-team' },
  { category: 'accelerate', service: 'managed-delivery-pod' },
  { category: 'accelerate', service: 'client-aligned-delivery-center' },
];

const CATEGORY_META: Record<string, { label: string; accent: string }> = {
  innovate:   { label: 'Innovate',   accent: '#534AB7' },
  build:      { label: 'Build',      accent: '#185FA5' },
  refresh:    { label: 'Refresh',    accent: '#0F6E56' },
  accelerate: { label: 'Accelerate', accent: '#1A1A1A' },
};

// ── Route config ──────────────────────────────────────────────────────────────

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_SERVICES;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ category: string; service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, service } = await params;
  const data = await client.fetch<{ title: string; shortDescription?: string } | null>(
    SERVICE_META_QUERY,
    { slug: service, category },
    { next: { revalidate: 3600, tags: ['services'] } },
  );
  return {
    title: data?.title ?? 'Service',
    description: data?.shortDescription ?? undefined,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ServicePage({ params }: Props) {
  const { category, service } = await params;

  const [serviceDoc, related] = await Promise.all([
    client.fetch<ServiceDoc | null>(
      SERVICE_PAGE_QUERY,
      { slug: service, category },
      { next: { revalidate: 3600, tags: ['services'] } },
    ),
    client.fetch<RelatedService[]>(
      RELATED_SERVICES_QUERY,
      { slug: service, category },
      { next: { revalidate: 3600, tags: ['services'] } },
    ),
  ]);

  if (!serviceDoc) notFound();

  const cat = CATEGORY_META[category] ?? { label: category, accent: '#185FA5' };
  const accent = cat.accent;

  const heading = serviceDoc.heroTagline ?? serviceDoc.title;
  const ctaText = serviceDoc.ctaText ?? "Let's Talk";
  const faqs: FAQItem[] = serviceDoc.faqs ?? [];

  const iconUrl = serviceDoc.icon
    ? urlFor(serviceDoc.icon).width(600).height(600).url()
    : null;

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-ap-border overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ap-light mb-8 flex-wrap">
            <Link href="/services" className="hover:text-ap-mid transition-colors">Services</Link>
            <ChevronRight />
            <Link
              href={`/services/${category}`}
              className="hover:text-ap-mid transition-colors"
            >
              {cat.label}
            </Link>
            <ChevronRight />
            <span className="text-ap-mid">{serviceDoc.title}</span>
          </nav>

          {/* Category pill */}
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase"
            style={{
              borderColor: `${accent}33`,
              color: accent,
              backgroundColor: `${accent}0f`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
            {cat.label}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3rem] font-bold text-ap-dark leading-[1.08] tracking-tight mb-5 max-w-3xl">
            {heading}
          </h1>

          {serviceDoc.shortDescription && (
            <p className="text-lg md:text-xl text-ap-mid leading-relaxed max-w-2xl">
              {serviceDoc.shortDescription}
            </p>
          )}
        </div>
      </section>

      {/* ── 2. Body + Sidebar ────────────────────────────────────────────── */}
      <section className="bg-white pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* Prose */}
            <div className="lg:col-span-2">
              {serviceDoc.longDescription?.length ? (
                <ServiceBody value={serviceDoc.longDescription} />
              ) : (
                <p className="text-ap-mid text-lg leading-relaxed">
                  Full service details coming soon.
                </p>
              )}
            </div>

            {/* Sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 flex flex-col gap-6">

                {/* Icon */}
                {iconUrl && (
                  <div className="w-full aspect-square rounded-2xl overflow-hidden border border-ap-border bg-ap-surface">
                    <Image
                      src={iconUrl}
                      alt={serviceDoc.icon?.alt ?? serviceDoc.title}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* CTA card */}
                <div className="rounded-2xl border border-ap-border bg-ap-surface p-6">
                  <p className="font-bold text-ap-dark text-base mb-2">
                    Ready to get started?
                  </p>
                  <p className="text-ap-mid text-sm leading-relaxed mb-5">
                    Talk to our team about how this service fits your goals.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full text-white font-semibold px-6 py-3 text-sm hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: accent }}
                  >
                    {ctaText}
                    <ArrowRight />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. FAQ ───────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="bg-ap-surface py-20 md:py-28 border-t border-ap-border">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ap-dark mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* ── 4. Related Services ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-white py-20 md:py-28 border-t border-ap-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ap-dark mb-8">
              More {cat.label} Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((rel) => (
                <article
                  key={rel._id}
                  className="group flex flex-col bg-white border border-ap-border rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-semibold text-ap-dark text-[1.0625rem] leading-snug mb-3 flex-1">
                    {rel.title}
                  </h3>
                  {rel.shortDescription && (
                    <p className="text-ap-mid text-sm leading-relaxed mb-6 line-clamp-3">
                      {rel.shortDescription}
                    </p>
                  )}
                  <Link
                    href={`/services/${category}/${rel.slug.current}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-200"
                    style={{ color: accent }}
                  >
                    Explore
                    <ArrowRight />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. CTA Strip ─────────────────────────────────────────────────── */}
      <CTAStrip />
    </>
  );
}
