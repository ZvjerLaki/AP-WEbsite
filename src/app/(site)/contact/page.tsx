import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries';
import PopupTriggerButton from '@/components/ui/PopupTriggerButton';

export const metadata: Metadata = {
  title: "Contact Us | Authority Partners",
  description: "Get in touch with Authority Partners. Find our office locations or book a call with our team.",
};

interface SiteSettings {
  officeUSA?: string | null;
  officeBosnia?: string | null;
  officeTurkey?: string | null;
  phoneUSA?: string | null;
  phoneBosnia?: string | null;
}

const SETTINGS_OPTS = { next: { revalidate: 3600 } };

const FALLBACK_OFFICES = [
  {
    region: 'United States',
    address: '200 Spectrum Center Dr., Suite 300\nIrvine, CA 92618\nUSA',
    phone: null as string | null,
  },
  {
    region: 'Bosnia & Herzegovina',
    address: 'Dzenetica Cikma 1\n71000 Sarajevo',
    phone: null as string | null,
  },
  {
    region: 'Turkey',
    address: "Içerenköy Mahallesi, Umut Sk 10/12\nQuick Tower\n34742 Istanbul",
    phone: null as string | null,
  },
];

export default async function ContactPage() {
  const settings = await client.fetch<SiteSettings | null>(
    SITE_SETTINGS_QUERY,
    {},
    SETTINGS_OPTS,
  );

  const offices = [
    {
      region: 'United States',
      address: settings?.officeUSA ?? FALLBACK_OFFICES[0].address,
      phone: settings?.phoneUSA ?? null,
    },
    {
      region: 'Bosnia & Herzegovina',
      address: settings?.officeBosnia ?? FALLBACK_OFFICES[1].address,
      phone: settings?.phoneBosnia ?? null,
    },
    {
      region: 'Turkey',
      address: settings?.officeTurkey ?? FALLBACK_OFFICES[2].address,
      phone: null,
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="bg-ap-dark py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            We&apos;re Here!<br />
            Let&apos;s Make It Happen.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Take your business to the next level by partnering with us.
          </p>
        </div>
      </section>

      {/* Office Locations */}
      <section className="bg-ap-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-ap-dark sm:text-4xl">
            Your Next Step Begins Here.
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <div
                key={office.region}
                className="flex flex-col gap-4 rounded-2xl border border-ap-border bg-white p-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ap-blue/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-ap-blue"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.218-4.402 3.218-7.327a7.5 7.5 0 10-15 0c0 2.925 1.275 5.248 3.219 7.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.143.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-ap-dark">{office.region}</h3>
                  <address className="mt-2 whitespace-pre-line text-sm not-italic leading-relaxed text-ap-mid">
                    {office.address}
                  </address>
                  {office.phone && (
                    <a
                      href={`tel:${office.phone.replace(/\s/g, '')}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ap-blue hover:underline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {office.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-bold text-ap-dark sm:text-3xl">
            Ready to talk? Pick a time.
          </h2>
          <p className="mt-4 text-ap-mid">
            Book a call with our team and let&apos;s explore how we can help you move faster.
          </p>
          <PopupTriggerButton className="mt-8 inline-flex items-center gap-2 rounded-full bg-ap-blue px-8 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90">
            Pick a time.
          </PopupTriggerButton>
        </div>
      </section>
    </main>
  );
}
