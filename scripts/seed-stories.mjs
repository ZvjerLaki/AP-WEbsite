// Seed the 5 initial case study stories into Sanity.
// Run from the ap-website directory:
//   node --env-file=.env.local scripts/seed-stories.mjs
//
// Requires SANITY_API_TOKEN in .env.local (a write-enabled token from
// sanity.io → your project → API → Tokens).

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token     = process.env.SANITY_API_TOKEN;

if (!projectId) { console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID'); process.exit(1); }
if (!token)     { console.error('Missing SANITY_API_TOKEN'); process.exit(1); }

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const STORIES = [
  'Modernizing Corporate Learning Operations',
  'Mobile app for streamlined rider coaching and education',
  'Streamlined Bookings, Enriched Experiences',
  'Modernizing Portal Infrastructure',
  "Transforming IWG's Customer Portal",
];

async function seed() {
  console.log(`\nSeeding ${STORIES.length} stories into "${dataset}"…\n`);

  for (const title of STORIES) {
    const slug = toSlug(title);
    const id   = `story-${slug}`;

    const existing = await client.getDocument(id);
    if (existing) {
      console.log(`  skip  ${id}  (already exists)`);
      continue;
    }

    await client.create({
      _id:   id,
      _type: 'story',
      title,
      slug:  { _type: 'slug', current: slug },
    });

    console.log(`  ✓     ${id}`);
  }

  console.log('\nDone. Add hero images via the Sanity Studio at /studio.\n');
}

seed().catch((err) => { console.error(err); process.exit(1); });
