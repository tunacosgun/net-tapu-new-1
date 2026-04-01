'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  ArrowRight,
  X,
  BookOpen,
  TrendingUp,
  FileText,
  Gavel,
  Scale,
  Receipt,
  Banknote,
  Star,
  Mail,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

/* ─── types ─────────────────────────────────────────── */

interface Article {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  authorInitials: string;
  authorGradient: string;
  featured?: boolean;
  featuredGradient?: string;
}

/* ─── constants ─────────────────────────────────────── */

const CATEGORIES = [
  { id: 'all', label: 'Tümü', icon: BookOpen },
  { id: 'arsa-yatirimi', label: 'Arsa Yatırımı', icon: TrendingUp },
  { id: 'tapu-islemleri', label: 'Tapu İşlemleri', icon: FileText },
  { id: 'ihale-rehberi', label: 'İhale Rehberi', icon: Gavel },
  { id: 'hukuki-bilgiler', label: 'Hukuki Bilgiler', icon: Scale },
  { id: 'vergi', label: 'Vergi', icon: Receipt },
  { id: 'finansman', label: 'Finansman', icon: Banknote },
];

const ARTICLES: Article[] = [
  {
    id: 1,
    slug: 'arsa-yatiriminda-dikkat-edilmesi-gerekenler',
    category: 'arsa-yatirimi',
    title: 'Arsa Yatırımında Dikkat Edilmesi Gerekenler',
    excerpt:
      'Konum analizi, imar durumu sorgulaması, altyapı koşulları ve hukuki kısıtlamalardan oluşan kapsamlı yatırım kontrol listesi.',
    readTime: '8 dk',
    author: 'Ahmet Yılmaz',
    authorInitials: 'AY',
    authorGradient: 'from-indigo-500 to-violet-600',
    featured: true,
    featuredGradient: 'from-indigo-900 via-violet-900 to-slate-900',
  },
  {
    id: 2,
    slug: 'tapu-devir-islemleri-adim-adim-rehber',
    category: 'tapu-islemleri',
    title: 'Tapu Devir İşlemleri: Adım Adım Rehber',
    excerpt:
      'Randevu almaktan tapu senetinin teslim alınmasına kadar tapu devir sürecinin tüm adımları ve gerekli belgeler.',
    readTime: '6 dk',
    author: 'Elif Kaya',
    authorInitials: 'EK',
    authorGradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 3,
    slug: 'online-ihaleye-nasil-katilirsiniz',
    category: 'ihale-rehberi',
    title: 'Online İhaleye Nasıl Katılırsınız?',
    excerpt:
      'NetTapu canlı ihale sistemine kayıt, depozito yatırma ve gerçek zamanlı teklif verme adımlarını öğrenin.',
    readTime: '5 dk',
    author: 'Mehmet Demir',
    authorInitials: 'MD',
    authorGradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 4,
    slug: 'imar-durumu-nedir-nasil-sorgulanir',
    category: 'hukuki-bilgiler',
    title: 'İmar Durumu Nedir, Nasıl Sorgulanır?',
    excerpt:
      'Belediye imar planı, KAKS-TAKS hesaplamaları ve e-Devlet üzerinden parsel sorgulama yöntemlerinin tam kılavuzu.',
    readTime: '7 dk',
    author: 'Zeynep Arslan',
    authorInitials: 'ZA',
    authorGradient: 'from-rose-500 to-pink-600',
  },
  {
    id: 5,
    slug: 'arsa-aliminda-vergi-yukumlulukleri',
    category: 'vergi',
    title: 'Arsa Alımında Vergi Yükümlülükleri',
    excerpt:
      'Tapu harcı, KDV istisnası, emlak vergisi ve değer artış kazancı vergisi hakkında bilmeniz gereken her şey.',
    readTime: '9 dk',
    author: 'Can Öztürk',
    authorInitials: 'CO',
    authorGradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 6,
    slug: 'tapu-senedi-vs-tapu-kaydi-farklar',
    category: 'tapu-islemleri',
    title: 'Tapu Senedi vs Tapu Kaydı: Farklar',
    excerpt:
      'Tapu senedi ve tapu sicil kaydı arasındaki hukuki ayrım, hangi belgede ne tür bilgilerin yer aldığı.',
    readTime: '4 dk',
    author: 'Elif Kaya',
    authorInitials: 'EK',
    authorGradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 7,
    slug: 'depozito-sistemi-nasil-calisir',
    category: 'ihale-rehberi',
    title: 'Depozito Sistemi Nasıl Çalışır?',
    excerpt:
      'İhale teminatının hesaplanması, ödeme süreci, iade koşulları ve kazanan teklif için depozito mahsubu.',
    readTime: '5 dk',
    author: 'Mehmet Demir',
    authorInitials: 'MD',
    authorGradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 8,
    slug: 'tarim-arazisi-yatirimi-rehberi',
    category: 'arsa-yatirimi',
    title: 'Tarım Arazisi Yatırımı Rehberi',
    excerpt:
      'Tarım arazisi alımında yasal kısıtlamalar, yabancı uyruklu alıcılar için özel koşullar ve yatırım potansiyeli analizi.',
    readTime: '10 dk',
    author: 'Ahmet Yılmaz',
    authorInitials: 'AY',
    authorGradient: 'from-indigo-500 to-violet-600',
  },
];

