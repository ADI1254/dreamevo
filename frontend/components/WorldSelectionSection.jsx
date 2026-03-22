/**
 * WorldSelectionSection — Dream Pulse card selection UI
 * Centered section, 120px+ top spacing, 3-column grid, 40px gap.
 * Dark gradient background, subtle particles, fade-up animation.
 */
import React, { useState } from 'react';
import { DreamPulseCard } from './DreamPulseCard';

const WORLDS = [
  { id: 'sanctuary', title: 'DEVOTIONAL', image: '/assets/images/devotional.png.png', alt: 'Devotional' },
  { id: 'journey', title: 'JOURNEY', image: '/assets/images/mainjourney.png.png', alt: 'Journey', isPopular: true },
  { id: 'romantic', title: 'ROMANTIC', image: '/assets/images/romantic.png.png', alt: 'Romantic' },
];

export function WorldSelectionSection({ onSelectWorld, className = '' }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleChoose = (id) => {
    setSelectedId(id);
    onSelectWorld?.(id);
  };

  return (
    <section
      className={`
        relative min-h-screen w-full flex flex-col items-center
        pt-[120px] pb-12 px-8 overflow-y-auto
        bg-gradient-to-br from-[#0a0a1a] via-[#0d0d24] via-[28%] via-[#16102a] to-[#0f0a1a]
        ${className}
      `}
    >
      {/* Subtle ambient glow layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% 35%, rgba(100,70,160,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 80% 75%, rgba(80,50,120,0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20 animate-[worldParticleFloat_12s_ease-in-out_infinite]"
            style={{
              left: `${[12, 28, 55, 75, 88][i]}%`,
              top: `${[20, 60, 35, 70, 25][i]}%`,
              animationDelay: `${[-0, -3, -6, -2, -4][i]}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1100px] flex flex-col items-center flex-1">
        {/* Title: Dream Pulse — no overlap with cards */}
        <header className="text-center mb-10">
          <h1 className="flex flex-row gap-4 justify-center text-4xl md:text-5xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#f1f5f9] via-[#e2e8f0] to-[#a78bfa] m-0">
            <span>Dream</span>
            <span>Pulse</span>
          </h1>
        </header>

        {/* 3-column grid, 40px gap, aligned baseline */}
        <div
          className={`
            grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-[1100px] mx-auto
            items-stretch
            ${selectedId ? 'opacity-90' : ''}
          `}
        >
          {WORLDS.map((world, index) => (
            <div
              key={world.id}
              className="animate-[worldCardFadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_forwards opacity-0"
              style={{
                animationDelay: `${[0.08, 0.2, 0.32][index]}s`,
              }}
            >
              <DreamPulseCard
                title={world.title}
                imageSrc={world.image}
                imageAlt={world.alt}
                isPopular={world.isPopular ?? false}
                onChoose={() => handleChoose(world.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Optional: add keyframes via a style tag or global CSS for worldParticleFloat and worldCardFadeUp */}
      <style>{`
        @keyframes worldParticleFloat {
          0%, 100% { opacity: 0.4; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.8; transform: translate(8px, -20px) scale(1.2); }
        }
        @keyframes worldCardFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

export default WorldSelectionSection;
