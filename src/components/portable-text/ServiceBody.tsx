import { PortableText, type PortableTextComponents } from 'next-sanity';
import type { PortableTextBlock } from 'sanity';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-ap-mid leading-relaxed mb-5 text-base md:text-lg">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-ap-dark mt-10 mb-4 leading-snug">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-ap-dark mt-8 mb-3 leading-snug">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ap-dark">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
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
};

export default function ServiceBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="max-w-none">
      <PortableText value={value} components={components} />
    </div>
  );
}
