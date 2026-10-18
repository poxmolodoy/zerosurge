import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
  pulseSpeed: number;
}

interface SynapsePulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

const COLORS = [
  { base: '#10B981', glow: 'rgba(16, 185, 129, 0.45)' }, // Emerald
  { base: '#06B6D4', glow: 'rgba(6, 182, 212, 0.45)' }, // Electric Cyan
  { base: '#34D399', glow: 'rgba(52, 211, 153, 0.45)' }, // Bright Emerald
  { base: '#38BDF8', glow: 'rgba(56, 189, 248, 0.45)' }, // Sky Cyan
];

export const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Accessibility: check reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      if (typeof ctx.setTransform === 'function') {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Dynamic particle count scaled for 60fps performance without mobile GPU exhaustion
    const isMobile = width < 768;
    const count = isMobile ? 25 : Math.min(80, Math.max(35, Math.floor((width * height) / 16000)));

    // Mouse coordinates for interactive repellent and electric beam (desktop fine pointer only)
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 160,
    };

    const handlePointerMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handlePointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Only attach interactive mouse repelling on desktop to keep mobile scrolling buttery smooth
    const hasFinePointer =
      !isMobile && typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(pointer: fine)').matches
        : !isMobile;

    if (hasFinePointer && typeof window !== 'undefined') {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      window.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    }

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const palette = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 1.5 + 1.8,
        color: palette.base,
        glowColor: palette.glow,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
      });
    }

    const pulses: SynapsePulse[] = [];
    const MAX_DIST = 145;
    let lastTime = performance.now();

    const loop = (time: number) => {
      if (document.hidden) return;

      const dt = Math.min((time - lastTime) / 16.667, 2);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Periodically trigger energy pulses between connected nodes
      if (pulses.length < 10 && Math.random() < 0.06) {
        const p1 = Math.floor(Math.random() * particles.length);
        const p2 = Math.floor(Math.random() * particles.length);
        if (p1 !== p2) {
          const dx = particles[p1].x - particles[p2].x;
          const dy = particles[p1].y - particles[p2].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            pulses.push({
              fromIdx: p1,
              toIdx: p2,
              progress: 0,
              speed: 0.016 + Math.random() * 0.018,
            });
          }
        }
      }

      // Draw Synapses (Lines between nearby nodes)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw connections to cursor
        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);

        if (distMouse < mouse.radius) {
          const alpha = (1 - distMouse / mouse.radius) * 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Smooth repellent wave
          const angle = Math.atan2(dyMouse, dxMouse);
          const force = (mouse.radius - distMouse) / mouse.radius;
          particles[i].x += Math.cos(angle) * force * 1.8;
          particles[i].y += Math.sin(angle) * force * 1.8;
        }
      }

      // Draw Energy Pulses (Luminescent sparks moving across synapses)
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pulse = pulses[k];
        pulse.progress += pulse.speed * dt;

        const p1 = particles[pulse.fromIdx];
        const p2 = particles[pulse.toIdx];

        if (pulse.progress >= 1 || !p1 || !p2) {
          pulses.splice(k, 1);
          continue;
        }

        const sparkX = p1.x + (p2.x - p1.x) * pulse.progress;
        const sparkY = p1.y + (p2.y - p1.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        if (!isMobile) {
          ctx.shadowColor = '#06B6D4';
          ctx.shadowBlur = 10;
        }
        ctx.fill();
        if (!isMobile) {
          ctx.shadowBlur = 0;
        }
      }

      // Update & Draw Nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Bounce gently off screen boundaries
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        p.pulsePhase += p.pulseSpeed * dt;
        const pulseScale = 1 + Math.sin(p.pulsePhase) * 0.3;
        const currentRadius = p.radius * pulseScale;

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      if (!prefersReducedMotion && !document.hidden) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    if (prefersReducedMotion) {
      loop(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(loop);
    }

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        lastTime = performance.now();
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      aria-hidden="true"
    />
  );
};
