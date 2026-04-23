import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { PortableTextBlock } from 'sanity';
import { client } from '@/lib/sanity/client';
import {
  STORIES_ALL_SLUGS_QUERY,
  STORY_PAGE_QUERY,
  RELATED_STORIES_QUERY,
} from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import PortableText from '@/components/portable-text/PortableText';
import CTAStrip from '@/components/ui/CTAStrip';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Story {
  _id: string;
  title: string;
  slug: { current: string };
  client: string | null;
  industry: string | null;
  heroImage?: { asset: { _ref: string }; alt?: string } | null;
  challenge?: string | null;
  solution?: string | null;
  results?: string[] | null;
  technologies?: string[] | null;
  body?: PortableTextBlock[];
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null;
}

interface RelatedStory {
  _id: string;
  title: string;
  slug: { current: string };
  heroImage?: { asset: { _ref: string }; alt?: string } | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const FETCH_OPTS = { next: { revalidate: 3600, tags: ['stories'] } } as const;

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
      <circle cx="9" cy="9" r="9" fill="#185FA5" fillOpacity="0.1" />
      <path
        d="M5.5 9l2.5 2.5 4.5-5"
        stroke="#185FA5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Static generation ─────────────────────────────────────────────────────────

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(STORIES_ALL_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await client.fetch<Story | null>(STORY_PAGE_QUERY, { slug }, FETCH_OPTS);
  if (!story) return {};

  const title = story.seo?.metaTitle ?? story.title;
  const description =
    story.seo?.metaDescription ??
    (story.challenge ? story.challenge.slice(0, 160) : undefined);
  const ogImageUrl = story.heroImage
    ? urlFor(story.heroImage).width(1200).height(630).fit('crop').url()
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: story.title }],
      }),
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;

  const story = await client.fetch<Story | null>(STORY_PAGE_QUERY, { slug }, FETCH_OPTS);
  if (!story) notFound();

  const relatedStories = await client.fetch<RelatedStory[]>(
    RELATED_STORIES_QUERY,
    { slug },
    FETCH_OPTS,
  );

  const heroImageUrl = story.heroImage
    ? urlFor(story.heroImage).width(1400).height(630).fit('crop').auto('format').url()
    : null;

  const hasResults = story.results && story.results.length > 0;
  const hasTechnologies = story.technologies && story.technologies.length > 0;
  const hasBody = story.body && story.body.length > 0;

  return (
    <>
      {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
      <article>
        {/* Full-width cover image */}
        {heroImageUrl && (
          <div className="relative w-full h-[280px] md:h-[420px] lg:h-[480px] bg-ap-dark overflow-hidden">
            <Image
              src={heroImageUrl}
              alt={story.heroImage?.alt ?? story.title}
              fill
              priority
              className="object-cover opacity-90"
              sizes="100vw"
            />
          </div>
        )}

        {/* Title block */}
        <div className="bg-white border-b border-ap-border">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-10 pb-10">
            {story.industry && (
              <span className="inline-block mb-5 text-[0.7rem] font-semibold uppercase tracking-widest text-ap-blue bg-ap-blue-light px-3 py-1 rounded-full">
                {story.industry}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-[2.625rem] font-bold text-ap-dark leading-[1.1] tracking-tight mb-4">
              {story.title}
            </h1>
            {story.client && (
              <p className="text-sm text-ap-light">
                <span className="font-medium text-ap-mid">Client:</span>{' '}
                {story.client}
              </p>
            )}
          </div>
        </div>

        {/* ── 2 & 3. Challenge & Solution ──────────────────────────────────── */}
        {(story.challenge || story.solution) && (
          <section className="bg-ap-surface border-b border-ap-border py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {story.challenge && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ap-blue mb-4">
                      The Challenge
                    </p>
                    <p className="text-ap-mid leading-relaxed text-base md:text-lg">
                      {story.challenge}
                    </p>
                  </div>
                )}
                {story.solution && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ap-teal mb-4">
                      The Solution
                    </p>
                    <p className="text-ap-mid leading-relaxed text-base md:text-lg">
                      {story.solution}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── 4 & 5. Results & Technologies ────────────────────────────────── */}
        {(hasResults || hasTechnologies) && (
          <section className="bg-white border-b border-ap-border py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Results */}
                {hasResults && (
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-ap-dark mb-7">
                      Key Outcomes
                    </h2>
                    <ul className="space-y-4">
                      {story.results!.map((result, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckIcon />
                          <span className="text-ap-mid text-base md:text-lg leading-relaxed">
                            {result}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {hasTechnologies && (
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-ap-dark mb-7">
                      Technologies Used
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {story.technologies!.map((tech, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-4 py-1.5 rounded-full border border-ap-border bg-ap-surface text-sm font-medium text-ap-dark"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── 6. Body ──────────────────────────────────────────────────────── */}
        {hasBody && (
          <section className="bg-white border-b border-ap-border py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
              <PortableText value={story.body!} />
            </div>
          </section>
        )}
      </article>

      {/* ── 7. Related Stories ─────────────────────────────────────────────── */}
      {relatedStories.length > 0 && (
        <section className="bg-ap-surface border-b border-ap-border py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-ap-dark leading-tight">
                More Success Stories
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedStories.map((related) => {
                const relImageUrl = related.heroImage
                  ? urlFor(related.heroImage).width(640).height(400).url()
                  : null;

                return (
                  <article
                    key={related._id}
                    className="group flex flex-col bg-white border border-ap-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative w-full aspect-[3/2] bg-ap-surface flex-shrink-0">
                      {relImageUrl ? (
                        <Image
                          src={relImageUrl}
                          alt={related.heroImage?.alt ?? related.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(24,95,165,0.12) 0%, transparent 70%), linear-gradient(135deg, #f7f7f5 0%, #ebebea 100%)',
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="font-semibold text-ap-dark leading-snug mb-4 flex-1 text-[1.0625rem]">
                        {related.title}
                      </h3>
                      <Link
                        href={`/stories/${related.slug.current}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-ap-blue group-hover:gap-3 transition-all duration-200"
                      >
                        Read Case Study
                        <ArrowRight />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. CTA Strip ───────────────────────────────────────────────────── */}
      <CTAStrip />
    </>
  );
}
