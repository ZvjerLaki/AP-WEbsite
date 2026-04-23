'use client';

import { useState, useEffect, useRef } from 'react';

type Mode = 'choice' | 'form' | 'calendly';
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface PopupProps {
  open: boolean;
  onClose: () => void;
}

const INPUT_CLS =
  'w-full rounded-lg border border-ap-border px-3 py-2.5 text-sm text-ap-dark outline-none ' +
  'focus:border-ap-blue transition-colors placeholder:text-ap-light/50 bg-white';

const LABEL_CLS = 'text-xs font-semibold uppercase tracking-wide text-ap-mid';

export default function Popup({ open, onClose }: PopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<Mode>('choice');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Drive native <dialog> from React state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      if (dialog.open) dialog.close();
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Reset to choice screen after close animation settles
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => { setMode('choice'); setStatus('idle'); setErrorMsg(''); }, 250);
    return () => clearTimeout(t);
  }, [open]);

  // Intercept native ESC so React state stays in sync
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handle = (e: Event) => { e.preventDefault(); onClose(); };
    dialog.addEventListener('cancel', handle);
    return () => dialog.removeEventListener('cancel', handle);
  }, [onClose]);

  // Close when clicking the backdrop (outside dialog box)
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      onClose();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(json.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }

  function goBack() {
    setMode('choice');
    setStatus('idle');
    setErrorMsg('');
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="
        m-auto w-full max-w-lg rounded-2xl bg-white p-0 shadow-2xl overflow-hidden
        backdrop:bg-black/60 backdrop:backdrop-blur-sm
        [&:not([open])]:hidden
      "
    >
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-1">
        {mode !== 'choice' && status !== 'success' ? (
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-sm text-ap-mid hover:text-ap-dark transition-colors -ml-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
            Back
          </button>
        ) : <span />}

        <button onClick={onClose} aria-label="Close" className="p-1 text-ap-light hover:text-ap-dark transition-colors -mr-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="px-6 pb-8 pt-3">

        {/* Success screen */}
        {status === 'success' && (
          <div className="text-center py-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-ap-dark mb-2">Message Sent!</h3>
            <p className="text-sm text-ap-light mb-7">Thanks for reaching out. We&apos;ll be in touch shortly.</p>
            <button
              onClick={onClose}
              className="rounded-full bg-ap-blue text-white font-semibold px-7 py-2.5 text-sm hover:bg-ap-blue/90 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* All non-success screens share the heading */}
        {status !== 'success' && (
          <>
            <h2 className="text-[1.45rem] font-bold text-ap-dark leading-snug">
              {"Let's Build Your Success Story."}
            </h2>
            {mode === 'choice' && (
              <p className="mt-1.5 text-sm text-ap-light leading-relaxed">
                {"We're here to help! Let's make sure we put you in touch with the right people!"}
              </p>
            )}
          </>
        )}

        {/* ── Choice screen ─────────────────────────────────────────── */}
        {mode === 'choice' && (
          <div className="mt-6 space-y-3">
            <OptionCard
              icon={<EmailIcon />}
              title="Not ready for a call yet?"
              subtitle="Send us a note"
              onClick={() => setMode('form')}
            />
            <OptionCard
              icon={<CalendarIcon />}
              title="Ready to talk?"
              subtitle="Pick a time."
              onClick={() => setMode('calendly')}
            />
          </div>
        )}

        {/* ── Contact form ──────────────────────────────────────────── */}
        {mode === 'form' && status !== 'success' && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name">
                <input name="firstName" placeholder="Jane" className={INPUT_CLS} />
              </Field>
              <Field label="Last Name">
                <input name="lastName" placeholder="Doe" className={INPUT_CLS} />
              </Field>
            </div>

            <Field label={<>Work Email <Required /></>}>
              <input name="email" type="email" required placeholder="jane@company.com" className={INPUT_CLS} />
            </Field>

            <Field label="Company">
              <input name="company" placeholder="Acme Corp" className={INPUT_CLS} />
            </Field>

            <Field label="What are you interested in?">
              <div className="relative">
                <select name="interest" defaultValue="" className={INPUT_CLS + ' appearance-none pr-8'}>
                  <option value="" disabled>Select an option…</option>
                  <option value="Services">Services</option>
                  <option value="Careers">Careers</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ap-light">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </div>
              </div>
            </Field>

            <Field label="Message">
              <textarea name="message" rows={3} placeholder="Tell us about your project…" className={INPUT_CLS + ' resize-none'} />
            </Field>

            {status === 'error' && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-1 w-full rounded-full bg-ap-blue text-white font-semibold py-3 text-sm hover:bg-ap-blue/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}

        {/* ── Calendly placeholder (Module 7) ───────────────────────── */}
        {mode === 'calendly' && (
          <div className="mt-5 flex items-center justify-center rounded-xl border border-dashed border-ap-border py-16 text-sm text-ap-light">
            Calendly widget — TODO Module 7
          </div>
        )}
      </div>
    </dialog>
  );
}

// ── Small sub-components ──────────────────────────────────────────────────────

function OptionCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-4 rounded-xl border border-ap-border p-4 text-left transition-colors hover:border-ap-blue hover:bg-ap-blue-light"
    >
      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-ap-blue/10 transition-colors group-hover:bg-ap-blue/20">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ap-dark">{title}</p>
        <p className="text-xs text-ap-light">{subtitle}</p>
      </div>
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#aaa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3l5 5-5 5" />
      </svg>
    </button>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={LABEL_CLS}>{label}</label>
      {children}
    </div>
  );
}

function Required() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7L12 13 2 7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
