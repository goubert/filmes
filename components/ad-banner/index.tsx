'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  slot: string;
  className?: string;
}

export default function AdBanner({
  slot,
  className = '',
}: AdBannerProps) {
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    const ad = insRef.current;

    if (!ad) return;

    // evita reinicializar anúncio já carregado
    if (
      ad.getAttribute('data-adsbygoogle-status') === 'done'
    ) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '250px',
      }}
      data-ad-client="ca-pub-2529666899037234"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}