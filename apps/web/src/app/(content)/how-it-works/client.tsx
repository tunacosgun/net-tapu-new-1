'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Search,
  FileText,
  Gavel,
  ShieldCheck,
  Home,
  Eye,
  Lock,
  Users,
  Scale,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Keşfedin',
    subtitle: 'Harita ile ilanları incele',
    description:
      'Türkiye genelindeki arsa ilanlarını interaktif harita üzerinden keşfedin. Şehir, ilçe, fiyat aralığı, metrekare ve imar durumuna göre gelişmiş filtrelerle arama yapın. Her ilan için konum, çevre analizi ve erişim bilgilerine anında ulaşın.',
    icon: Search,
    gradient: 'from-indigo-500 via-violet-500 to-purple-600',
    glow: 'shadow-indigo-500/30',
    tag: 'Ücretsiz Keşfet',
  },
  {
    number: '02',
    title: 'İnceleyin',
    subtitle: 'Detay sayfası, ada/parsel bilgileri',
    description:
      'Beğendiğiniz arsanın detay sayfasından tüm teknik bilgilere erişin: ada/parsel numaraları, imar durumu, tapu sicil kayıtları, fotoğraflar ve konum haritası. TKGM parsel sorgu bağlantısı ile resmi kayıtları doğrulayın.',
    icon: FileText,
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    glow: 'shadow-blue-500/30',
    tag: 'Detaylı Bilgi',
  },
  {
    number: '03',
    title: 'Teklif Verin',
    subtitle: 'İhaleye katıl, depozito yatır',
    description:
      'Doğrudan teklif verin veya açık artırma ilanlarına canlı olarak katılın. İhaleye girmek için güvenli ödeme sistemi üzerinden teminat bedelini yatırın. Gerçek zamanlı ihale ekranında rakiplerinizin tekliflerini anlık takip edin.',
    icon: Gavel,
    gradient: 'from-violet-500 via-purple-500 to-pink-500',
    glow: 'shadow-violet-500/30',
    tag: 'Canlı İhale',
  },
  {
    number: '04',
    title: 'Güvende Olun',
    subtitle: '3D Secure, şifreli kanallar',
    description:
      'Tüm finansal işlemler 3D Secure güvenlik protokolü ile korunur. Ödeme bilgileriniz PCI-DSS uyumlu şifreli kanallar üzerinden iletilir. İhale sürecinin her adımı kayıt altına alınır ve yasal güvence altındadır.',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/30',
    tag: '3D Secure',
  },
  {
    number: '05',
    title: 'Tapu İşlemleri',
    subtitle: 'Devir süreci',
    description:
      'İhaleyi kazandığınızda veya teklifiniz kabul edildiğinde, uzman danışman ekibimiz tapu devir sürecinde size adım adım rehberlik eder. Tüm yasal belgeler profesyonel olarak hazırlanır, devir işlemi sorunsuz tamamlanır.',
    icon: Home,
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    glow: 'shadow-amber-500/30',
    tag: 'Uzman Destek',
  },
];

