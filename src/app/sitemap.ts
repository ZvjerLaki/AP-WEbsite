import type { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client';
import {
  INSIGHTS_ALL_SLUGS_QUERY,
  STORIES_ALL_SLUGS_QUERY,
  SERVICES_ALL_SLUGS_QUERY,
} from '@/lib/sanity/queries';

const BASE_URL = 'https://authoritypartners.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, stories, services] = await Promise.all([
    client.fetch<{ slug: string }[]>(INSIGHTS_ALL_SLUGS_QUERY),
    client.fetch<{ slug: string }[]>(STORIES_ALL_SLUGS_QUERY),
    client.fetch<{ slug: string; category: string }[]>(SERVICES_ALL_SLUGS_QUERY),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,               changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about`,          changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`,        changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services`,       changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/careers`,        changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/careers/ap-lab`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/insights`,       changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/stories`,        changeFrequency: 'weekly',  priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map(({ slug }) => ({
    url: `${BASE_URL}/insights/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const storyRoutes: MetadataRoute.Sitemap = stories.map(({ slug }) => ({
    url: `${BASE_URL}/stories/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map(({ slug, category }) => ({
    url: `${BASE_URL}/services/${category}/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...storyRoutes, ...serviceRoutes];
}
