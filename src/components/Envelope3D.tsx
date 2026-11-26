import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { EVENT_DETAILS } from '../data/invitation';

interface Envelope3DProps {
  onOpenComplete: () => void;
}

export const Envelope3D: React.FC<Envelope3DProps> = ({ onOpenComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<'sealed' | 'opening' | 'rising'>('sealed');
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleOpen = () => {
    if (phase !== 'sealed') return;

    if (prefersReducedMotion) {
      onOpenComplete();
      return;
    }

    setTilt({ rotateX: 0, rotateY: 0 });
    setPhase('opening');

    const t1 = window.setTimeout(() => {
      setPhase('rising');
    }, 460);

    const t2 = window.setTimeout(() => {
      onOpenComplete();
    }, 1150);

    timersRef.current.push(t1, t2);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || phase !== 'sealed' || e.pointerType === 'touch') {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-y * 10).toFixed(2)),
      rotateY: Number((x * 12).toFixed(2)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const isFlapOpen = phase === 'opening' || phase === 'rising';
  const isCardRising = phase === 'rising';

  return (
    <motion.section
      aria-label="Enveloppe d'invitation"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -14 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12"
    >
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        {/* Refined editorial invitation header */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] font-medium tracking-[0.26em] text-[#E5B96B] uppercase sm:text-[13px]"
        >
          {EVENT_DETAILS.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2.5 font-serif text-[clamp(1.95rem,7vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-[#FBF7EF]"
          style={{ textWrap: 'balance' }}
        >
          {EVENT_DETAILS.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-[#C3D1E8] tabular-nums sm:gap-x-3 sm:text-sm"
        >
          <span>{EVENT_DETAILS.dateLabel}</span>
          <span aria-hidden="true" className="text-[#E5B96B]/70">
            ·
          </span>
          <span>À {EVENT_DETAILS.timeLabel}</span>
          <span aria-hidden="true" className="text-[#E5B96B]/70">
            ·
          </span>
          <span>{EVENT_DETAILS.contributionLabel}</span>
        </motion.div>

        {/* 3D Interactive Envelope Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`envelope-scene relative mt-8 w-full max-w-[335px] sm:mt-11 sm:max-w-[460px] md:max-w-[500px] ${
            phase === 'sealed' ? 'envelope-float-idle' : ''
          }`}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {/* Ambient soft floor shadow beneath the floating 3D envelope */}
          <div
            aria-hidden="true"
            className="mx-auto mt-2 h-7 w-[84%] rounded-full bg-black/55 blur-2xl sm:h-8"
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: '8%',
              zIndex: 0,
            }}
          />

          <div
            className="envelope-body-3d relative aspect-[1.56/1] w-full transition-transform duration-300 ease-out"
            style={{
              transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            }}
          >
            {/* Envelope Base / Back Inner Wall */}
            <div
              className="absolute inset-0 overflow-hidden rounded-xl border border-[#E5D9C3]/80 shadow-[0_28px_60px_-15px_rgba(3,8,20,0.75)]"
              style={{
                background:
                  'linear-gradient(160deg, #E7DFCF 0%, #D9CEB8 55%, #CFC2AA 100%)',
              }}
            >
              {/* Subtle inner gold decorative border visible when flap lifts */}
              <div className="absolute inset-2.5 rounded-lg border border-[#C8A15A]/35 sm:inset-3" />
            </div>

            {/* Inner Invitation Card Sliding Out */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[6%] bottom-[8%] z-10 rounded-lg border border-[#DFC48C]/80 bg-[#FFFDF9] px-4 py-3 text-center shadow-[0_12px_32px_rgba(10,18,38,0.28)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 sm:py-5"
              style={{
                height: '82%',
                transform: isCardRising
                  ? 'translateY(-44%) scale(1.02)'
                  : isFlapOpen
                    ? 'translateY(-14%)'
                    : 'translateY(0%)',
                opacity: isFlapOpen ? 1 : 0.92,
              }}
            >
              <div className="flex h-full flex-col items-center justify-center border border-[#E5C88F]/60 px-2.5 py-2 sm:px-3">
                <span className="text-[9px] font-semibold tracking-[0.22em] text-[#9A6E2A] uppercase sm:text-[10px]">
                  Repas Familial
                </span>
                <p className="mt-0.5 font-serif text-lg font-semibold text-[#112244] sm:mt-1 sm:text-2xl">
                  25 Décembre · 13h00
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-[#526280] tabular-nums sm:mt-1 sm:text-xs">
                  {EVENT_DETAILS.contributionLabel}
                </p>
              </div>
            </div>

            {/* Front Left, Right & Bottom Paper Folds */}
            <svg
              aria-hidden="true"
              viewBox="0 0 500 320"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-hidden rounded-xl"
            >
              <defs>
                <linearGradient id="env-left" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#F8F3EA" />
                  <stop offset="100%" stopColor="#EBE2D3" />
                </linearGradient>
                <linearGradient id="env-right" x1="100%" y1="0%" x2="0%" y2="50%">
                  <stop offset="0%" stopColor="#F5EFE5" />
                  <stop offset="100%" stopColor="#E6DCCB" />
                </linearGradient>
                <linearGradient id="env-bottom" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#FAF6EE" />
                  <stop offset="80%" stopColor="#F1E9DC" />
                  <stop offset="100%" stopColor="#E7DEC9" />
                </linearGradient>
                <filter id="fold-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow
                    dx="0"
                    dy="-2"
                    stdDeviation="4"
                    floodColor="#101E3A"
                    floodOpacity="0.16"
                  />
                </filter>
              </defs>

              <polygon points="0,0 250,170 0,320" fill="url(#env-left)" />
              <polygon points="500,0 250,170 500,320" fill="url(#env-right)" />
              <polygon
                points="0,320 250,152 500,320"
                fill="url(#env-bottom)"
                filter="url(#fold-shadow)"
              />

              <line x1="0" y1="320" x2="250" y2="152" stroke="#D5C7AE" strokeWidth="1" />
              <line x1="500" y1="320" x2="250" y2="152" stroke="#D5C7AE" strokeWidth="1" />
              <line
                x1="0"
                y1="0"
                x2="250"
                y2="170"
                stroke="#DDD1BC"
                strokeWidth="0.8"
                opacity="0.6"
              />
              <line
                x1="500"
                y1="0"
                x2="250"
                y2="170"
                stroke="#DDD1BC"
                strokeWidth="0.8"
                opacity="0.6"
              />
            </svg>

            {/* Top 3D Animated Flap */}
            <div
              className={`envelope-flap-3d pointer-events-none absolute inset-x-0 top-0 h-[58%] ${
                isCardRising
                  ? 'envelope-flap-open z-[5]'
                  : isFlapOpen
                    ? 'envelope-flap-open z-30'
                    : 'z-30'
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 500 186"
                preserveAspectRatio="none"
                className="h-full w-full drop-shadow-[0_10px_16px_rgba(10,18,38,0.22)]"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <defs>
                  <linearGradient id="env-top-flap" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FDFBF6" />
                    <stop offset="65%" stopColor="#F5EFE3" />
                    <stop offset="100%" stopColor="#EAE0CE" />
                  </linearGradient>
                </defs>
                <path
                  d="M 8 0 L 492 0 Q 500 0 496 7 L 260 176 Q 250 184 240 176 L 4 7 Q 0 0 8 0 Z"
                  fill="url(#env-top-flap)"
                  stroke="#DFD3BE"
                  strokeWidth="1"
                />
                <path
                  d="M 22 6 L 250 168 L 478 6"
                  fill="none"
                  stroke="#D8B36A"
                  strokeWidth="0.9"
                  opacity="0.45"
                />
              </svg>

              <svg
                aria-hidden="true"
                viewBox="0 0 500 186"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                style={{
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <path
                  d="M 8 0 L 492 0 Q 500 0 496 7 L 260 176 Q 250 184 240 176 L 4 7 Q 0 0 8 0 Z"
                  fill="#DFC286"
                />
              </svg>
            </div>

            {/* Central Wax Seal Button — Primary Interactive Trigger */}
            <div
              className={`absolute left-1/2 top-[53%] z-40 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isFlapOpen
                  ? 'pointer-events-none scale-75 opacity-0'
                  : 'scale-100 opacity-100'
              }`}
            >
              <button
                type="button"
                onClick={handleOpen}
                disabled={phase !== 'sealed'}
                aria-label="Ouvrir l'invitation du Repas Familial du 25 Décembre"
                className="wax-seal-btn group relative flex h-[68px] w-[68px] cursor-pointer items-center justify-center rounded-full text-[#FFF9EF] transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D391] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EDE1] sm:h-[86px] sm:w-[86px]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[5px] rounded-full border border-dashed border-[#FFE4C4]/75 sm:inset-[6px]"
                />
                <span className="relative flex flex-col items-center leading-none">
                  <span className="font-serif text-xl font-semibold italic tracking-tight text-[#FFF8EC] drop-shadow-[0_1px_2px_rgba(74,26,8,0.6)] sm:text-[1.75rem]">
                    25
                  </span>
                  <span className="mt-0.5 text-[8px] font-semibold tracking-[0.22em] text-[#FFE8CC] uppercase sm:text-[9px]">
                    Déc
                  </span>
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom prompt */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-1.5 sm:mt-14 sm:gap-2"
        >
          <button
            type="button"
            onClick={handleOpen}
            disabled={phase !== 'sealed'}
            className="group inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-base font-medium tracking-wide text-[#F7F2E7] transition-colors duration-200 hover:text-[#F1CB80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B96B] sm:text-lg"
          >
            <ChevronUp
              className="h-4 w-4 text-[#E5B96B] transition-transform duration-200 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
            <span>Tapez pour continuer</span>
          </button>
          <p className="max-w-xs text-xs leading-relaxed text-[#9BB0D1] sm:max-w-none">
            Appuyez sur le sceau central de l&apos;enveloppe pour ouvrir l&apos;invitation
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};
