import { client } from '@/lib/sanity/client';
import { SERVICES_QUERY } from '@/lib/sanity/queries';
import ServicesTabs, { type SanityService } from '@/components/sections/ServicesTabs';
import CTAStrip from '@/components/ui/CTAStrip';

const DIFFERENTIATORS = [
  {
    title: 'Tailored Solutions, Not Off-the-Shelf',
    body: 'Every engagement is scoped to your goals, constraints, and context — no templates, no one-size-fits-all playbooks.',
  },
  {
    title: 'Global Talent Network, Local Impact',
    body: 'Deep expertise distributed across continents, delivered with the responsiveness and accountability of a local partner.',
  },
  {
    title: 'Agile Delivery, Enterprise Standards',
    body: 'Sprint-based execution paired with the governance, documentation, and quality gates your stakeholders trust.',
  },
];

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="11" cy="11" r="11" fill="rgba(255,255,255,0.08)" />
      <path
        d="M7 11l3 3 5-5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function ServicesPage() {
  const services = await client.fetch<SanityService[]>(
    SERVICES_QUERY,
    {},
    { next: { revalidate: 3600, tags: ['services'] } },
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-ap-surface border-b border-ap-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-ap-dark leading-[1.08] tracking-tight mb-6">
            Solutions Engineered Around You
          </h1>
          <p className="text-lg md:text-xl text-ap-mid leading-relaxed max-w-2xl mx-auto">
            Partner with us to innovate, modernize, scale, and succeed on your terms.
          </p>
        </div>
      </section>

      {/* Tabs + Cards */}
      <ServicesTabs services={services} />

      {/* What Sets Us Apart */}
      <section className="bg-ap-dark py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14 text-center max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              What Sets Us Apart
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIFFERENTIATORS.map((d) => (
              <div
                key={d.title}
                className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-8
                  hover:border-white/20 transition-colors duration-300"
              >
                <CheckIcon />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {d.title}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">
                    {d.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
