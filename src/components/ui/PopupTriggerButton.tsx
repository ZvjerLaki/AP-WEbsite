'use client';

import { usePopup } from '@/components/layout/PopupContext';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function PopupTriggerButton({ children, className }: Props) {
  const { openPopup } = usePopup();
  return (
    <button type="button" onClick={openPopup} className={className}>
      {children}
    </button>
  );
}
