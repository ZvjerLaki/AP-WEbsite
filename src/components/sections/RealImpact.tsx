import { client } from '@/lib/sanity/client';
import { STORIES_CAROUSEL_QUERY } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import StoriesCarousel, { type StoryCard } from './StoriesCarousel';

interface SanityStory {
  _id: string;
  title: string;
  slug: { current: string };
  heroImage?: {
    asset: { _ref: string };
    alt?: string;
  };
}

export default async function RealImpact() {
  const raw = await client.fetch<SanityStory[]>(
    STORIES_CAROUSEL_QUERY,
    {},
    { next: { revalidate: 3600, tags: ['stories'] } },
  );

  const stories: StoryCard[] = (raw ?? []).map((s) => ({
    _id: s._id,
    title: s.title,
    slug: s.slug.current,
    imageUrl: s.heroImage ? urlFor(s.heroImage).width(672).height(448).url() : null,
    imageAlt: s.heroImage?.alt ?? s.title,
  }));

  return (
    <section className="bg-ap-surface py-20 md:py-28 overflow-hidden">
      <StoriesCarousel stories={stories} />
    </section>
  );
}
