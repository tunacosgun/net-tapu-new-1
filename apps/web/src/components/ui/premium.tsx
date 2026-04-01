'use client';

import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

// ── Ease curves ───────────────────────────────────────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// ── AnimatedSection ───────────────────────────────────────────
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function AnimatedSection({ children, delay = 0, direction = 'up', className }: AnimatedSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const initial = {
    opacity: 0,
    y: direction === 'up' ? 32 : direction === 'down' ? -32 : 0,
    x: direction === 'left' ? 32 : direction === 'right' ? -32 : 0,
    filter: 'blur(4px)',
  };

  const animate = inView
    ? { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }
    : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.65, ease: EASE_OUT_EXPO, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── GradientText ──────────────────────────────────────────────
export function GradientText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-navy-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

// ── GlassCard ─────────────────────────────────────────────────
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = true, glow = false, onClick }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] shadow-glass ${glow ? 'shadow-glow-sm' : ''} ${hover ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { y: -4, scale: 1.005 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Top sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </motion.div>
  );
}

// ── PremiumBadge ──────────────────────────────────────────────
export function PremiumBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-sm text-sm font-medium text-white/80 ${className}`}>
      {children}
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────
interface SectionHeaderProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export function SectionHeader({ badge, title, subtitle, center = true, light = false }: SectionHeaderProps) {
  return (
    <AnimatedSection className={`mb-16 ${center ? 'text-center' : ''}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase ${light ? 'bg-navy-50 text-navy-600 border border-navy-100' : 'bg-white/[0.06] border border-white/[0.12] text-navy-300'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${light ? 'bg-navy-500' : 'bg-navy-400'}`} />
          {badge}
        </div>
      )}
      <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] ${light ? 'text-slate-900' : 'text-white'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-lg leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-slate-500' : 'text-white/50'}`}>
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  );
}

// ── AnimatedCounter ───────────────────────────────────────────
export function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(value);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('tr-TR')}{suffix}
    </span>
  );
}

// ── FloatingOrb ───────────────────────────────────────────────
export function FloatingOrb({ size = 400, color = '#4f46e5', opacity = 0.15, blur = 80, className = '' }: {
  size?: number; color?: string; opacity?: number; blur?: number; className?: string;
}) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}

// ── PrimaryButton ─────────────────────────────────────────────
interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'ghost' | 'outline';
  className?: string;
  icon?: React.ReactNode;
}

export function PremiumButton({ children, href, onClick, size = 'md', variant = 'primary', className = '', icon }: ButtonProps) {
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-navy-600 to-violet-600 text-white shadow-glow-sm hover:shadow-glow-md hover:from-navy-500 hover:to-violet-500',
    ghost: 'bg-white/[0.06] text-white border border-white/[0.12] hover:bg-white/[0.1] hover:border-white/20',
    outline: 'bg-transparent border-2 border-navy-500 text-navy-400 hover:bg-navy-500 hover:text-white',
  };

  const cls = `inline-flex items-center gap-2.5 rounded-xl font-semibold transition-all duration-200 ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link href={href} className={cls}>{children}{icon}</Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={cls}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}{icon}
    </motion.button>
  );
}

// ── DarkSection ───────────────────────────────────────────────
export function DarkSection({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section
      id={id}
      className={`relative py-24 sm:py-32 overflow-hidden bg-[#0a0918] ${className}`}
    >
      {children}
    </section>
  );
}

// ── LightSection ──────────────────────────────────────────────
export function LightSection({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section
      id={id}
      className={`relative py-24 sm:py-32 overflow-hidden bg-white ${className}`}
    >
      {children}
    </section>
  );
}

// ── Container ─────────────────────────────────────────────────
export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

// ── MetricCard ────────────────────────────────────────────────
interface MetricProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
  light?: boolean;
}

export function MetricCard({ value, suffix = '', prefix = '', label, delay = 0, light = false }: MetricProps) {
  return (
    <AnimatedSection delay={delay} className="text-center">
      <div className={`text-5xl sm:text-6xl font-black tracking-tight ${light ? 'text-slate-900' : 'text-white'}`}>
        <GradientText>
          <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
        </GradientText>
      </div>
      <p className={`mt-2 text-sm font-medium uppercase tracking-widest ${light ? 'text-slate-500' : 'text-white/40'}`}>
        {label}
      </p>
    </AnimatedSection>
  );
}

// ── PremiumHero ───────────────────────────────────────────────
interface PremiumHeroProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  cta?: { label: string; href: string };
  cta2?: { label: string; href: string };
  gradient?: string;
}

export function PremiumHero({ badge, title, subtitle, cta, cta2 }: PremiumHeroProps) {
  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-[#0a0918]">
      {/* Background effects */}
      <FloatingOrb size={600} color="#4f46e5" opacity={0.12} blur={120} className="top-[-100px] left-[-100px]" />
      <FloatingOrb size={400} color="#7c3aed" opacity={0.1} blur={100} className="bottom-[-50px] right-[-50px]" />
      <FloatingOrb size={300} color="#06b6d4" opacity={0.06} blur={80} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <Container className="relative z-10 py-24 sm:py-32">
        <div className="max-w-4xl">
          {badge && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <PremiumBadge className="mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-navy-400 animate-pulse" />
                {badge}
              </PremiumBadge>
            </motion.div>
          )}

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.1 }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              className="mt-6 text-xl text-white/50 leading-relaxed max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {subtitle}
            </motion.p>
          )}

          {(cta || cta2) && (
            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              {cta && <PremiumButton href={cta.href} size="lg">{cta.label}</PremiumButton>}
              {cta2 && <PremiumButton href={cta2.href} size="lg" variant="ghost">{cta2.label}</PremiumButton>}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}
