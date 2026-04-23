'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePopup } from './PopupContext';

// ─── Static data ────────────────────────────────────────────────────────────

const SERVICE_COLUMNS = [
  {
    label: 'Innovate',
    accent: '#534AB7',
    items: [
      { name: 'AI Academy',                 href: '/services/innovate/ai-academy' },
      { name: 'Agentic AI Assessment',      href: '/services/innovate/agentic-ai-assessment' },
      { name: 'Agentic AI Innovation',      href: '/services/innovate/agentic-ai-innovation' },
      { name: 'Productivity Acceleration',  href: '/services/innovate/productivity-acceleration' },
      { name: 'Product Discovery',          href: '/services/innovate/product-discovery' },
    ],
  },
  {
    label: 'Build',
    accent: '#185FA5',
    items: [
      { name: 'Agentic AI Production',      href: '/services/build/agentic-ai-production' },
      { name: 'Product Planning Workshop',  href: '/services/build/product-planning-workshop' },
      { name: 'Software Engineering',       href: '/services/build/software-engineering' },
      { name: 'QA and Automation',          href: '/services/build/qa-and-automation' },
    ],
  },
  {
    label: 'Refresh',
    accent: '#0F6E56',
    items: [
      { name: 'Cloud-native Migration',         href: '/services/refresh/cloud-native-migration' },
      { name: 'Codebase Refresh',               href: '/services/refresh/codebase-refresh' },
      { name: 'Microservices Transformation',   href: '/services/refresh/microservices-transformation' },
      { name: 'Encompass EPC Migration',        href: '/services/refresh/encompass-epc-migration' },
    ],
  },
  {
    label: 'Accelerate',
    accent: '#1A1A1A',
    items: [
      { name: 'Staff Augmentation',             href: '/services/accelerate/staff-augmentation' },
      { name: 'Dedicated Nearshore Team',       href: '/services/accelerate/dedicated-nearshore-team' },
      { name: 'Managed Delivery Pod',           href: '/services/accelerate/managed-delivery-pod' },
      { name: 'Client-Aligned Delivery Center', href: '/services/accelerate/client-aligned-delivery-center' },
    ],
  },
];

const NAV_LINKS = [
  { name: 'About',    href: '/about' },
  { name: 'Stories',  href: '/stories' },
  { name: 'Insights', href: '/insights' },
  { name: 'Careers',  href: '/careers' },
];

// ─── Mega Menu ───────────────────────────────────────────────────────────────

