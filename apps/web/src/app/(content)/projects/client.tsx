'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  X,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
type Category = 'Tümü' | 'İhale' | 'Arsa Satışı' | 'Kentsel Dönüşüm' | 'Tarım Arazisi';
type Status = 'Tamamlandı' | 'Devam Ediyor';

interface Project {
  id: number;
  title: string;
  description: string;
  category: Exclude<Category, 'Tümü'>;
  status: Status;
  saleAmount: string;
  participants: number;
  duration: string;
  gradient: string;
  details: string;
  location: string;
  area: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Gebze Sanayi Arazisi İhalesi',
    description: 'Kocaeli Gebze\'de 45 dönüm sanayi vasfında arazi ihaleyle satışa sunuldu. Rekor katılımlı bir ihale süreci gerçekleşti.',
    category: 'İhale',
    status: 'Tamamlandı',
    saleAmount: '₺ 48.500.000',
    participants: 312,
    duration: '14 gün',
    gradient: 'from-indigo-600/30 via-violet-600/20 to-purple-800/30',
    details: 'Kocaeli Gebze Organize Sanayi Bölgesi yakınlarında konumlanan bu arazi, yoğun katılımlı açık artırma yöntemiyle satıldı. Toplam 312 kayıtlı katılımcı ile NetTapu tarihinin en kalabalık ihalesini oluşturdu.',
    location: 'Gebze, Kocaeli',
    area: '45 Dönüm',
  },
  {
    id: 2,
    title: 'Çanakkale Tarım Arazisi Paketi',
    description: 'Çanakkale Biga ilçesinde toplam 120 dönüm tarım arazisi parsel parsel satışa sunuldu.',
    category: 'Tarım Arazisi',
    status: 'Tamamlandı',
    saleAmount: '₺ 22.800.000',
    participants: 178,
    duration: '21 gün',
    gradient: 'from-emerald-600/30 via-teal-600/20 to-green-800/30',
    details: 'Çanakkale Biga ilçesinde sulama kanalına yakın konumlu 120 dönüm tarım arazisi, 8 ayrı parsel halinde ihaleye çıkarıldı. Tüm parseller belirlenen tavan fiyatın üzerinde alıcı buldu.',
    location: 'Biga, Çanakkale',
    area: '120 Dönüm',
  },
  {
    id: 3,
    title: 'İstanbul Avrupa Yakası Kentsel Dönüşüm',
    description: 'Bağcılar\'da riskli alan kapsamındaki yapıların yıkılıp yeniden inşası için arazi pazarlaması yapıldı.',
    category: 'Kentsel Dönüşüm',
    status: 'Devam Ediyor',
    saleAmount: '₺ 135.000.000',
    participants: 54,
    duration: '45+ gün',
    gradient: 'from-orange-600/30 via-amber-600/20 to-yellow-800/30',
    details: 'İstanbul Bağcılar\'da kentsel dönüşüm kapsamına alınan 3.200 m² arsa, geliştirici firmalar ile özel yatırımcılara yönelik kapalı teklif usulüyle pazarlanmaktadır. Proje devam etmektedir.',
    location: 'Bağcılar, İstanbul',
    area: '3.200 m²',
  },
  {
    id: 4,
    title: 'Antalya Turizm Bölgesi Arsaları',
    description: 'Antalya Döşemealtı\'nda turizm amaçlı kullanıma uygun 6 adet parsel ihale yöntemiyle satıldı.',
    category: 'Arsa Satışı',
    status: 'Tamamlandı',
    saleAmount: '₺ 67.200.000',
    participants: 241,
    duration: '30 gün',
    gradient: 'from-cyan-600/30 via-sky-600/20 to-blue-800/30',
    details: 'Antalya Döşemealtı\'nda turizm yatırımına uygun 6 parsel, toplam 241 katılımcıyla gerçekleşen açık artırma sürecinde alıcı buldu. Parsellerin tamamı beklenen fiyatın %40 üzerinde satıldı.',
    location: 'Döşemealtı, Antalya',
    area: '18.400 m²',
  },
  {
    id: 5,
    title: 'Konya Tarımsal Yatırım Projesi',
    description: 'Konya Karatay ilçesinde verimli tarım arazileri küçük yatırımcılara parsel parsel sunuldu.',
    category: 'Tarım Arazisi',
    status: 'Tamamlandı',
    saleAmount: '₺ 19.600.000',
    participants: 423,
    duration: '18 gün',
    gradient: 'from-lime-600/30 via-green-600/20 to-emerald-800/30',
    details: 'Konya Karatay\'da yer alan 200 dönüm tarım arazisi 50\'şer dönümlük 4 parsel halinde satışa çıkarıldı. Bireysel yatırımcıların yoğun ilgisiyle 18 günde tamamlandı.',
    location: 'Karatay, Konya',
    area: '200 Dönüm',
  },
  {
    id: 6,
    title: 'Bursa Organize Sanayi İhalesi',
    description: 'Bursa Nilüfer Organize Sanayi Bölgesi\'nde sanayi parselleri canlı ihale ile satışa sunuldu.',
    category: 'İhale',
    status: 'Devam Ediyor',
    saleAmount: '₺ 92.000.000',
    participants: 189,
    duration: '60+ gün',
    gradient: 'from-rose-600/30 via-pink-600/20 to-fuchsia-800/30',
    details: 'Bursa Nilüfer Organize Sanayi Bölgesi\'nde 12 adet sanayi parseli, NetTapu canlı ihale motoru aracılığıyla uluslararası yatırımcılara da açık şekilde pazarlanmaktadır. İhale devam etmektedir.',
    location: 'Nilüfer, Bursa',
    area: '34.600 m²',
  },
];

