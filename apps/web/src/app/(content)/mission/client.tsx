'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  Lock,
  Globe2,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Award,
} from 'lucide-react';

/* ─── counter hook ────────────────────────────────────── */

function useCountUp(target: number, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─── floating orb ────────────────────────────────────── */

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 10 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

/* ─── mission card ────────────────────────────────────── */

function MissionCard({
  icon: Icon,
  title,
  description,
  gradient,
  border,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  border: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border ${border} bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/8 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/6 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </motion.div>
  );
}

/* ─── commitment item ─────────────────────────────────── */

function CommitmentItem({ text, index }: { text: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3"
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
      <span className="text-sm leading-relaxed text-slate-300">{text}</span>
    </motion.li>
  );
}

/* ─── metric card ─────────────────────────────────────── */

function MetricCard({
  icon: Icon,
  target,
  suffix,
  label,
  gradient,
  index,
}: {
  icon: React.ElementType;
  target: number;
  suffix: string;
  label: string;
  gradient: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(target, 2000, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8"
    >
      <div
        className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p
        className={`text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {inView ? count.toLocaleString('tr-TR') : '0'}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-400">{label}</p>
    </motion.div>
  );
}

/* ─── main ────────────────────────────────────────────── */

export function MissionContent() {
  const missionCards = [
    {
      icon: Eye,
      title: 'Şeffaflık',
      description:
        'Her işlemi kayıt altına alarak alıcı ve satıcı arasında tam şeffaflık sağlamak. Fiyat geçmişi, ihale süreçleri ve tapu bilgileri açık erişimde tutulur.',
      gradient: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-500/20',
    },
    {
      icon: Lock,
      title: 'Güvenlik',
      description:
        '3D Secure ödeme altyapısı, kimlik doğrulama ve yasal çerçevede işlem garantisi. Tüm veriler şifreli kanallarla korunur, her adımda denetlenebilir.',
      gradient: 'from-blue-500 to-indigo-600',
      border: 'border-blue-500/20',
    },
    {
      icon: Globe2,
      title: 'Erişilebilirlik',
      description:
        'Her bütçeye uygun gayrimenkul fırsatları sunarak yatırımı demokratikleştirmek. Web, mobil ve tablet — her platformdan, her coğrafyadan kolay erişim.',
      gradient: 'from-violet-500 to-purple-700',
      border: 'border-violet-500/20',
    },
    {
      icon: Zap,
      title: 'İnovasyon',
      description:
        'Canlı ihale motoru, harita tabanlı arayüz, akıllı fiyat analizi ve bildirim sistemi ile sektörün en yenilikçi platformunu sunmak.',
      gradient: 'from-amber-500 to-orange-600',
      border: 'border-amber-500/20',
    },
  ];

  const commitments = [
    'Tüm işlemlerde yasal uyumluluk ve notere dayalı güvence',
    'Kişisel verilerin KVKK kapsamında korunması',
    '7/24 uzman danışman desteği ve rehberlik hizmeti',
    'Adil ve rekabetçi ihale ortamı, eşit fırsat ilkesi',
    'Şeffaf komisyon yapısı, gizli ücret yok',
    'Hızlı ve güvenilir tapu devir süreçleri',
  ];

  const metrics = [
    { icon: Users, target: 10000, suffix: '+', label: 'Kayıtlı Kullanıcı', gradient: 'from-cyan-400 to-blue-500' },
    { icon: Shield, target: 1200, suffix: '+', label: 'Başarılı Satış', gradient: 'from-emerald-400 to-teal-500' },
    { icon: TrendingUp, target: 5000, suffix: '+', label: 'Aktif İlan', gradient: 'from-violet-400 to-purple-500' },
    { icon: Award, target: 81, suffix: '', label: 'İl Kapsamı', gradient: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0918] text-white">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-28 pt-20 sm:px-6 lg:px-8">
        {/* grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(16,185,129,0.10),transparent)]" />

        <Orb className="right-[-8%] top-[-5%] h-[450px] w-[450px] bg-emerald-600/15" delay={0} />
        <Orb className="left-[-5%] bottom-[-10%] h-[350px] w-[350px] bg-teal-500/12" delay={3} />
        <Orb className="left-[40%] top-[30%] h-[300px] w-[300px] bg-cyan-600/10" delay={5} />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Misyonumuz
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            Gayrimenkul yatırımını
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              herkes için güvenli
            </span>
            <br />
            kılmak
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
          >
            Şeffaflık, güvenlik ve erişilebilirlik ilkeleri üzerine inşa edilmiş bir platform
            olarak, Türkiye&apos;nin her köşesinden vatandaşlara adil ve güvenilir yatırım
            fırsatları sunuyoruz.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/parcels"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]"
            >
              Arsaları Keşfet
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/8"
            >
              Hakkımızda
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION CARDS ────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-400"
            >
              <span className="h-px w-8 bg-emerald-400" />
              Temel İlkeler
              <span className="h-px w-8 bg-emerald-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl font-black sm:text-4xl"
            >
              Misyonumuzu taşıyan{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                dört sütun
              </span>
            </motion.h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {missionCards.map((card, i) => (
              <MissionCard key={card.title} {...card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMITMENTS ──────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/20 via-teal-900/15 to-slate-900/60 p-8 backdrop-blur-sm sm:p-10"
          >
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-3xl bg-gradient-to-b from-emerald-500 via-teal-500 to-transparent" />

            <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              <span className="h-px w-6 bg-emerald-400" />
              Taahhütlerimiz
            </div>
            <h2 className="mb-8 text-2xl font-black sm:text-3xl">
              Size verdiğimiz{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                söz
              </span>
            </h2>

            <ul className="space-y-4">
              {commitments.map((c, i) => (
                <CommitmentItem key={i} text={c} index={i} />
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS ──────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-400"
            >
              <span className="h-px w-8 bg-cyan-400" />
              Etkimiz
              <span className="h-px w-8 bg-cyan-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl font-black sm:text-4xl"
            >
              Rakamlarla{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                NetTapu
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {metrics.map((m, i) => (
              <MetricCard key={m.label} {...m} index={i} />
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
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/60 via-teal-900/50 to-slate-900/80 p-10 text-center backdrop-blur-sm sm:p-16"
          >
            <Orb className="left-[-10%] top-[-30%] h-[300px] w-[300px] bg-emerald-600/20" delay={0} />
            <Orb className="right-[-10%] bottom-[-20%] h-[250px] w-[250px] bg-teal-500/15" delay={3} />
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10" />

            <div className="relative">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
                Birlikte Güçlüyüz
              </p>
              <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
                Güvenilir gayrimenkul yatırımı için{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  bize katılın
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Türkiye&apos;nin dört bir yanındaki arsa fırsatlarını keşfedin ve
                güvenli ihale ortamında yerinizi alın.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/parcels"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(16,185,129,0.6)]"
                >
                  Arsaları Keşfet
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/8"
                >
                  Hakkımızda
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
