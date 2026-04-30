'use client';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 36, className }: LogoProps) {
  const scale = size / 36;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Arvind Gupta Toys logo"
    >
      {/* Lightbulb body - made of craft paper feel */}
      <path
        d="M18 4C12.5 4 8 8.5 8 14C8 17.5 9.8 20.5 12.5 22.2V25C12.5 25.6 13 26 13.5 26H22.5C23 26 23.5 25.6 23.5 25V22.2C26.2 20.5 28 17.5 28 14C28 8.5 23.5 4 18 4Z"
        fill="#c8531a"
        opacity="0.9"
      />
      {/* Light glow */}
      <circle cx="18" cy="13" r="5" fill="#e8763f" opacity="0.6" />
      <circle cx="18" cy="13" r="3" fill="#FFD700" opacity="0.5" />

      {/* Matchstick filament - vertical */}
      <rect x="17" y="9" width="2" height="9" rx="1" fill="#22c55e" />
      {/* Matchstick filament - left diagonal */}
      <rect
        x="14"
        y="11"
        width="2"
        height="6"
        rx="1"
        fill="#22c55e"
        transform="rotate(-30 15 14)"
      />
      {/* Matchstick filament - right diagonal */}
      <rect
        x="20"
        y="11"
        width="2"
        height="6"
        rx="1"
        fill="#22c55e"
        transform="rotate(30 21 14)"
      />

      {/* Base screw threads - paper strips */}
      <rect x="13" y="26" width="10" height="2" rx="1" fill="#c8531a" opacity="0.7" />
      <rect x="14" y="28.5" width="8" height="2" rx="1" fill="#c8531a" opacity="0.5" />
      <rect x="15" y="31" width="6" height="2" rx="1" fill="#c8531a" opacity="0.3" />

      {/* Sparkle dots - representing ideas */}
      <circle cx="7" cy="8" r="1.2" fill="#22c55e" opacity="0.7" />
      <circle cx="29" cy="8" r="1.2" fill="#22c55e" opacity="0.7" />
      <circle cx="5" cy="16" r="0.8" fill="#c8531a" opacity="0.5" />
      <circle cx="31" cy="16" r="0.8" fill="#c8531a" opacity="0.5" />
    </svg>
  );
}
