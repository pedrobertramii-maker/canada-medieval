'use client';

import { useEffect, useRef } from 'react';

export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles: Array<{ x: number; y: number; r: number; vx: number; vy: number; life: number; max: number; color: string }> = [];
    const count = Math.min(45, Math.floor((w * h) / 28000));

    const colors = ['#E6B84F', '#FF7B00', '#D9534F', '#F5D77B'];

    function create() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.4 - 0.1,
        life: 0,
        max: Math.random() * 6000 + 4000,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }

    for (let i = 0; i < count; i++) particles.push(create());

    let raf = 0;
    function draw(ts: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life = ts;
        const fade = Math.max(0, 1 - p.life / p.max);
        ctx.globalAlpha = fade * 0.6;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.y < -10 || p.life > p.max) particles[i] = create();
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  );
}