const CATEGORIES: Category[] = ['Tümü', 'İhale', 'Arsa Satışı', 'Kentsel Dönüşüm', 'Tarım Arazisi'];

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden"
      style={{ boxShadow: '0 0 0 0 rgba(99,102,241,0)' }}
      whileFocus={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.5)' }}
    >
      {/* Cover gradient */}
      <div className={`relative h-44 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)',
          }}
        />
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${project.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${project.id})`} />
        </svg>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
            {project.category}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${
              project.status === 'Tamamlandı'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
            }`}
          >
            {project.status === 'Tamamlandı' ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {project.status}
          </span>
        </div>

        {/* Location */}
        <div className="absolute bottom-4 left-4 text-xs text-white/60 font-medium">
          {project.location} · {project.area}
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-white/[0.04] flex items-center justify-center"
        >
          <span className="rounded-full border border-white/30 bg-black/30 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white">
            Detayları Gör
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-white text-base leading-snug group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-white/50 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Metrics */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 text-center">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-400 mx-auto mb-1" />
            <p className="text-[10px] text-white/40 mb-0.5">Satış</p>
            <p className="text-[11px] font-semibold text-white leading-tight">{project.saleAmount}</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 text-center">
            <Users className="h-3.5 w-3.5 text-violet-400 mx-auto mb-1" />
            <p className="text-[10px] text-white/40 mb-0.5">Katılımcı</p>
            <p className="text-[11px] font-semibold text-white">{project.participants}</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 text-center">
            <Calendar className="h-3.5 w-3.5 text-cyan-400 mx-auto mb-1" />
            <p className="text-[10px] text-white/40 mb-0.5">Süre</p>
            <p className="text-[11px] font-semibold text-white">{project.duration}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Project Modal ─────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-white/[0.08] bg-[#0e0d22] overflow-hidden"
      >
        {/* Cover */}
        <div className={`h-48 bg-gradient-to-br ${project.gradient} relative`}>
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
              {project.category}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${
                project.status === 'Tamamlandı'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
              }`}
            >
              {project.status === 'Tamamlandı' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {project.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-4 text-xs text-white/60">
            {project.location} · {project.area}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-white">{project.title}</h2>
          <p className="mt-3 text-sm text-white/60 leading-relaxed">{project.details}</p>

          {/* Metrics */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: <TrendingUp className="h-4 w-4 text-indigo-400" />, label: 'Satış Tutarı', value: project.saleAmount },
              { icon: <Users className="h-4 w-4 text-violet-400" />, label: 'Katılımcı', value: String(project.participants) },
              { icon: <Calendar className="h-4 w-4 text-cyan-400" />, label: 'Süre', value: project.duration },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3 text-center">
                <div className="flex justify-center mb-1.5">{m.icon}</div>
                <p className="text-[10px] text-white/40 mb-0.5">{m.label}</p>
                <p className="text-xs font-semibold text-white">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Link
              href="/parcels"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Mevcut Arsalara Bak
            </Link>
            <Link
              href="/auctions"
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 text-center text-sm font-semibold text-white hover:bg-white/[0.08] transition-colors"
            >
              İhalelere Katıl
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ProjectsContent() {
  const [activeCategory, setActiveCategory] = useState<Category>('Tümü');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered =
    activeCategory === 'Tümü'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  const completedCount = PROJECTS.filter((p) => p.status === 'Tamamlandı').length;
  const totalParticipants = PROJECTS.reduce((acc, p) => acc + p.participants, 0);

  return (
    <div className="min-h-screen bg-[#0a0918]">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-0 right-1/3 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px]" />

        <div className="relative px-4 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300 mb-6">
              <BarChart3 className="h-3 w-3" />
              {completedCount} Proje Tamamlandı
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Projelerimiz
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-base text-white/50">
              NetTapu aracılığıyla gerçekleştirilen başarılı arsa satışları ve ihale projeleri.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-6"
          >
            {[
              { label: 'Tamamlanan Proje', value: String(completedCount) },
              { label: 'Toplam Katılımcı', value: totalParticipants.toLocaleString('tr-TR') },
              { label: 'Devam Eden', value: String(PROJECTS.length - completedCount) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl px-6 py-4 text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24">
        {/* ── Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 flex flex-wrap gap-2 justify-center"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
                  style={{ zIndex: -1 }}
                />
              )}
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── Grid ── */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">
            Bu kategoride proje bulunmuyor.
          </div>
        )}

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-600/10 via-violet-600/8 to-cyan-600/5 backdrop-blur-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white">Siz de Yatırım Yapın</h2>
          <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">
            Arsaları inceleyin veya canlı ihaleye katılarak uygun fiyata arsa edinin.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/parcels"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Arsaları İncele
            </Link>
            <Link
              href="/auctions"
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.08] transition-colors"
            >
              İhalelere Katıl
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
