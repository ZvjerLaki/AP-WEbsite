import Image from 'next/image';
import { PortableText as SanityPortableText, type PortableTextComponents } from 'next-sanity';
import type { PortableTextBlock } from 'sanity';
import { urlFor } from '@/lib/sanity/image';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-ap-mid leading-relaxed mb-5 text-base md:text-lg">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-ap-dark mt-12 mb-4 leading-snug">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-ap-dark mt-10 mb-3 leading-snug">
        {children}
      </h3>
    ),
    code: ({ children }) => (
      <pre className="my-6 rounded-xl overflow-x-auto bg-ap-dark p-5 text-sm font-mono text-white/85 leading-relaxed">
        <code>{children}</code>
      </pre>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ap-dark">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-sm bg-ap-dark/[0.07] text-ap-dark px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-ap-blue underline underline-offset-2 hover:opacity-75 transition-opacity"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const imageUrl = value?.asset ? urlFor(value).width(900).auto('format').url() : null;
      if (!imageUrl) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden rounded-xl bg-ap-surface">
            <Image
              src={imageUrl}
              alt={value?.alt ?? ''}
              width={900}
              height={506}
              className="w-full h-auto"
              sizes="(min-width: 768px) 672px, calc(100vw - 48px)"
            />
          </div>
          {value?.alt && (
            <figcaption className="mt-3 text-center text-sm text-ap-light">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-6 list-disc space-y-1.5 text-ap-mid text-base md:text-lg leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-6 list-decimal space-y-1.5 text-ap-mid text-base md:text-lg leading-relaxed">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

type Props = {
  value: PortableTextBlock[];
};

export default function PortableText({ value }: Props) {
  return (
    <div className="max-w-none">
      <SanityPortableText value={value} components={components} />
    </div>
  );
}