const POPULAR_ARTICLES = ARTICLES.slice(0, 5);

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'arsa-yatirimi': TrendingUp,
  'tapu-islemleri': FileText,
  'ihale-rehberi': Gavel,
  'hukuki-bilgiler': Scale,
  vergi: Receipt,
  finansman: Banknote,
};

/* ─── sub-components ────────────────────────────────── */

function CategoryBadge({ category }: { category: string }) {
  const cat = CATEGORIES.find((c) => c.id === category);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
      {cat?.label ?? category}
    </span>
  );
}

function FeaturedCard({ article, onOpen }: { article: Article; onOpen: (a: Article) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onClick={() => onOpen(article)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${article.featuredGradient ?? 'from-indigo-900 to-slate-900'} p-8 sm:p-10`}
    >
      {/* background orbs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-300">
            Öne Çıkan
          </span>
          <CategoryBadge category={article.category} />
        </div>
        <h3 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
          {article.title}
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-300/80">
          {article.excerpt}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${article.authorGradient} text-xs font-bold text-white`}
            >
              {article.authorInitials}
            </div>
            <span className="text-sm text-slate-400">{article.author}</span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-sm text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime} okuma
            </span>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-indigo-400 transition-all duration-200 group-hover:gap-2">
            Okumaya Devam <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ArticleCard({
  article,
  index,
  onOpen,
}: {
  article: Article;
  index: number;
  onOpen: (a: Article) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onClick={() => onOpen(article)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.07] hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]"
    >
      <div className="flex flex-1 flex-col p-6">
        <CategoryBadge category={article.category} />
        <h3 className="mt-3 text-base font-bold leading-snug text-white group-hover:text-indigo-300 transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-4">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${article.authorGradient} text-xs font-bold text-white`}
          >
            {article.authorInitials}
          </div>
          <span className="text-xs text-slate-500">{article.author}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            {article.readTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-h-[90vh] overflow-y-auto rounded-t-3xl bg-[#0f0e20] sm:max-w-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#0f0e20]/90 px-6 py-4 backdrop-blur-sm">
          <CategoryBadge category={article.category} />
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold leading-tight text-white">{article.title}</h2>
          <div className="mt-3 flex items-center gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${article.authorGradient} text-xs font-bold text-white`}
            >
              {article.authorInitials}
            </div>
            <span className="text-sm text-slate-400">{article.author}</span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime} okuma
            </span>
          </div>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
            <p>{article.excerpt}</p>
            <p>
              Bu makalede {article.title.toLowerCase()} konusunu tüm detaylarıyla ele alıyoruz.
              Türkiye&apos;nin gayrimenkul piyasasında bilinçli karar vermek için ihtiyacınız olan
              temel bilgileri, yasal çerçeveyi ve pratik ipuçlarını bulabilirsiniz.
            </p>
            <p className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-indigo-200">
              Bu makalenin tam içeriği yakında yayınlanacaktır. NetTapu gayrimenkul rehberine
              abone olarak yeni makalelerden haberdar olabilirsiniz.
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href="/parcels"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50"
            >
              Arsaları İncele
            </Link>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/[0.06] transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── main ─────────────────────────────────────────── */

