/**
 * DreamPulseCard — Reusable premium experience card
 * Same structure for all: 60% image, 40% content, 24px radius, unified button.
 * Use isPopular for Journey (hero) styling: scale 1.05, spotlight, badge.
 */
import React from 'react';

export function DreamPulseCard({
  title,
  imageSrc,
  imageAlt,
  onChoose,
  isPopular = false,
  className = '',
  ...props
}) {
  return (
    <article
      className={`
        relative w-full h-[500px] rounded-[24px] overflow-hidden
        bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.07]
        shadow-[0_10px_40px_rgba(0,0,0,0.3)]
        cursor-pointer group
        transition-[transform,box-shadow,border-color] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:translate-y-[-6px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_30px_rgba(255,255,255,0.04)] hover:border-white/[0.1]
        ${isPopular ? 'scale-105 shadow-[0_16px_48px_rgba(0,0,0,0.35)] hover:shadow-[0_24px_56px_rgba(0,0,0,0.4),0_0_40px_rgba(255,184,0,0.06)]' : ''}
        ${className}
      `}
      onClick={onChoose}
      {...props}
    >
      {/* Spotlight glow behind center (popular) card */}
      {isPopular && (
        <span
          className="absolute -inset-5 -z-10 rounded-[32px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,184,0,0.06) 0%, transparent 65%)',
          }}
          aria-hidden
        />
      )}

      {/* Premium badge: top center, gold gradient, crown, MOST POPULAR */}
      {isPopular && (
        <span
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5
            py-1.5 px-3 rounded-full
            bg-gradient-to-br from-[#FFD700] to-[#FFB800] text-[#1a1a1a]
            text-[0.625rem] font-bold uppercase tracking-[0.14em]
            shadow-[0_2px_12px_rgba(0,0,0,0.25)] whitespace-nowrap"
        >
          <span className="text-[0.7rem] leading-none" aria-hidden>👑</span>
          MOST POPULAR
        </span>
      )}

      {/* Full-bleed image: covers entire card; overlay for readability */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(8,8,18,0.95) 0%, rgba(8,8,18,0.5) 28%, rgba(8,8,18,0.15) 55%, transparent 75%), radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.25) 100%)',
          }}
        />
      </div>

      {/* Title + button overlaid at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end py-8 px-5 gap-3.5 pointer-events-none">
        <h2 className="font-sans text-base font-semibold tracking-[0.2em] uppercase text-[#f5f2eb] text-center m-0 text-shadow-[0_1px_8px_rgba(0,0,0,0.4)] pointer-events-none">
          {title}
        </h2>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChoose?.();
          }}
          className="pointer-events-auto w-full max-w-[200px] py-3 px-6 rounded-full
            border border-white/[0.18] bg-gradient-to-b from-white/10 to-white/[0.05]
            text-[#f5f2eb] text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-center whitespace-nowrap
            transition-[transform,box-shadow,border-color,background] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            hover:translate-y-[-2px] hover:border-white/[0.28] hover:from-white/[0.14] hover:to-white/[0.08]
            hover:shadow-[0_8px_24px_rgba(0,0,0,0.25),0_0_20px_rgba(255,255,255,0.08)]"
        >
          Choose Experience
        </button>
      </div>
    </article>
  );
}

export default DreamPulseCard;
