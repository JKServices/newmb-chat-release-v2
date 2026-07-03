"use client";

import { useEffect } from "react";

type AdSlotProps = {
  label?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({ label = "Advertisement" }: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  useEffect(() => {
    if (!adsenseClient || !adsenseSlot) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense may not be ready yet. Fail silently.
    }
  }, [adsenseClient, adsenseSlot]);

  if (!adsenseClient || !adsenseSlot) {
    return (
      <aside className="ad-slot" aria-label={label}>
        <span>{label}</span>
        <div className="ad-placeholder">Ad space</div>
      </aside>
    );
  }

  return (
    <aside className="ad-slot" aria-label={label}>
      <span>{label}</span>

      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseClient}
        data-ad-slot={adsenseSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
