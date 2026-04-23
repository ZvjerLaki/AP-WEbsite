import Link from 'next/link';

interface CTAStripProps {
  heading?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTAStrip({
  heading = "Let's Engineer What's Next Together.",
  buttonText = 'Start Building Smarter',
  buttonHref = '/contact',
}: CTAStripProps) {
  return (
    <div className="bg-ap-dark">
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-white text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-8">
          {heading}
        </h2>
        <Link
          href={buttonHref}
          className="inline-flex items-center rounded-full bg-ap-blue text-white font-semibold px-8 py-3.5 text-sm hover:bg-ap-blue/90 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
