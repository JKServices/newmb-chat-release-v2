"use client";

import { useEffect, useRef } from "react";

type AdSlotProps = {
  label?: string;
  client?: string;
  slot?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({
  label = "Advertisement",
  client = "",
  slot = ""
}: AdSlotProps) {
  const pushedRef = useRef(false);

  const hasClient = client.trim().length > 0;
  const hasSlot = slot.trim().length > 0;
  const canRenderAd = hasClient && hasSlot;

  useEffect(() => {
    if (!canRenderAd) return;
    if (pushedRef.current) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // AdSense can fail silently before approval or while the script is loading.
    }
  }, [canRenderAd]);

  if (!hasClient) {
    return (
      <aside className="ad-slot" aria-label={label}>
        <span>{label}</span>
        <div className="ad-placeholder">AdSense client not configured</div>
      </aside>
    );
  }

  if (!hasSlot) {
    return (
      <aside className="ad-slot" aria-label={label}>
        <span>{label}</span>
        <div className="ad-placeholder">AdSense slot not configured</div>
      </aside>
    );
  }

  return (
    <aside className="ad-slot" aria-label={label}>
      <span>{label}</span>

      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: "90px"
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
