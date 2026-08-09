'use client';

import { useEffect, useRef } from 'react';

export default function AdSlot({
  slot,
  clientId,
  format = 'auto',
  className = '',
}: {
  slot: string | null | undefined;
  clientId: string | null | undefined;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!slot || !clientId) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet (e.g. ad blocker) — fail silently
    }
  }, [slot, clientId]);

  if (!slot || !clientId) return null;

  return (
    <div className={`w-full ${className}`}>
      <span className="eyebrow block mb-1 opacity-50">Advertisement</span>
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format === 'rectangle' ? 'rectangle' : format === 'horizontal' ? 'horizontal' : 'auto'}
        data-full-width-responsive="true"
      />
    </div>
  );
}