function MegaMenu({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`
        absolute left-0 right-0 top-full bg-white shadow-xl border-t border-ap-border
        transition-all duration-200 origin-top overflow-hidden
        ${visible ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}
      `}
      style={{ transformOrigin: 'top center' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Explore all link */}
        <div className="mb-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ap-blue hover:underline"
          >
            Explore All Services
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {SERVICE_COLUMNS.map((col) => (
            <div key={col.label}>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="inline-block h-5 w-1 rounded-full"
                  style={{ background: col.accent }}
                />
                <span className="text-xs font-bold tracking-widest uppercase text-ap-mid">
                  {col.label}
                </span>
              </div>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-ap-dark hover:text-ap-blue transition-colors leading-snug block py-0.5"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Drawer ───────────────────────────────────────────────────────────

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { openPopup } = usePopup();
  const [servicesExpanded, setServicesExpanded] = useState(false);

  // Trap focus / close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white flex flex-col
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ap-border">
          <Link href="/" onClick={onClose}>
            <Image
              src="/images/logo-dark.svg"
              alt="Authority Partners"
              width={132}
              height={38}
              priority
            />
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 text-ap-mid hover:text-ap-dark transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-6 py-6 space-y-1">
          {/* Services accordion */}
          <div>
            <button
              onClick={() => setServicesExpanded((v) => !v)}
              className="flex w-full items-center justify-between py-3 text-base font-semibold text-ap-dark"
            >
              Services
              <svg
                width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
                className={`transition-transform duration-200 ${servicesExpanded ? 'rotate-180' : ''}`}
              >
                <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${servicesExpanded ? 'max-h-[600px]' : 'max-h-0'}`}>
              <div className="pb-3 pl-2 space-y-5">
                <Link
                  href="/services"
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-sm font-semibold text-ap-blue py-1"
                >
                  Explore All Services
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                {SERVICE_COLUMNS.map((col) => (
                  <div key={col.label}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block h-4 w-0.5 rounded-full" style={{ background: col.accent }} />
                      <span className="text-xs font-bold tracking-widest uppercase text-ap-mid">
                        {col.label}
                      </span>
                    </div>
                    <ul className="space-y-1 pl-3">
                      {col.items.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="block py-1 text-sm text-ap-dark hover:text-ap-blue transition-colors"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Static links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className="block py-3 text-base font-semibold text-ap-dark border-t border-ap-border/50 hover:text-ap-blue transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="px-6 py-6 border-t border-ap-border">
          <button
            onClick={() => { onClose(); openPopup(); }}
            className="w-full rounded-full bg-ap-blue text-white font-semibold py-3 text-sm hover:bg-ap-blue/90 transition-colors"
          >
            {"Let's Talk"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main NavbarClient ───────────────────────────────────────────────────────

export default function NavbarClient() {
  const [scrolled, setScrolled]     = useState(false);
  const [megaOpen, setMegaOpen]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openPopup }               = usePopup();
  const megaRef                     = useRef<HTMLDivElement>(null);
  const closeTimer                     = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    if (!megaOpen) return;
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [megaOpen]);

  const openMega  = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);

  const scheduleMegaClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  const navBase = 'relative transition-all duration-300';
  const navScrolled = scrolled
    ? 'bg-white shadow-[0_2px_16px_0_rgba(0,0,0,0.08)]'
    : 'bg-transparent';

  return (
    <>
      <header className={`${navBase} ${navScrolled} sticky top-0 z-50`} ref={megaRef}>
        <div className="max-w-7xl mx-auto px-6 flex items-center h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-10">
            <Image
              src={scrolled ? '/images/logo-dark.svg' : '/images/logo.svg'}
              alt="Authority Partners"
              width={132}
              height={38}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {/* Services trigger */}
            <div
              onMouseEnter={openMega}
              onMouseLeave={scheduleMegaClose}
              className="relative"
            >
              <button
                aria-expanded={megaOpen}
                aria-haspopup="true"
                className={`
                  flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors
                  ${scrolled ? 'text-ap-dark hover:text-ap-blue' : 'text-white hover:text-white/80'}
                `}
              >
                Services
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Static links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  px-3 py-2 text-sm font-semibold rounded-md transition-colors
                  ${scrolled ? 'text-ap-dark hover:text-ap-blue' : 'text-white hover:text-white/80'}
                `}
              >
                {link.name}
              </Link>
            ))}

            {/* Search placeholder */}
            <button
              aria-label="Search"
              className={`ml-1 p-2 rounded-md transition-colors ${
                scrolled ? 'text-ap-mid hover:text-ap-dark' : 'text-white/70 hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8" cy="8" r="5.5" />
                <path d="M12.5 12.5l3 3" />
              </svg>
            </button>
          </nav>

          {/* CTA — desktop */}
          <button
            onClick={openPopup}
            className="hidden md:inline-flex items-center rounded-full bg-ap-blue text-white text-sm font-semibold px-5 py-2.5 hover:bg-ap-blue/90 transition-colors ml-4 flex-shrink-0"
          >
            {"Let's Talk"}
          </button>

          {/* Hamburger — mobile */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <button
              aria-label="Search"
              className={`p-2 transition-colors ${scrolled ? 'text-ap-mid' : 'text-white'}`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8" cy="8" r="5.5" />
                <path d="M12.5 12.5l3 3" />
              </svg>
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={`p-2 transition-colors ${scrolled ? 'text-ap-dark' : 'text-white'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mega menu panel */}
        <div
          onMouseEnter={openMega}
          onMouseLeave={scheduleMegaClose}
        >
          <MegaMenu visible={megaOpen} />
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
