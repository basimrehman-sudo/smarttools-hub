import React, { useEffect, useRef } from 'react';

// AdSense Rules: Do NOT place ads inside clickable buttons. Maintain CLS-safe layout. Lazy load ads.
export default function AdSlot({ slotId, format = 'auto', className = '' }) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
        // Prevent pushing multiple times to the same slot
        if (!adRef.current.hasAttribute('data-adsbygoogle-status')) {
             (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (e) {
      console.error('AdSense error', e);
    }
  }, []);

  return (
    <div className={`flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[100px] overflow-hidden ${className}`}>
      {/* 
        Placeholder for AdSense 
        Replace client id 'ca-pub-XXXXXXXXXXXX' and slotId with real values in production
      */}
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXX"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
      
      {/* Dev Placeholder Text (Can be removed in production) */}
      <div className="absolute opacity-50 text-sm text-gray-500 pointer-events-none">
        Advertisement Slot ({slotId})
      </div>
    </div>
  );
}