const advantages = [
  {
    icon: Eye,
    title: 'Tam Şeffaflık',
    description:
      'Tüm teklifler, fiyatlar ve ihale sonuçları anlık olarak görüntülenir. Gizli ücret yoktur, her adım açık şekilde kayıt altına alınır.',
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: Lock,
    title: 'Güvenli Altyapı',
    description:
      'Banka düzeyinde şifreleme ve 3D Secure koruması. Tüm verileriniz SSL/TLS ile şifreli kanallardan aktarılır.',
    gradient: 'from-indigo-500/10 to-blue-500/10',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Users,
    title: 'Uzman Danışmanlar',
    description:
      'Deneyimli gayrimenkul ve hukuk danışmanları her aşamada yanınızda. Hafta içi 09:00-18:00 telefon desteği.',
    gradient: 'from-violet-500/10 to-purple-500/10',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    icon: Scale,
    title: 'Yasal Güvence',
    description:
      'Tüm işlemler Türk hukuku çerçevesinde yürütülür. İhale sözleşmeleri yasal geçerliliğe sahiptir.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
];

const stats = [
  { value: '2.400+', label: 'Tamamlanan Tapu İşlemi' },
  { value: '98%', label: 'Müşteri Memnuniyeti' },
  { value: '₺4.2 Mlr', label: 'Toplam İşlem Hacmi' },
  { value: '7/24', label: 'Platform Erişimi' },
];

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      className="relative flex gap-6 lg:gap-10"
    >
      {/* Number + connector */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
          className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg ${step.glow}`}
        >
          <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0a0918] ring-1 ring-white/10">
            <span className="text-[9px] font-bold text-white/60">{step.number}</span>
          </div>
        </motion.div>
        {index < steps.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ originY: 0 }}
            className="mt-3 h-12 w-px bg-gradient-to-b from-white/20 to-transparent"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-10">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`inline-block rounded-full bg-gradient-to-r ${step.gradient} px-3 py-0.5 text-[11px] font-semibold text-white`}
          >
            {step.tag}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white lg:text-2xl">{step.title}</h3>
        <p className="mt-0.5 text-sm font-medium text-white/40">{step.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/60 lg:text-base">{step.description}</p>
      </div>
    </motion.div>
  );
}

function AdvantageCard({ adv, index }: { adv: (typeof advantages)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = adv.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-2xl border ${adv.border} bg-gradient-to-br ${adv.gradient} p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]`}
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${adv.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative">
        <div
          className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] ${adv.iconColor}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-semibold text-white">{adv.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/50">{adv.description}</p>
      </div>
    </motion.div>
  );
}

export function HowItWorksContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div className="min-h-screen bg-[#0a0918]">
      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden px-4 pb-20 pt-16 lg:px-8 lg:pt-24">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[80px]" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5"
          >
            <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
              Platform Rehberi
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl"
          >
            5 Adımda{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Gayrimenkul
            </span>{' '}
            Yatırımı
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-white/50"
          >
            NetTapu ile arsa satın alma süreciniz tamamen dijital, güvenli ve şeffaf bir şekilde tamamlanır.
            Her adım tasarlanmış olup hukuki geçerliliğe sahiptir.
          </motion.p>
        </motion.div>
      </div>

      {/* Stats bar */}
      <div ref={statsRef} className="relative border-y border-white/[0.06] bg-white/[0.02] px-4 py-8 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl font-extrabold text-white lg:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="relative px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-bold text-white lg:text-4xl">Süreç Adımları</h2>
            <p className="mt-3 text-white/40">Her adım güvenli ve yasal çerçevede yürütülür</p>
          </motion.div>

          <div className="relative">
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Why NetTapu */}
      <div className="relative px-4 py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-violet-600/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white lg:text-4xl">
              Neden{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                NetTapu?
              </span>
            </h2>
            <p className="mt-3 text-white/40">
              Güvenli ve şeffaf gayrimenkul alışverişi için tercih edilme sebeplerimiz
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((adv, index) => (
              <AdvantageCard key={adv.title} adv={adv} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Checklist section */}
      <div className="relative px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl"
          >
            <h3 className="mb-6 text-xl font-bold text-white">Platform Garantileri</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Gerçek zamanlı ihale takibi',
                'Anlık teklif bildirimleri',
                'Yasal sözleşme güvencesi',
                'PCI-DSS uyumlu ödeme',
                'TKGM entegrasyonu',
                'Depozito iade garantisi',
                'Tapu devir danışmanlığı',
                'Çoklu cihaz desteği',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-sm text-white/60">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative px-4 py-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-600/10 p-10 text-center backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold text-white">Hemen Başlayın</h2>
            <p className="mt-3 text-base text-white/50">
              Türkiye genelindeki arsa ilanlarını keşfedin, fırsatları kaçırmayın.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/parcels"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 hover:shadow-indigo-500/50"
              >
                Arsaları Keşfet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/10"
              >
                Uzmanla Konuş
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
