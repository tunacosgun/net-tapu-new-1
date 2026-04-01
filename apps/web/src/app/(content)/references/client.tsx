'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Building2, ArrowRight, Star, TrendingUp, Globe, ShieldCheck } from 'lucide-react';

const COMPANIES_ROW_A = [
  { name: 'Emlakjet', sector: 'Gayrimenkul' },
  { name: 'Sahibinden', sector: 'İlan Platformu' },
  { name: 'Halkbank', sector: 'Bankacılık' },
  { name: 'Ziraat Bankası', sector: 'Bankacılık' },
  { name: 'Garanti BBVA', sector: 'Bankacılık' },
  { name: 'Yapı Kredi', sector: 'Bankacılık' },
  { name: 'İş Bankası', sector: 'Bankacılık' },
  { name: 'QNB Finansbank', sector: 'Bankacılık' },
  { name: 'Albaraka', sector: 'Bankacılık' },
];

const COMPANIES_ROW_B = [
  { name: 'TEB', sector: 'Bankacılık' },
  { name: 'Kuveyt Türk', sector: 'Bankacılık' },
  { name: 'Vakıfbank', sector: 'Bankacılık' },
  { name: 'Hepsiburada', sector: 'E-Ticaret' },
  { name: 'Trendyol', sector: 'E-Ticaret' },
  { name: 'n11', sector: 'E-Ticaret' },
  { name: 'Gittigidiyor', sector: 'E-Ticaret' },
  { name: 'Amazon TR', sector: 'E-Ticaret' },
  { name: 'TKGM', sector: 'Kamu' },
];

const ALL_COMPANIES = [...COMPANIES_ROW_A, ...COMPANIES_ROW_B];

const PARTNER_ADVANTAGES = [
  {
    icon: TrendingUp,
    title: 'Büyüyen Ekosistem',
    description:
      'Her ay yüzlerce yeni ilan ve aktif ihale ile büyüyen platformumuzda markanız öne çıkar.',
    gradient: 'from-indigo-500/10 to-blue-500/10',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Globe,
    title: 'Ulusal Erişim',
    description:
      "Türkiye'nin 81 ilinde aktif kullanıcı kitlesiyle markanızı doğru hedef kitleye ulaştırın.",
    gradient: 'from-violet-500/10 to-purple-500/10',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    icon: ShieldCheck,
    title: 'Güvenilir Altyapı',
    description:
      'PCI-DSS uyumlu ödeme sistemleri ve kurumsal güvenlik standartları ile güçlü ortaklık.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Star,
    title: 'Prestijli Referans',
    description:
      "Türkiye'nin lider finans ve teknoloji markalarıyla birlikte anılan güvenilir bir ağın parçası olun.",
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
];

const STATS = [
  { value: '18+', label: 'İş Ortağı' },
  { value: '2.400+', label: 'Tamamlanan İşlem' },
  { value: '₺4.2 Mlr', label: 'İşlem Hacmi' },
  { value: '%98', label: 'Memnuniyet' },
];

function LogoBox({ company, delay = 0 }: { company: { name: string; sector: string }; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05 }}
      className="group flex min-w-[140px] flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.07]"
    >
      <Building2 className="h-5 w-5 text-white/20 transition-colors group-hover:text-indigo-400" />
      <span className="text-center text-sm font-semibold text-white/40 transition-colors group-hover:text-white">
        {company.name}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-white/20 transition-colors group-hover:text-indigo-400/70">
        {company.sector}
      </span>
    </motion.div>
  );
}

function MarqueeRow({
  companies,
  direction = 'left',
}: {
  companies: { name: string; sector: string }[];
  direction?: 'left' | 'right';
}) {
  // Duplicate for seamless loop
  const doubled = [...companies, ...companies];
  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#0a0918] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#0a0918] to-transparent" />

      <motion.div
        className="flex gap-4 py-2"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {doubled.map((company, i) => (
          <div key={`${company.name}-${i}`} className="shrink-0">
            <div className="group flex min-w-[150px] flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.07]">
              <Building2 className="h-4 w-4 text-white/20 transition-colors group-hover:text-indigo-400" />
              <span className="text-center text-sm font-semibold text-white/40 transition-colors group-hover:text-white">
                {company.name}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/20 transition-colors group-hover:text-indigo-400/70">
                {company.sector}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function ReferencesContent() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div className="min-h-screen bg-[#0a0918]">
      {/* Hero */}
      <div className="relative overflow-hidden px-4 pb-16 pt-16 lg:px-8 lg:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-violet-600/15 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5"
          >
            <Star className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
              Referanslar
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl"
          >
            Güvenilir Markalar{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Bize Güveniyor
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base text-white/50"
          >
            Türkiye'nin önde gelen finans, teknoloji ve gayrimenkul markalarıyla güçlü iş birlikleri kuruyoruz.
          </motion.p>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="relative border-y border-white/[0.06] bg-white/[0.02] px-4 py-8 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
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

      {/* Marquee logo wall */}
      <div className="relative py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-64 w-64 rounded-full bg-indigo-600/10 blur-[80px]" />
        </div>

        <div className="relative mx-auto mb-10 max-w-xl px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white lg:text-3xl"
          >
            İş Ortaklarımız
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-sm text-white/40"
          >
            Finans, teknoloji ve gayrimenkul sektörünün liderleriyle çalışıyoruz
          </motion.p>
        </div>

        <div className="space-y-4">
          <MarqueeRow companies={COMPANIES_ROW_A} direction="left" />
          <MarqueeRow companies={COMPANIES_ROW_B} direction="right" />
        </div>
      </div>

      {/* Full logo grid - static */}
      <div className="px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center text-xl font-bold text-white"
          >
            Tüm Ortaklarımız
          </motion.h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {ALL_COMPANIES.map((company, i) => (
              <LogoBox key={company.name} company={company} delay={i * 0.03} />
            ))}
          </div>
        </div>
      </div>

      {/* Case testimonial */}
      <div className="relative px-4 py-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-10 backdrop-blur-xl"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-[60px]" />
          <div className="relative">
            <div className="mb-6 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-xl font-medium leading-relaxed text-white/80 lg:text-2xl">
              &ldquo;NetTapu ile gerçekleştirdiğimiz ihale entegrasyonu, müşterilerimize sunduğumuz
              gayrimenkul deneyimini tamamen dönüştürdü. Platform güvenilirliği ve şeffaflığı
              açısından sektörde bir adım öne çıkıyor.&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">
                E
              </div>
              <div>
                <div className="font-semibold text-white">Emlakjet</div>
                <div className="text-sm text-white/40">Teknoloji Direktörü</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Partner advantages */}
      <div className="px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-white lg:text-3xl">
              Neden{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Ortağımız Olun?
              </span>
            </h2>
            <p className="mt-3 text-white/40">
              Güçlü iş birliğinin avantajlarını keşfedin
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_ADVANTAGES.map((adv, i) => {
              const Icon = adv.icon;
              return (
                <motion.div
                  key={adv.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl border ${adv.border} p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]`}
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
            })}
          </div>
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
            <h2 className="text-3xl font-extrabold text-white">İş Birliği Yapalım</h2>
            <p className="mt-3 text-base text-white/50">
              Sektörün en güvenilir gayrimenkul platformuyla ortaklık fırsatlarını değerlendirin.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105"
              >
                Başvuru Yapın
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
