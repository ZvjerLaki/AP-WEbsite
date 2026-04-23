import Link from 'next/link';
import { client } from '@/lib/sanity/client';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries';

interface SiteSettings {
  companyName?: string;
  officeUSA?: string;
  officeBosnia?: string;
  officeTurkey?: string;
}

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Contact Us', href: '/contact' },
];

export default async function Footer() {
  const settings = await client.fetch<SiteSettings | null>(
    SITE_SETTINGS_QUERY,
    {},
    { next: { revalidate: 3600 } },
  );

  const companyName = settings?.companyName ?? 'Authority Partners';

  const offices = [
    { label: 'USA', address: settings?.officeUSA },
    { label: 'Bosnia', address: settings?.officeBosnia },
    { label: 'Turkey', address: settings?.officeTurkey },
  ].filter((o): o is { label: string; address: string } => Boolean(o.address));

  return (
    <footer className="bg-ap-dark">
      {/* Office addresses */}
      {offices.length > 0 && (
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {offices.map((office) => (
              <div key={office.label}>
                <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-2">
                  {office.label}
                </p>
                <address className="text-sm text-white/60 not-italic whitespace-pre-line leading-relaxed">
                  {office.address}
                </address>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50 order-2 sm:order-1">
            © {new Date().getFullYear()} · All Rights Reserved · {companyName}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 order-1 sm:order-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* LinkedIn conversion pixel */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://px.ads.linkedin.com/collect/?pid=8136212&fmt=gif"
        alt=""
        width={1}
        height={1}
        style={{ display: 'none' }}
      />
    </footer>
  );
}
