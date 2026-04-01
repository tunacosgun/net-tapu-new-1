'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Star, CheckCircle2, Quote, ArrowRight, Users, ThumbsUp, Award } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  initials: string;
  role: string;
  company: string;
  rating: number;
  quote: string;
  verified: boolean;
  gradient: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    initials: 'AY',
    role: 'Yatırımcı',
    company: 'Bireysel Yatırımcı',
    rating: 5,
    quote:
      'NetTapu sayesinde Ankara Gölbaşı\'nda harika bir arsa aldım. İhale süreci tamamen şeffaf ve hukuki güvence altındaydı. Danışmanlar tapu devrine kadar her adımda yanımdaydı. Kesinlikle tavsiye ederim.',
    verified: true,
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    id: 2,
    name: 'Fatma Kaya',
    initials: 'FK',
    role: 'Emlak Danışmanı',
    company: 'Kaya Gayrimenkul',
    rating: 5,
    quote:
      'Müşterilerimi NetTapu\'da gerçekleşen ihalelerle tanıştırdım ve sonuçtan son derece memnunum. Platform arayüzü kullanıcı dostu, teknik destek hızlı ve çözüm odaklı.',
    verified: true,
    gradient: 'from-violet-500 to-pink-500',
  },
  {
    id: 3,
    name: 'Mehmet Demir',
    initials: 'MD',
    role: 'Portföy Yöneticisi',
    company: 'Demir Holding',
    rating: 5,
    quote:
      'Kurumsal olarak birden fazla ihaleye katıldık. İhale sisteminin determinizmi ve güvenliği kurumsal ihtiyaçlarımızı tam karşılıyor. Ödeme altyapısı güçlü ve güvenilir.',
    verified: true,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 4,
    name: 'Zeynep Arslan',
    initials: 'ZA',
    role: 'Girişimci',
    company: 'ArslaN Yapı',
    rating: 5,
    quote:
      'İlk kez online ihaleye katıldım ve deneyim mükemmeldi. Canlı ihale ekranı rakip teklifleri anlık gösterdi. Depozito iadesi de sorunsuz gerçekleşti.',
    verified: true,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 5,
    name: 'Ali Öztürk',
    initials: 'AO',
    role: 'İnşaat Sektörü',
    company: 'Öztürk İnşaat A.Ş.',
    rating: 4,
    quote:
      'Türkiye\'nin farklı illerindeki arsaları tek platformdan inceleyip ihaleye girebilmek büyük avantaj. Harita entegrasyonu ve parsel sorgulama özelliği çok işlevsel.',
    verified: true,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 6,
    name: 'Elif Şahin',
    initials: 'EŞ',
    role: 'Avukat',
    company: 'Şahin Hukuk Bürosu',
    rating: 5,
    quote:
      'Hukuki perspektiften değerlendirdiğimde NetTapu\'nun ihale sözleşmeleri ve süreç kayıtları son derece titizlikle hazırlanmış. Müvekkillere güvenle tavsiye ediyorum.',
    verified: true,
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 7,
    name: 'Mustafa Çelik',
    initials: 'MÇ',
    role: 'Emekli',
    company: 'Bireysel Yatırımcı',
    rating: 5,
    quote:
      'Emekliliğimi değerlendirmek için arsa yatırımına yöneldim. NetTapu\'nun danışmanları beni adım adım yönlendirdi, tapu devri sorunsuz tamamlandı. Harika bir deneyim.',
    verified: true,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 8,
    name: 'Selin Koç',
    initials: 'SK',
    role: 'Fintech Girişimcisi',
    company: 'PropTech Ventures',
    rating: 5,
    quote:
      'NetTapu\'nun ödeme altyapısı ve güvenlik standartları fintech perspektifinden bakıldığında sektörün en iyilerinden. 3D Secure entegrasyonu ve PCI-DSS uyumu etkileyici.',
    verified: true,
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    id: 9,
    name: 'Hasan Yıldız',
    initials: 'HY',
    role: 'Çiftçi',
    company: 'Bireysel Yatırımcı',
    rating: 5,
    quote:
      'Köyümüze yakın tarım arazisi aradım. NetTapu\'da tam aradığımı buldum ve ihaleye girdim. Platform çok sade ve anlaşılır, teknik bilgim olmasa da kolayca kullandım.',
    verified: true,
    gradient: 'from-green-500 to-emerald-500',
  },
];

