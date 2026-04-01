'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Cpu,
  Smartphone,
  Headphones,
  ArrowRight,
  Users,
  BarChart3,
  CheckCircle2,
  MapPin,
  ChevronRight,
} from 'lucide-react';

/* ─── helpers ─────────────────────────────────────────── */

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─── sub-components ──────────────────────────────────── */

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
      animate={{ y: [0, -24, 0], scale: [1, 1.06, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

function StatCard({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const numericTarget = parseInt(value.replace(/\D/g, ''), 10);
  const suffix = value.replace(/[\d.]/g, '');
  const animated = useCountUp(numericTarget, 2000, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <p className="relative bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-4xl font-black text-transparent">
        {inView ? animated.toLocaleString('tr-TR') : '0'}
        {suffix}
      </p>
      <p className="relative mt-2 text-sm font-medium text-slate-400">{label}</p>
    </motion.div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  description,
  gradient,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:shadow-[0_0_40px_rgba(99,102,241,0.12)]"
    >
      {/* glass shine */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/8 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </motion.div>
  );
}

function TeamCard({
  name,
  role,
  initials,
  gradient,
  index,
}: {
  name: string;
  role: string;
  initials: string;
  gradient: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8"
    >
      <div
        className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-2xl font-black text-white shadow-xl`}
      >
        {initials}
      </div>
      <p className="font-bold text-white">{name}</p>
      <p className="mt-1 text-sm text-slate-400">{role}</p>
    </motion.div>
  );
}

/* ─── main ────────────────────────────────────────────── */

export function AboutPageContent() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true });

  const stats = [
    { value: '10.000+', label: 'Kayıtlı Kullanıcı' },
    { value: '5.000+', label: 'Aktif İlan' },
    { value: '1.200+', label: 'Başarılı Satış' },
    { value: '81', label: 'İl Kapsamı' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Güvenilirlik',
      description:
        'Tüm işlemler yasal çerçevede, tam şeffaflıkla yürütülür. Notere dayalı tapu garantisi ile her adımda güvendeyiz.',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Cpu,
      title: 'Teknoloji',
      description:
        'Canlı ihale motoru, harita tabanlı arayüz ve gerçek zamanlı teklif sistemi ile sektörü dijital çağa taşıyoruz.',
      gradient: 'from-violet-500 to-purple-700',
    },
    {
      icon: Smartphone,
      title: 'Erişilebilirlik',
      description:
        'Web, iOS ve Android — her cihazdan sorunsuz erişim. Türkiye\'nin her köşesinden piyasaya ulaşın.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Headphones,
      title: 'Destek',
      description:
        '7/24 uzman danışman desteği ve rehberlik hizmeti. Sorularınız için her zaman yanınızdayız.',
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  const team = [
    { name: 'Ahmet Yılmaz', role: 'Kurucu & CEO', initials: 'AY', gradient: 'from-cyan-500 to-blue-600' },
    { name: 'Elif Kaya', role: 'CTO', initials: 'EK', gradient: 'from-violet-500 to-purple-700' },
    { name: 'Mehmet Demir', role: 'Hukuk Direktörü', initials: 'MD', gradient: 'from-emerald-500 to-teal-600' },
    { name: 'Zeynep Arslan', role: 'Ürün Yöneticisi', initials: 'ZA', gradient: 'from-rose-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0918] text-white">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        {/* background grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* orbs */}
        <FloatingOrb className="left-[-10%] top-[-5%] h-[500px] w-[500px] bg-violet-600/20" delay={0} />
        <FloatingOrb className="right-[-8%] top-[20%] h-[400px] w-[400px] bg-cyan-500/15" delay={2} />
        <FloatingOrb className="bottom-[-10%] left-[40%] h-[350px] w-[350px] bg-indigo-600/15" delay={4} />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Hakkımızda
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            Türkiye&apos;nin{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              en güvenilir
            </span>
            <br />
            gayrimenkul platformu
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
          >
            NetTapu, teknolojiyi ve şeffaflığı bir araya getirerek gayrimenkul alım-satımında
            yeni bir dönem başlatıyor. Canlı ihale sistemi, harita tabanlı arayüz ve güvenli
            ödeme altyapısı ile yatırımcıların yanındayız.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/parcels"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]"
            >
              Arsaları Keşfet
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/8"
            >
              Bize Ulaşın
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <StatCard key={s.label} value={s.value} label={s.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────── */}
      <section ref={storyRef} className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/6 to-white/2 p-8 backdrop-blur-sm sm:p-12"
          >
            {/* accent line */}
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-3xl bg-gradient-to-b from-cyan-500 via-violet-500 to-transparent" />

            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              <span className="h-px w-8 bg-cyan-400" />
              Hikayemiz
            </div>

            <blockquote className="mb-8 text-2xl font-light italic leading-relaxed text-slate-300 sm:text-3xl">
              &ldquo;Gayrimenkul yatırımı herkes için ulaşılabilir olmak zorunda —
              coğrafyadan, bütçeden ve bürokratik engelden bağımsız olarak.&rdquo;
            </blockquote>

            <div className="space-y-4 text-base leading-relaxed text-slate-400">
              <p>
                NetTapu, 2023 yılında Türkiye&apos;nin gayrimenkul piyasasındaki en büyük
                sorunu çözmek için kuruldu: güven eksikliği ve bilgi asimetrisi. Geleneksel
                yöntemlerle yürütülen arazi satışları, hem alıcı hem satıcı için belirsizlik
                yaratıyordu.
              </p>
              <p>
                Bugün 81 ilde aktif olan platformumuz, canlı ihale motoru, harita tabanlı
                arayüz ve yasal güvenceli tapu süreci ile Türkiye&apos;nin en şeffaf
                gayrimenkul ekosistemini sunuyor.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-violet-400"
            >
              <span className="h-px w-8 bg-violet-400" />
              Değerlerimiz
              <span className="h-px w-8 bg-violet-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-black sm:text-4xl"
            >
              Bizi farklı kılan{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                dört temel ilke
              </span>
            </motion.h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <ValueCard key={v.title} {...v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-400"
            >
              <span className="h-px w-8 bg-cyan-400" />
              Ekibimiz
              <span className="h-px w-8 bg-cyan-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-black sm:text-4xl"
            >
              Vizyonu hayata{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                geçirenler
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {team.map((member, i) => (
              <TeamCard key={member.name} {...member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/80 via-indigo-900/80 to-slate-900/80 p-10 text-center backdrop-blur-sm sm:p-16"
          >
            {/* orbs */}
            <FloatingOrb className="left-[-10%] top-[-20%] h-[300px] w-[300px] bg-violet-600/25" delay={0} />
            <FloatingOrb className="right-[-10%] bottom-[-20%] h-[250px] w-[250px] bg-cyan-500/20" delay={3} />
            {/* border */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10" />

            <div className="relative">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Hazır mısınız?
              </p>
              <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
                Gayrimenkul yatırımının{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  geleceğine
                </span>{' '}
                hoş geldiniz
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Türkiye&apos;nin dört bir yanındaki arsa fırsatlarını keşfedin,
                güvenli ihalede yerinizi alın.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/parcels"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]"
                >
                  Arsaları Keşfet
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <a
                  href="mailto:info@nettapu.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/8"
                >
                  info@nettapu.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
