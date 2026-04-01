'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Gavel,
  MapPin,
  Shield,
  Users,
  ChevronRight,
  Star,
  Zap,
  Building2,
  TrendingUp,
  BarChart3,
  HeartHandshake,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

/* ─── helpers ─────────────────────────────────────── */

function useCountUp(target: number, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─── sub-components ────────────────────────────────── */

function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={{ y: [0, -20, 0], scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

function MetricCard({
  prefix,
  value,
  suffix,
  label,
  index,
}: {
  prefix?: string;
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const animated = useCountUp(value, 2200, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.07]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <p className="relative bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
        {prefix}
        {inView ? animated.toLocaleString('tr-TR') : '0'}
        {suffix}
      </p>
      <p className="relative mt-2 text-sm font-medium text-slate-400">{label}</p>
    </motion.div>
  );
}

function BentoCard({
  title,
  description,
  icon: Icon,
  gradient,
  large = false,
  href = '#',
  index,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  large?: boolean;
  href?: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.07] hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] ${large ? 'sm:col-span-2' : ''}`}
    >
      {/* Glass shine on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {/* Glow orb */}
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
      />

      <div className="relative">
        <div
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 transition-all duration-200 group-hover:gap-2 group-hover:text-indigo-300"
        >
          Keşfet <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

function CorporateLinkCard({
  icon: Icon,
  title,
  description,
  href,
  gradient,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  gradient: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className="group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.07] hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]"
      >
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white group-hover:text-indigo-300 transition-colors duration-200">
            {title}
          </p>
          <p className="mt-0.5 text-sm text-slate-500 group-hover:text-slate-400 transition-colors duration-200">
            {description}
          </p>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-indigo-400" />
      </Link>
    </motion.div>
  );
}

/* ─── main ─────────────────────────────────────────── */

export function KurumsalContent() {
  const heroRef = useRef(null);

  const metrics = [
    { prefix: '₺', value: 24, suffix: 'M+', label: 'İşlem Hacmi' },
    { prefix: '', value: 10000, suffix: '+', label: 'Aktif Kullanıcı' },
    { prefix: '', value: 500, suffix: '+', label: 'Tamamlanan İhale' },
    { prefix: '', value: 99, suffix: '.9%', label: 'Sistem Uptime' },
  ];

  const bentoItems = [
    {
      title: 'Canlı İhale Sistemi',
      description:
        'Gerçek zamanlı teklif motoru, deterministik sıralama ve yarış koşulu önleme altyapısıyla hukuken bağlayıcı canlı ihaleler.',
      icon: Gavel,
      gradient: 'from-indigo-500 to-violet-700',
      large: true,
      href: '/auctions',
    },
    {
      title: 'Arsa İlanları',
      description: "Türkiye'nin 81 ilinde binlerce arsa ve taşınmaz ilanı.",
      icon: MapPin,
      gradient: 'from-emerald-500 to-teal-600',
      href: '/parcels',
    },
    {
      title: 'Harita Arama',
      description: 'Konum tabanlı interaktif harita ile parsel sorgulama.',
      icon: Building2,
      gradient: 'from-cyan-500 to-blue-600',
      href: '/map',
    },
    {
      title: 'Güvenli Ödeme',
      description: 'PCI-DSS uyumlu sanal POS ve 3D Secure koruması.',
      icon: Shield,
      gradient: 'from-amber-500 to-orange-600',
      href: '/how-it-works',
    },
    {
      title: 'Danışmanlık',
      description: '7/24 uzman gayrimenkul danışmanlık hizmeti.',
      icon: HeartHandshake,
      gradient: 'from-rose-500 to-pink-600',
      href: '/contact',
    },
  ];

  const corporateLinks = [
    {
      icon: Users,
      title: 'Hakkımızda',
      description: 'NetTapu ekibi ve kuruluş hikayemiz',
      href: '/about',
      gradient: 'from-indigo-500 to-violet-600',
    },
    {
      icon: Star,
      title: 'Vizyon',
      description: "Gayrimenkulde Türkiye'nin en güvenilir platformu",
      href: '/vision',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Zap,
      title: 'Misyon',
      description: 'Şeffaf ve teknolojik gayrimenkul ekosistemi',
      href: '/mission',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Nasıl Çalışır',
      description: 'Platform işleyişi ve süreç adımları',
      href: '/how-it-works',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: BarChart3,
      title: 'Referanslar',
      description: 'Başarılı satışlar ve müşteri hikayeleri',
      href: '/references',
      gradient: 'from-violet-500 to-purple-700',
    },
    {
      icon: Building2,
      title: 'Projelerimiz',
      description: 'Aktif ve tamamlanan gayrimenkul projeleri',
      href: '/projects',
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  const avatarColors = [
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-700',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-500',
  ];

  return (
    <div className="min-h-screen bg-[#0a0918] text-white">
      {/* ── FULL-SCREEN DARK HERO ───────────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
      >
        {/* Animated mesh gradient background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 50%), radial-gradient(ellipse 70% 60% at 10% 90%, rgba(16,185,129,0.08) 0%, transparent 50%)',
          }}
        />

        {/* CSS grid dot pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Floating orbs */}
        <FloatingOrb
          className="left-[-8%] top-[10%] h-[520px] w-[520px] bg-violet-600/20"
          delay={0}
        />
        <FloatingOrb
          className="right-[-6%] top-[20%] h-[420px] w-[420px] bg-cyan-500/15"
          delay={2.5}
        />
        <FloatingOrb
          className="bottom-[5%] left-[35%] h-[380px] w-[380px] bg-indigo-600/15"
          delay={5}
        />
        <FloatingOrb
          className="right-[10%] bottom-[15%] h-[280px] w-[280px] bg-emerald-500/10"
          delay={3.5}
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-5 py-2 text-sm font-semibold text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
            </span>
            {"Türkiye'nin En Hızlı Büyüyen PropTech Firması"}
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            Gayrimenkulde{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Geleceği
            </span>
            <br />
            Bugün Yaşatıyoruz
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
          >
            NetTapu, canlı ihale motoru, harita tabanlı arama ve güvenli ödeme altyapısıyla
            Türkiye&apos;nin gayrimenkul ekosistemini yeniden tanımlıyor. Binlerce yatırımcının
            güvendiği platform.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/parcels"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]"
            >
              Platforma Giriş Yap
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <a
              href="#hizmetler"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.15] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06]"
            >
              Daha Fazla Öğren
            </a>
          </motion.div>

          {/* Social proof mini-bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.48 }}
            className="mt-10 inline-flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-6 py-3.5 backdrop-blur-sm"
          >
            {/* Avatar stack */}
            <div className="flex items-center">
              <div className="flex -space-x-2.5">
                {avatarColors.map((g, i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0a0918] bg-gradient-to-br ${g} text-xs font-bold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="ml-3 text-sm font-medium text-slate-300">
                10.000+ aktif yatırımcı
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm font-semibold text-slate-300">4.9/5</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-sm font-semibold text-slate-300">₺2.4M+ işlem</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 text-slate-600"
          >
            <span className="text-xs tracking-widest">Kaydır</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── METRICS ───────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {metrics.map((m, i) => (
              <MetricCard
                key={m.label}
                prefix={m.prefix}
                value={m.value}
                suffix={m.suffix}
                label={m.label}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO SERVICES GRID ───────────────────────── */}
      <section id="hizmetler" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-indigo-400"
            >
              <span className="h-px w-8 bg-indigo-400" />
              Hizmetlerimiz
              <span className="h-px w-8 bg-indigo-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-3xl font-extrabold sm:text-4xl"
            >
              Tek platformda{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                her şey
              </span>
            </motion.h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bentoItems.map((item, i) => (
              <BentoCard key={item.title} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CORPORATE LINKS ───────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-violet-400"
            >
              <span className="h-px w-8 bg-violet-400" />
              Kurumsal Bilgiler
              <span className="h-px w-8 bg-violet-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-3xl font-extrabold sm:text-4xl"
            >
              Bizi daha iyi{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                tanıyın
              </span>
            </motion.h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {corporateLinks.map((link, i) => (
              <CorporateLinkCard key={link.href} {...link} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────── */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 sm:p-12"
          >
            <div className="pointer-events-none absolute left-0 top-0 h-full w-1 rounded-l-3xl bg-gradient-to-b from-indigo-500 via-violet-500 to-transparent" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-xl font-light italic leading-relaxed text-slate-200 sm:text-2xl">
                &ldquo;NetTapu üzerinden katıldığım ilk ihalede arsamı aldım. Sistem son derece
                şeffaf, süreç hızlı ve güvenilirdi. Tekrar kullanacağım.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white">
                  MK
                </div>
                <div>
                  <p className="font-bold text-white">Murat Karahan</p>
                  <p className="text-sm text-slate-500">Gayrimenkul Yatırımcısı, İstanbul</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900 p-10 text-center sm:p-16"
          >
            <FloatingOrb
              className="left-[-8%] top-[-20%] h-[300px] w-[300px] bg-indigo-600/30"
              delay={0}
            />
            <FloatingOrb
              className="right-[-8%] bottom-[-15%] h-[250px] w-[250px] bg-cyan-500/20"
              delay={3}
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/[0.08]" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-300">
                Yatırıma Başlayın
              </p>
              <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
                Gayrimenkul yatırımının{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  geleceğine
                </span>{' '}
                hoş geldiniz
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Türkiye&apos;nin dört bir yanındaki arsa ve gayrimenkul fırsatlarını keşfedin.
                Canlı ihalede yerinizi alın.
              </p>
              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/parcels"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]"
                >
                  Arsaları Keşfet
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.2] px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/[0.06]"
                >
                  Bizimle İletişime Geçin
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
