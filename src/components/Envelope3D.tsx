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
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 42 });
  const [isHovering, setIsHovering] = useState(false);
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

    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 42 });
    setPhase('opening');

    const t1 = window.setTimeout(() => {
      setPhase('rising');
    }, 480);

    const t2 = window.setTimeout(() => {
      onOpenComplete();
    }, 1220);

    timersRef.current.push(t1, t2);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || phase !== 'sealed' || e.pointerType === 'touch') {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const x = nx - 0.5;
    const y = ny - 0.5;

    setIsHovering(true);
    setTilt({
      rotateX: Number((-y * 14).toFixed(2)),
      rotateY: Number((x * 16).toFixed(2)),
      glareX: Number((nx * 100).toFixed(1)),
      glareY: Number((ny * 100).toFixed(1)),
    });
  };

  const handlePointerLeave = () => {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 42 });
  };

  const isFlapOpen = phase === 'opening' || phase === 'rising';
  const isCardRising = phase === 'rising';

  // Dynamic floor shadow offsets opposite the 3D tilt for physical realism
  const shadowOffsetX = -tilt.rotateY * 1.1;
  const shadowOffsetY = tilt.rotateX * 0.7;

  return (
    <motion.section
      aria-label="Enveloppe d'invitation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.04, y: -16 }}
      transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12"
    >
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        {/* Calligraphic invitation header */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="font-script text-[1.9rem] leading-tight text-[#F3D08E] sm:text-[2.45rem]"
        >
          {EVENT_DETAILS.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.54, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
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
          initial={{ opacity: 0, scale: 0.9, y: 24, rotateX: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.78, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="envelope-scene relative mt-8 w-full max-w-[335px] sm:mt-11 sm:max-w-[460px] md:max-w-[500px]"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className={phase === 'sealed' ? 'envelope-float-3d' : ''}>
            {/* Physical dynamic 3D ground shadow */}
            <div
              aria-hidden="true"
              className="pointer-events-none mx-auto h-9 w-[86%] rounded-full bg-black/60 blur-2xl transition-transform duration-300 ease-out sm:h-10"
              style={{
                position: 'absolute',
                bottom: '-26px',
                left: '7%',
                zIndex: 0,
                transform: `translate3d(${shadowOffsetX}px, ${shadowOffsetY}px, -40px) scale(${
                  isCardRising ? 1.08 : isHovering ? 1.04 : 1
                })`,
              }}
            />

            {/* Subtle champagne-cyan halo behind the 3D envelope */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 rounded-2xl opacity-55 blur-2xl transition-opacity duration-500"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(246, 206, 118, 0.24) 0%, rgba(56, 232, 255, 0.14) 55%, transparent 78%)',
                transform: 'translateZ(-24px)',
              }}
            />

            <div
              className="envelope-body-3d relative aspect-[1.56/1] w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: isCardRising
                  ? 'rotateX(6deg) rotateY(0deg) translateY(10px) scale(1.03)'
                  : isFlapOpen
                    ? 'rotateX(3deg) rotateY(0deg) scale(1.01)'
                    : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              }}
            >
              {/* Envelope Back Wall (Z = 0) */}
              <div
                className="absolute inset-0 overflow-hidden rounded-xl border border-[#E5D9C3]/85 shadow-[0_32px_68px_-16px_rgba(3,8,20,0.82)]"
                style={{
                  background:
                    'linear-gradient(160deg, #EAE2D2 0%, #D9CEB8 55%, #CCBFA5 100%)',
                  transform: 'translateZ(0px)',
                }}
              >
                {/* Inner gold foil frame visible when flap opens */}
                <div className="absolute inset-2.5 rounded-lg border border-[#C8A15A]/45 sm:inset-3" />
              </div>

              {/* Inner Invitation Card Sliding Out in 3D (Z = 8px -> 30px) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[6%] bottom-[8%] z-10 rounded-lg border border-[#DFC48C]/85 bg-[#FFFDF9] px-4 py-3 text-center shadow-[0_18px_40px_rgba(8,16,36,0.36)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 sm:py-5"
                style={{
                  height: '82%',
                  transform: isCardRising
                    ? 'translate3d(0, -54%, 30px) rotateX(-5deg) scale(1.04)'
                    : isFlapOpen
                      ? 'translate3d(0, -16%, 12px)'
                      : 'translate3d(0, 0%, 6px)',
                  opacity: isFlapOpen ? 1 : 0.94,
                }}
              >
                <div className="flex h-full flex-col items-center justify-center border border-[#E5C88F]/65 px-2.5 py-2 sm:px-3">
                  <span className="text-[9px] font-semibold tracking-[0.22em] text-[#9A6E2A] uppercase sm:text-[10px]">
                    Repas familial
                  </span>
                  <p className="mt-0.5 font-serif text-lg font-semibold text-[#112244] sm:mt-1 sm:text-2xl">
                    25 décembre · 13h00
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-[#526280] tabular-nums sm:mt-1 sm:text-xs">
                    {EVENT_DETAILS.contributionLabel}
                  </p>
                </div>
              </div>

              {/* Front Left, Right & Bottom Paper Folds (Z = 14px) */}
              <svg
                aria-hidden="true"
                viewBox="0 0 500 320"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-hidden rounded-xl"
                style={{ transform: 'translateZ(14px)' }}
              >
                <defs>
                  <linearGradient id="env-left" x1="0%" y1="0%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#F9F4EC" />
                    <stop offset="100%" stopColor="#EAE0CF" />
                  </linearGradient>
                  <linearGradient id="env-right" x1="100%" y1="0%" x2="0%" y2="50%">
                    <stop offset="0%" stopColor="#F5EFE5" />
                    <stop offset="100%" stopColor="#E4D9C7" />
                  </linearGradient>
                  <linearGradient id="env-bottom" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#FCF8F1" />
                    <stop offset="80%" stopColor="#F1E8DA" />
                    <stop offset="100%" stopColor="#E5DBC5" />
                  </linearGradient>
                  <filter id="fold-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow
                      dx="0"
                      dy="-2"
                      stdDeviation="4"
                      floodColor="#101E3A"
                      floodOpacity="0.18"
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
                  opacity="0.65"
                />
                <line
                  x1="500"
                  y1="0"
                  x2="250"
                  y2="170"
                  stroke="#DDD1BC"
                  strokeWidth="0.8"
                  opacity="0.65"
                />
              </svg>

              {/* Dynamic 3D Specular Sheen Overlay across Envelope Surface */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[25] rounded-xl transition-opacity duration-300"
                style={{
                  transform: 'translateZ(15px)',
                  opacity: phase === 'sealed' ? (isHovering ? 0.65 : 0.25) : 0,
                  background: `radial-gradient(circle 220px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 250, 236, 0.55) 0%, rgba(246, 206, 118, 0.14) 38%, transparent 72%)`,
                  mixBlendMode: 'soft-light',
                }}
              />

              {/* Top 3D Animated Flap (Z = 18px) */}
              <div
                className={`envelope-flap-3d pointer-events-none absolute inset-x-0 top-0 h-[58%] ${
                  isCardRising
                    ? 'envelope-flap-open z-[5]'
                    : isFlapOpen
                      ? 'envelope-flap-open z-30'
                      : 'envelope-flap-closed z-30'
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 500 186"
                  preserveAspectRatio="none"
                  className="h-full w-full drop-shadow-[0_12px_18px_rgba(10,18,38,0.26)]"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <defs>
                    <linearGradient id="env-top-flap" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#FDFBF6" />
                      <stop offset="65%" stopColor="#F5EFE3" />
                      <stop offset="100%" stopColor="#E9DFCC" />
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
                    strokeWidth="1"
                    opacity="0.52"
                  />
                </svg>

                {/* Metallic champagne-gold inner lining revealed when flap flips in 3D */}
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
                  <defs>
                    <linearGradient id="env-inner-foil" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F0D494" />
                      <stop offset="50%" stopColor="#D9B162" />
                      <stop offset="100%" stopColor="#C49644" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 8 0 L 492 0 Q 500 0 496 7 L 260 176 Q 250 184 240 176 L 4 7 Q 0 0 8 0 Z"
                    fill="url(#env-inner-foil)"
                  />
                </svg>
              </div>

              {/* Golden 3D Ripple Ring when seal opens */}
              {isFlapOpen && (
                <span
                  aria-hidden="true"
                  className="seal-burst-ring pointer-events-none absolute left-1/2 top-[53%] z-40 h-20 w-20 rounded-full border-2 border-[#F6CE76]"
                />
              )}

              {/* Central Wax Seal Button Floating in 3D (Z = 32px) */}
              <div
                className={`absolute left-1/2 top-[53%] z-40 transition-all duration-300 ${
                  isFlapOpen
                    ? 'pointer-events-none scale-125 opacity-0'
                    : 'scale-100 opacity-100'
                }`}
                style={{ transform: 'translate(-50%, -50%) translateZ(32px)' }}
              >
                <button
                  type="button"
                  onClick={handleOpen}
                  disabled={phase !== 'sealed'}
                  aria-label="Ouvrir l'invitation au repas familial du 25 décembre"
                  className="wax-seal-btn group relative flex h-[68px] w-[68px] cursor-pointer items-center justify-center rounded-full text-[#FFF9EF] transition-transform duration-200 ease-out hover:scale-108 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D391] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EDE1] sm:h-[86px] sm:w-[86px]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[5px] rounded-full border border-dashed border-[#FFE4C4]/80 sm:inset-[6px]"
                  />
                  <span className="relative flex flex-col items-center leading-none">
                    <span className="font-serif text-xl font-semibold italic tracking-tight text-[#FFF8EC] drop-shadow-[0_1px_2px_rgba(74,26,8,0.6)] sm:text-[1.75rem]">
                      25
                    </span>
                    <span className="mt-0.5 text-[8px] font-semibold tracking-[0.22em] text-[#FFE8CC] uppercase sm:text-[9px]">
                      déc.
                    </span>
                  </span>
                </button>
              </div>
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
            <span>Tapes pour ouvrir</span>
          </button>
          <p className="max-w-xs text-xs leading-relaxed text-[#9BB0D1] sm:max-w-none">
            Appuies sur le sceau central de l&apos;enveloppe pour ouvrir
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};
