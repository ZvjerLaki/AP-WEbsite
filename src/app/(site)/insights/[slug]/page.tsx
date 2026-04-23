import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { PortableTextBlock } from 'sanity';
import { client } from '@/lib/sanity/client';
import {
  INSIGHTS_ALL_SLUGS_QUERY,
  POST_PAGE_QUERY,
  RELATED_INSIGHTS_QUERY,
} from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import PortableText from '@/components/portable-text/PortableText';
import InsightShareButton from '@/components/ui/InsightShareButton';
import CTAStrip from '@/components/ui/CTAStrip';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string | null;
  category: 'article' | 'webinar' | 'guide' | null;
  author: string | null;
  heroImage?: { asset: { _ref: string }; alt?: string } | null;
  excerpt?: string | null;
  body?: PortableTextBlock[];
  videoUrl?: string | null;
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null;
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string | null;
  category: 'article' | 'webinar' | 'guide' | null;
  heroImage?: { asset: { _ref: string }; alt?: string } | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────


const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  article: { label: 'Article', color: '#185FA5' },
  webinar: { label: 'Webinar', color: '#0F6E56' },
  guide:   { label: 'Guide',   color: '#534AB7' },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
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

// ── Static generation ─────────────────────────────────────────────────────────

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(INSIGHTS_ALL_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(POST_PAGE_QUERY, { slug }, { next: { revalidate: 3600, tags: ['insights'] } });
  if (!post) return {};

  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? post.excerpt ?? undefined;
  const ogImageUrl = post.heroImage
    ? urlFor(post.heroImage).width(1200).height(630).fit('crop').url()
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
      }),
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;

  const post = await client.fetch<Post | null>(POST_PAGE_QUERY, { slug }, { next: { revalidate: 3600, tags: ['insights'] } });
  if (!post) notFound();

  const relatedPosts = post.category
    ? await client.fetch<RelatedPost[]>(
        RELATED_INSIGHTS_QUERY,
        { category: post.category, slug },
        { next: { revalidate: 3600, tags: ['insights'] } },
      )
    : [];

  const heroImageUrl = post.heroImage
    ? urlFor(post.heroImage).width(1400).height(630).fit('crop').auto('format').url()
    : null;

  const cat = post.category ? CATEGORY_CONFIG[post.category] : null;
  const videoId =
    post.category === 'webinar' && post.videoUrl
      ? extractYouTubeId(post.videoUrl)
      : null;

  return (
    <>
      {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
      <article>
        {/* Full-width hero image */}
        {heroImageUrl && (
          <div className="relative w-full h-[280px] md:h-[420px] lg:h-[480px] bg-ap-dark overflow-hidden">
            <Image
              src={heroImageUrl}
              alt={post.heroImage?.alt ?? post.title}
              fill
              priority
              className="object-cover opacity-90"
              sizes="100vw"
            />
          </div>
        )}

        {/* Title block */}
        <div className="bg-white border-b border-ap-border">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-10 pb-10">
            {cat && (
              <span
                className="inline-block mb-5 text-[0.7rem] font-semibold uppercase tracking-widest text-white px-3 py-1 rounded-full"
                style={{ backgroundColor: cat.color }}
              >
                {cat.label}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-[2.625rem] font-bold text-ap-dark leading-[1.1] tracking-tight mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ap-light">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              )}
              {post.author && (
                <>
                  <span aria-hidden="true" className="w-1 h-1 rounded-full bg-ap-border" />
                  <span>By {post.author}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. Body ──────────────────────────────────────────────────────── */}
        <div className="bg-white py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">

            {/* Webinar video embed — shown above body */}
            {videoId && (
              <div className="mb-10 rounded-2xl overflow-hidden bg-ap-dark aspect-video shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Portable text body */}
            {post.body && post.body.length > 0 && (
              <PortableText value={post.body} />
            )}

            {/* ── 3. Share ───────────────────────────────────────────────── */}
            <div className="mt-12 pt-8 border-t border-ap-border flex flex-wrap items-center gap-4">
              <span className="text-sm font-semibold text-ap-mid">Share this post</span>
              <InsightShareButton />
            </div>
          </div>
        </div>
      </article>

      {/* ── 4. Related Insights ────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="bg-ap-surface border-t border-ap-border py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-ap-dark leading-tight">
                Related Insights
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => {
                const relImageUrl = related.heroImage
                  ? urlFor(related.heroImage).width(640).height(400).url()
                  : null;
                const relCat = related.category ? CATEGORY_CONFIG[related.category] : null;

                return (
                  <article
                    key={related._id}
                    className="group flex flex-col bg-white border border-ap-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative w-full aspect-[8/5] bg-ap-surface flex-shrink-0">
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
                              'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(24,95,165,0.1) 0%, transparent 70%)',
                          }}
                          aria-hidden="true"
                        />
                      )}
                      {relCat && (
                        <span
                          className="absolute top-4 left-4 text-[0.7rem] font-semibold uppercase tracking-widest text-white px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: relCat.color }}
                        >
                          {relCat.label}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 p-6">
                      {related.publishedAt && (
                        <time
                          dateTime={related.publishedAt}
                          className="text-xs font-medium text-ap-light mb-3"
                        >
                          {formatDate(related.publishedAt)}
                        </time>
                      )}
                      <h3 className="font-semibold text-ap-dark leading-snug mb-4 flex-1 text-[1.0625rem]">
                        {related.title}
                      </h3>
                      <Link
                        href={`/insights/${related.slug.current}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-ap-blue group-hover:gap-3 transition-all duration-200"
                      >
                        Read More
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

      <CTAStrip />
    </>
  );
}