const SOCIAL_PROOF = [
  { icon: Users, value: '12.000+', label: 'Aktif Kullanıcı' },
  { icon: Star, value: '4.9/5', label: 'Ortalama Puan' },
  { icon: ThumbsUp, value: '%98', label: 'Memnuniyet Oranı' },
  { icon: Award, value: '2.400+', label: 'Tamamlanan İşlem' },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-white/15'}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05]"
    >
      {/* Quote icon */}
      <Quote className="absolute right-5 top-5 h-8 w-8 rotate-180 text-white/[0.04]" />

      {/* Stars */}
      <StarRating rating={testimonial.rating} />

      {/* Quote */}
      <p className="mt-4 text-sm leading-relaxed text-white/60">{testimonial.quote}</p>

      {/* Author */}
      <div className="mt-6 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.gradient} text-sm font-bold text-white shadow-lg`}
        >
          {testimonial.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-white">{testimonial.name}</span>
            {testimonial.verified && (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
            )}
          </div>
          <p className="truncate text-xs text-white/40">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const socialInView = useInView(socialRef, { once: true });

  const avgRating = (
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length
  ).toFixed(1);

  // Split into 3 columns for masonry
  const col1 = TESTIMONIALS.filter((_, i) => i % 3 === 0);
  const col2 = TESTIMONIALS.filter((_, i) => i % 3 === 1);
  const col3 = TESTIMONIALS.filter((_, i) => i % 3 === 2);

  return (
    <div className="min-h-screen bg-[#0a0918]">
      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden px-4 pb-16 pt-16 lg:px-8 lg:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-indigo-600/15 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5"
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              Müşteri Yorumları
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl"
          >
            Onlar{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Konuşsun
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base text-white/50"
          >
            Binlerce memnun müşterimizin gerçek deneyimleri ve değerlendirmeleri.
          </motion.p>

          {/* Average rating display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-8 flex max-w-xs flex-col items-center gap-2"
          >
            <div className="text-6xl font-black text-white">{avgRating}</div>
            <StarRating rating={5} size="lg" />
            <p className="text-sm text-white/40">{TESTIMONIALS.length} doğrulanmış yorum</p>
          </motion.div>
        </div>
      </div>

      {/* Social proof bar */}
      <div ref={socialRef} className="relative border-y border-white/[0.06] bg-white/[0.02] px-4 py-8 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
          {SOCIAL_PROOF.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={socialInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">{item.value}</div>
                <div className="text-xs text-white/40">{item.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Masonry testimonials grid */}
      <div className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Desktop: 3-column masonry */}
          <div className="hidden gap-4 md:grid md:grid-cols-3">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              {col1.map((t, i) => (
                <TestimonialCard key={t.id} testimonial={t} index={i * 3} />
              ))}
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-4 md:mt-8">
              {col2.map((t, i) => (
                <TestimonialCard key={t.id} testimonial={t} index={i * 3 + 1} />
              ))}
            </div>
            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              {col3.map((t, i) => (
                <TestimonialCard key={t.id} testimonial={t} index={i * 3 + 2} />
              ))}
            </div>
          </div>

          {/* Mobile: single column */}
          <div className="flex flex-col gap-4 md:hidden">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Rating distribution */}
      <div className="px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-xl"
          >
            <h3 className="mb-5 text-base font-semibold text-white">Puan Dağılımı</h3>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = TESTIMONIALS.filter((t) => t.rating === stars).length;
              const pct = Math.round((count / TESTIMONIALS.length) * 100);
              return (
                <div key={stars} className="mb-3 flex items-center gap-3 text-sm">
                  <span className="w-12 shrink-0 text-right text-white/50">{stars} ★</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-white/[0.06] h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: (5 - stars) * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
                    />
                  </div>
                  <span className="w-8 shrink-0 text-white/30">{count}</span>
                </div>
              );
            })}
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
            <div className="mx-auto mb-4 flex gap-1 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl font-extrabold text-white">Siz de Deneyimleyin</h2>
            <p className="mt-3 text-base text-white/50">
              12.000+ kullanıcının tercih ettiği platforma katılın ve fark yaratın.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/parcels"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105"
              >
                Arsaları Keşfet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/10"
              >
                Nasıl Çalışır?
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
