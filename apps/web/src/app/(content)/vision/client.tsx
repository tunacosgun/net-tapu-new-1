'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Monitor,
  Globe2,
  Heart,
  ArrowRight,
  CheckCircle2,
  Circle,
} from 'lucide-react';

/* ─── particle field (CSS-only, no canvas) ────────────── */

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 6,
  opacity: Math.random() * 0.5 + 0.1,
}));

function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── word-by-word reveal ─────────────────────────────── */

function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.3em] inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/* ─── pillar card ─────────────────────────────────────── */

function PillarCard({
  number,
  icon: Icon,
  title,
  description,
  gradient,
  index,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(99,102,241,0.15)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/6 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* number */}
      <div
        className={`mb-5 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} px-3 py-1.5 text-xs font-black tracking-widest text-white shadow-lg`}
      >
        {number}
      </div>

      <div
        className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-xl`}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>

      <h3 className="mb-3 text-xl font-black text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </motion.div>
  );
}

/* ─── timeline ────────────────────────────────────────── */

const ROADMAP = [
  {
    year: '2024',
    label: 'Platform Lansmanı',
    detail: 'Canlı ihale motoru ve harita tabanlı arayüz',
    done: true,
  },
  {
    year: '2025',
    label: 'Mobil Uygulama',
    detail: 'iOS ve Android native uygulamalar',
    done: true,
  },
  {
    year: '2026',
    label: 'Uluslararası Açılım',
    detail: 'Çok dilli platform ve uluslararası ödemeler',
    done: false,
  },
  {
    year: '2030',
    label: 'Ekosistem Liderliği',
    detail: 'Bölgenin en büyük gayrimenkul ekosistemi',
    done: false,
  },
];

function Timeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative">
      {/* vertical line */}
      <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/30 to-transparent" />

      <div className="space-y-8">
        {ROADMAP.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex gap-6 pl-14"
          >
            {/* dot */}
            <div
              className={`absolute left-4 top-1 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 ${
                item.done
                  ? 'border-cyan-500 bg-cyan-500/30'
                  : 'border-slate-600 bg-slate-800'
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${item.done ? 'bg-cyan-400' : 'bg-slate-600'}`}
              />
            </div>

            <div
              className={`group rounded-2xl border p-5 transition-all duration-300 ${
                item.done
                  ? 'border-cyan-500/30 bg-cyan-500/8'
                  : 'border-white/8 bg-white/4 hover:border-white/15'
              }`}
              style={{ flex: 1 }}
            >
              <div className="mb-1 flex items-center gap-3">
                <span
                  className={`text-xs font-black tracking-widest ${
                    item.done ? 'text-cyan-400' : 'text-slate-500'
                  }`}
                >
                  {item.year}
                </span>
                {item.done && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Tamamlandı
                  </span>
                )}
              </div>
              <p className="font-bold text-white">{item.label}</p>
              <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── main ────────────────────────────────────────────── */

export function VisionContent() {
  const pillars = [
    {
      number: '01',
      icon: Monitor,
      title: 'Dijital Dönüşüm',
      description:
        'Gayrimenkul sektörünü geleneksel yöntemlerden kurtararak tamamen dijital ve şeffaf bir ekosistem oluşturmak. Yapay zeka destekli değerleme ve gerçek zamanlı piyasa analizi ile sektörü geleceğe taşımak.',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      number: '02',
      icon: Globe2,
      title: 'Küresel Erişim',
      description:
        'Türkiye gayrimenkul piyasasını uluslararası yatırımcılara açarak sınır ötesi yatırım imkanları sunmak. Çok dilli platform desteği ve uluslararası ödeme altyapısı ile küresel bir pazar yeri olmak.',
      gradient: 'from-violet-500 to-purple-700',
    },
    {
      number: '03',
      icon: Heart,
      title: 'Toplumsal Fayda',
      description:
        'Gayrimenkul yatırımını demokratikleştirerek her bütçeye uygun fırsatlar sunmak. Kırsal kalkınmayı destekleyen arazi projeleri ve sürdürülebilir şehircilik vizyonu ile topluma değer katmak.',
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0918] text-white">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-32 pt-20 sm:px-6 lg:px-8">
        {/* grid bg */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* radial overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />

        <ParticleField />

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            Vizyonumuz
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl font-black leading-none tracking-tight sm:text-7xl lg:text-8xl"
          >
            Vizyon
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              2030
            </span>
          </motion.h1>

          <WordReveal
            text="Türkiye'nin gayrimenkul ekosistemini dijitalleştirerek küresel sahneye taşımak ve her vatandaşa güvenli yatırım fırsatı sunmak."
            className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-slate-400"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/parcels"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_rgba(99,102,241,0.45)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(99,102,241,0.65)]"
            >
              Hemen Başla
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── PILLARS ──────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-400"
            >
              <span className="h-px w-8 bg-cyan-400" />
              Stratejik Sütunlar
              <span className="h-px w-8 bg-cyan-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl font-black sm:text-4xl"
            >
              Vizyonumuzu şekillendiren{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                üç temel güç
              </span>
            </motion.h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {pillars.map((p, i) => (
              <PillarCard key={p.title} {...p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-violet-400"
            >
              <span className="h-px w-8 bg-violet-400" />
              Yol Haritası
              <span className="h-px w-8 bg-violet-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl font-black sm:text-4xl"
            >
              2024&rsquo;ten{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                2030&rsquo;a
              </span>
            </motion.h2>
          </div>
          <Timeline />
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-slate-900/60 p-10 text-center backdrop-blur-sm sm:p-16"
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(139,92,246,0.15),transparent)]" />

            <div className="relative">
              <div className="mb-6 text-5xl text-violet-400">&ldquo;</div>
              <blockquote className="text-xl font-light italic leading-relaxed text-slate-300 sm:text-2xl lg:text-3xl">
                Teknoloji ve güven bir araya geldiğinde, gayrimenkul yatırımı
                coğrafyadan, bütçeden ve bürokratik engellerden bağımsız olarak
                herkes için erişilebilir hale gelir.
              </blockquote>
              <p className="mt-8 text-sm font-semibold tracking-widest text-violet-400">
                — NetTapu Kurucu Ekibi
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
