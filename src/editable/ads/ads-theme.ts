// theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

export const adSkin: AdSkin = {
  radius: '16px',
  border: '1px solid #e6e5f5',
  shadow: '0 4px 20px rgba(21,15,65,0.06)',
  background: '#ffffff',
  labelClassName: 'bg-[#4760e6] text-white',
}

export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '16px', shadow: 'none', border: '1px solid #e6e5f5' },
  popup: { radius: '24px' },
  header: { radius: '16px', background: '#f9f7ff' },
  rail: { radius: '12px' },
  feature: { radius: '16px' },
  interstitial: { radius: '24px', shadow: '0 20px 60px rgba(21,15,65,0.5)' },
  anchor: { radius: '12px', shadow: '0 6px 24px rgba(21,15,65,0.18)' },
}

export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
