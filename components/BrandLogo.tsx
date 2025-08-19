import React from 'react'

interface BrandLogoProps {
  size?: number
  withWordmark?: boolean
  className?: string
}

// stolen.bio logo — midnight cube with emerald edge and subtle depth
export function BrandLogo({ size = 24, withWordmark = false, className = '' }: BrandLogoProps) {
  const s = size
  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="stolen.bio logo"
      >
        {/* Background cube */}
        <rect x="8" y="8" width="48" height="48" rx="10" fill="#0b1022"/>
        {/* 3D face gradient */}
        <rect x="8" y="8" width="48" height="48" rx="10" fill="url(#g1)" opacity="0.7"/>
        {/* Emerald edge sheen */}
        <path d="M12 20C12 15.5817 15.5817 12 20 12H44C48.4183 12 52 15.5817 52 20" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Inner floating square */}
        <rect x="20" y="20" width="24" height="24" rx="6" fill="#121a35" stroke="#10b981" strokeOpacity="0.35"/>
        {/* Shimmer */}
        <path d="M22 24L30 20" stroke="#2dd4bf" strokeOpacity="0.5"/>
        <defs>
          <linearGradient id="g1" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a"/>
            <stop offset="50%" stopColor="#1e293b"/>
            <stop offset="100%" stopColor="#334155"/>
          </linearGradient>
        </defs>
      </svg>
      {withWordmark && (
        <span style={{ color: 'var(--color-foreground)' }}>
          stolen.bio
        </span>
      )}
    </div>
  )
}

export function BrandTagline({ className = '' }: { className?: string }) {
  return (
    <span className={className} style={{ color: 'var(--color-foreground)', opacity: 0.8 }}>
      Steal the attention, make an impression.
    </span>
  )
}
