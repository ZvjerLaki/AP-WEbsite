'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import Popup from './Popup';

interface PopupContextValue {
  openPopup: () => void;
  closePopup: () => void;
}

const PopupContext = createContext<PopupContextValue | null>(null);

export function usePopup(): PopupContextValue {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error('usePopup must be used within PopupProvider');
  return ctx;
}

export function PopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  function openPopup() {
    setIsOpen(true);
    window.gtag?.('event', 'popup_open', { event_category: 'engagement' });
  }

  return (
    <PopupContext.Provider value={{ openPopup, closePopup: () => setIsOpen(false) }}>
      {children}
      <Popup open={isOpen} onClose={() => setIsOpen(false)} />
    </PopupContext.Provider>
  );
}
