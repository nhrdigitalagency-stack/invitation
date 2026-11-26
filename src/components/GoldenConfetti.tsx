import React, { useEffect, useRef } from 'react';

interface GoldenConfettiProps {
  burstKey: number;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  color: string;
  shimmerColor: string;
  shape: 'rect' | 'diamond' | 'ribbon';
  alpha: number;
  life: number;
  maxLife: number;
}

const GOLD_PALETTE: ReadonlyArray<{ base: string; shimmer: string }> = [
  { base: '#E5B96B', shimmer: '#FFF2C8' },
  { base: '#F4D28A', shimmer: '#FFF9E6' },
  { base: '#C8963E', shimmer: '#F5D692' },
  { base: '#FBF3DD', shimmer: '#FFFFFF' },
  { base: '#D99E46', shimmer: '#FCE4AC' },
];

export const GoldenConfetti: React.FC<GoldenConfettiProps> = ({ burstKey }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (burstKey <= 0) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = width < 640 ? 95 : 150;
    const pieces: ConfettiPiece[] = [];
    const shapes: Array<ConfettiPiece['shape']> = ['rect', 'ribbon', 'diamond'];

    // Dual celebratory golden cannons (left-bottom & right-bottom + gentle top shower)
    for (let i = 0; i < count; i++) {
      const palette = GOLD_PALETTE[i % GOLD_PALETTE.length];
      const mode = i % 3;
      let x = width * 0.5;
      let y = height * 0.45;
      let vx = 0;
      let vy = 0;

      if (mode === 0) {
        // Left angled cannon
        x = width * (0.12 + Math.random() * 0.14);
        y = height * (0.58 + Math.random() * 0.16);
        vx = 3.2 + Math.random() * 5.8;
        vy = -(8.5 + Math.random() * 7.5);
      } else if (mode === 1) {
        // Right angled cannon
        x = width * (0.74 + Math.random() * 0.14);
        y = height * (0.58 + Math.random() * 0.16);
        vx = -(3.2 + Math.random() * 5.8);
        vy = -(8.5 + Math.random() * 7.5);
      } else {
        // Center fountain & gentle top shimmer
        x = width * (0.2 + Math.random() * 0.6);
        y = -18 - Math.random() * 140;
        vx = (Math.random() - 0.5) * 3.4;
        vy = 1.8 + Math.random() * 3.2;
      }

      const shape = shapes[i % shapes.length];
      pieces.push({
        x,
        y,
        vx,
        vy,
        width: shape === 'ribbon' ? 4 + Math.random() * 3 : 6 + Math.random() * 6,
        height: shape === 'ribbon' ? 14 + Math.random() * 10 : 6 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.16,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: 0.06 + Math.random() * 0.1,
        color: palette.base,
        shimmerColor: palette.shimmer,
        shape,
        alpha: 1,
        life: 0,
        maxLife: 170 + Math.random() * 90,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      let aliveCount = 0;
      for (const p of pieces) {
        p.life += 1;
        p.vy += 0.17; // soft gravity
        p.vx *= 0.988; // air drag
        p.vy *= 0.992;
        p.x += p.vx + Math.sin(p.tiltAngle) * 0.85;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.tiltAngle += p.tiltSpeed;

        const fadeStart = p.maxLife * 0.7;
        if (p.life > fadeStart) {
          p.alpha = Math.max(0, 1 - (p.life - fadeStart) / (p.maxLife - fadeStart));
        }

        if (p.alpha <= 0.01 || p.y > window.innerHeight + 40) {
          continue;
        }

        aliveCount += 1;
        const flipScale = Math.cos(p.tiltAngle);
        const isGlinting = Math.abs(flipScale) < 0.3;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.max(0.18, Math.abs(flipScale)));
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = isGlinting ? p.shimmerColor : p.color;

        if (p.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -p.height * 0.55);
          ctx.lineTo(p.width * 0.55, 0);
          ctx.lineTo(0, p.height * 0.55);
          ctx.lineTo(-p.width * 0.55, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }

        ctx.restore();
      }

      if (aliveCount > 0) {
        animId = window.requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    animId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, [burstKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
};
