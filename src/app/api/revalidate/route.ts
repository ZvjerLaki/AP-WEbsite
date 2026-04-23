import { revalidatePath } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { type NextRequest, NextResponse } from 'next/server'

// Maps page.identifier values to their URL paths
const PAGE_PATHS: Record<string, string> = {
  home: '/',
  about: '/about',
  contact: '/contact',
  'ap-lab': '/careers/ap-lab',
  'privacy-policy': '/privacy-policy',
  'terms-of-service': '/terms-of-service',
  disclaimer: '/disclaimer',
  innovate: '/services/innovate',
  build: '/services/build',
  refresh: '/services/refresh',
  accelerate: '/services/accelerate',
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ message: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? ''

  const valid = await isValidSignature(body, signature, secret)
  if (!valid) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }

  const { _type, slug, category, identifier } = JSON.parse(body) as {
    _type: string
    slug?: { current?: string }
    category?: string
    identifier?: string
  }
  const slugValue = slug?.current

  switch (_type) {
    case 'post':
      revalidatePath('/insights')
      revalidatePath('/')
      if (slugValue) revalidatePath(`/insights/${slugValue}`)
      break

    case 'story':
      revalidatePath('/stories')
      revalidatePath('/')
      if (slugValue) revalidatePath(`/stories/${slugValue}`)
      break

    case 'service':
      revalidatePath('/services')
      if (category) revalidatePath(`/services/${category}`)
      if (category && slugValue) revalidatePath(`/services/${category}/${slugValue}`)
      break

    case 'teamMember':
      revalidatePath('/about')
      break

    case 'siteSettings':
      revalidatePath('/')
      break

    case 'page': {
      const path = identifier ? (PAGE_PATHS[identifier] ?? `/${identifier}`) : null
      if (path) revalidatePath(path)
      break
    }
  }

  return NextResponse.json({ revalidated: true, _type })
}