export function RealEstateGuideContent() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featured = ARTICLES.find((a) => a.featured);

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => {
      const matchCat = activeCategory === 'all' || a.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ =
        !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
      return matchCat && matchQ && !a.featured;
    });
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0918] text-white">
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 top-20 h-60 w-60 rounded-full bg-cyan-500/15 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Gayrimenkul Rehberi
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Gayrimenkul{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Rehberi
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base text-slate-400 sm:text-lg"
          >
            Arsa yatırımı, tapu işlemleri, ihale rehberi ve daha fazlası. Bilinçli bir yatırımcı
            olmak için ihtiyacınız olan tüm bilgiler.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-8 max-w-xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Makale ara..."
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.05] py-4 pl-11 pr-10 text-sm text-white placeholder-white/30 backdrop-blur-xl outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY PILLS ────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0a0918]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'border border-white/[0.08] bg-white/[0.03] text-white/50 hover:bg-white/[0.07] hover:text-white/80'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:flex lg:gap-10">
          {/* Main */}
          <div className="min-w-0 flex-1">
            {/* Featured article */}
            {featured && !query && activeCategory === 'all' && (
              <div className="mb-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                  Öne Çıkan Makale
                </p>
                <FeaturedCard article={featured} onOpen={setSelectedArticle} />
              </div>
            )}

            {/* Articles grid */}
            {filtered.length === 0 && query ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <Search className="mx-auto mb-4 h-12 w-12 text-white/15" />
                <p className="text-white/40">
                  &ldquo;{query}&rdquo; için sonuç bulunamadı.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-4 text-sm text-indigo-400 hover:underline"
                >
                  Aramayı temizle
                </button>
              </motion.div>
            ) : (
              <>
                {(query || activeCategory !== 'all') && (
                  <p className="mb-4 text-xs text-slate-500">
                    {filtered.length} makale bulundu
                  </p>
                )}
                <motion.div
                  layout
                  className="grid gap-5 sm:grid-cols-2"
                >
                  <AnimatePresence mode="popLayout">
                    {filtered.map((article, i) => (
                      <motion.div
                        key={article.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.22 }}
                      >
                        <ArticleCard
                          article={article}
                          index={i}
                          onOpen={setSelectedArticle}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="mt-12 lg:mt-0 lg:w-64 lg:shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Popular articles */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  <p className="text-sm font-bold text-white">Popüler Makaleler</p>
                </div>
                <div className="space-y-3">
                  {POPULAR_ARTICLES.map((article, i) => {
                    const CatIcon = CATEGORY_ICON_MAP[article.category] ?? FileText;
                    return (
                      <button
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="group flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white/[0.04]"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/20 text-xs font-bold text-indigo-400">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold leading-snug text-slate-300 group-hover:text-white transition-colors line-clamp-2">
                            {article.title}
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                            <CatIcon className="h-3 w-3" />
                            {CATEGORIES.find((c) => c.id === article.category)?.label}
                          </div>
                        </div>
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categories */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm">
                <p className="mb-3 text-sm font-bold text-white">Kategoriler</p>
                <div className="space-y-1">
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                    const count = ARTICLES.filter((a) => a.category === cat.id).length;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                          activeCategory === cat.id
                            ? 'bg-indigo-500/15 text-indigo-300'
                            : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5" />
                          {cat.label}
                        </span>
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-slate-500">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/60 to-violet-900/40 p-5">
                <p className="text-sm font-bold text-white">İhaleye Hazır mısınız?</p>
                <p className="mt-1 text-xs text-slate-400">
                  Türkiye genelindeki arsa ihalelerini keşfedin.
                </p>
                <Link
                  href="/auctions"
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50"
                >
                  İhaleleri Gör <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── NEWSLETTER CTA ────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-900/60 to-indigo-900/50 p-8 text-center sm:p-12"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-violet-600/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/[0.06]" />

            <div className="relative">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                <Mail className="h-6 w-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Yeni Makalelerden Haberdar Olun
              </h2>
              <p className="mt-3 text-slate-400">
                Gayrimenkul rehberi yazılarımız ve ihale duyurularını haftalık bültenimizle alın.
                İstediğinizde aboneliğinizi iptal edebilirsiniz.
              </p>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-400"
                >
                  Abone oldunuz! Teşekkürler.
                </motion.div>
              ) : (
                <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta adresiniz"
                    className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 backdrop-blur-sm outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    onClick={() => {
                      if (email.includes('@')) setSubscribed(true);
                    }}
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 whitespace-nowrap"
                  >
                    Abone Ol
                  </button>
                </div>
              )}
              <p className="mt-3 text-xs text-slate-600">
                Spam göndermiyoruz. Verileriniz KVKK kapsamında korunmaktadır.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
