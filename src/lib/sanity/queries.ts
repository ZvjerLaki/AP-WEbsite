import { groq } from 'next-sanity';

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  companyName,
  footerTagline,
  officeUSA,
  officeBosnia,
  officeTurkey,
  phoneUSA,
  phoneBosnia
}`;

export const STORIES_CAROUSEL_QUERY = groq`*[_type == "story"] | order(_createdAt desc) [0...5] {
  _id,
  title,
  slug,
  heroImage { asset, alt }
}`;

export const INSIGHTS_GRID_QUERY = groq`*[_type == "post" && status == "published"] | order(publishedAt desc) [0...3] {
  _id,
  title,
  slug,
  publishedAt,
  category,
  heroImage { asset, alt }
}`;

export const SERVICES_QUERY = groq`*[_type == "service"] | order(order asc) {
  _id,
  title,
  slug,
  category,
  shortDescription,
}`;

export const CATEGORY_PAGE_QUERY = groq`*[_type == "page" && identifier == $category][0] {
  heroTagline,
  heroSubtitle,
  heroCtaText,
  heroCtaHref,
  problemHeading,
  problemBody,
  solutionHeading,
  solutionBody,
  solutionImage { asset, alt },
  faqs[] { question, answer },
}`;

export const CATEGORY_SERVICES_QUERY = groq`*[_type == "service" && category == $category] | order(order asc) {
  _id,
  title,
  slug,
  shortDescription,
}`;

export const CATEGORY_INSIGHTS_QUERY = groq`*[_type == "post" && status == "published"] | order(publishedAt desc) [0...3] {
  _id,
  title,
  slug,
  publishedAt,
  category,
  excerpt,
  heroImage { asset, alt }
}`;

export const SERVICE_META_QUERY = groq`*[_type == "service" && slug.current == $slug && category == $category][0] {
  title,
  shortDescription,
}`;

export const SERVICE_PAGE_QUERY = groq`*[_type == "service" && slug.current == $slug && category == $category][0] {
  title,
  slug,
  category,
  shortDescription,
  heroTagline,
  ctaText,
  icon { asset, alt },
  longDescription,
  faqs[] { question, answer },
}`;

export const RELATED_SERVICES_QUERY = groq`*[_type == "service" && category == $category && slug.current != $slug] | order(order asc) [0...4] {
  _id,
  title,
  slug,
  shortDescription,
}`;

export const INSIGHTS_ALL_QUERY = groq`*[_type == "post" && status == "published"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  category,
  heroImage { asset, alt }
}`;

export const INSIGHTS_ALL_SLUGS_QUERY = groq`*[_type == "post" && status == "published"] {
  "slug": slug.current
}`;

export const SERVICES_ALL_SLUGS_QUERY = groq`*[_type == "service"] {
  "slug": slug.current,
  category
}`;

export const POST_PAGE_QUERY = groq`*[_type == "post" && slug.current == $slug && status == "published"][0] {
  _id,
  title,
  slug,
  publishedAt,
  category,
  author,
  heroImage { asset, alt },
  excerpt,
  body,
  videoUrl,
  seo { metaTitle, metaDescription }
}`;

export const RELATED_INSIGHTS_QUERY = groq`*[_type == "post" && status == "published" && category == $category && slug.current != $slug] | order(publishedAt desc) [0...3] {
  _id,
  title,
  slug,
  publishedAt,
  category,
  heroImage { asset, alt }
}`;

export const STORIES_ALL_QUERY = groq`*[_type == "story"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  heroImage { asset, alt }
}`;

export const STORIES_ALL_SLUGS_QUERY = groq`*[_type == "story"] {
  "slug": slug.current
}`;

export const STORY_PAGE_QUERY = groq`*[_type == "story" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  client,
  industry,
  heroImage { asset, alt },
  challenge,
  solution,
  results,
  technologies,
  body,
  seo { metaTitle, metaDescription }
}`;

export const RELATED_STORIES_QUERY = groq`*[_type == "story" && slug.current != $slug] | order(_createdAt desc) [0...3] {
  _id,
  title,
  slug,
  heroImage { asset, alt }
}`;

export const ABOUT_PAGE_QUERY = groq`*[_type == "page" && identifier == "about"][0] {
  heroTagline,
  heroSubtitle,
  heroCtaText,
  heroCtaHref,
  differenceBody,
  visionHeading,
  visionBody,
  missionHeading,
  missionBody,
  coreValues[] { name, description }
}`;

export const TEAM_MEMBERS_QUERY = groq`*[_type == "teamMember" && isVisible == true] | order(order asc) {
  _id,
  name,
  title,
  photo { asset, alt }
}`;

export const LEGAL_PAGE_QUERY = groq`*[_type == "page" && identifier == $identifier][0] {
  heroTagline,
  body
}`;

export const AP_LAB_PAGE_QUERY = groq`*[_type == "page" && identifier == "ap-lab"][0] {
  heroTagline,
  heroSubtitle,
  heroCtaText,
  heroCtaHref,
  problemHeading,
  problemBody,
  solutionHeading,
  solutionBody,
  steps[] { heading, body },
  faqs[] { question, answer }
}`;
