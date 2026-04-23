'use client';

import { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M5 7.5l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FAQItem({ item, open, onToggle }: {
  item: FAQItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-ap-border last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left
          text-ap-dark font-semibold text-base md:text-lg hover:text-ap-blue
          transition-colors duration-200 outline-none focus-visible:ring-2
          focus-visible:ring-ap-blue focus-visible:ring-offset-2 rounded-sm"
      >
        <span>{item.question}</span>
        <ChevronDown open={open} />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-ap-mid leading-relaxed text-sm md:text-base">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs.length) return null;

  return (
    <div className="divide-y divide-ap-border border border-ap-border rounded-2xl overflow-hidden bg-white">
      {faqs.map((item, i) => (
        <FAQItem
          key={i}
          item={item}
          open={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}
