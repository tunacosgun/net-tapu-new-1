'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'genel', label: 'Genel' },
  { id: 'odeme', label: 'Ödeme' },
  { id: 'ihale', label: 'İhale' },
  { id: 'tapu', label: 'Tapu' },
  { id: 'guvenlik', label: 'Güvenlik' },
  { id: 'depozito', label: 'Depozito' },
];

const FAQ_DATA = [
  {
    id: 1,
    category: 'genel',
    question: 'NetTapu nedir ve nasıl çalışır?',
    answer:
      'NetTapu, Türkiye genelindeki arsa ve gayrimenkul ilanlarını yayınlayan, aynı zamanda gerçek zamanlı online ihale sistemi sunan bir gayrimenkul teknoloji platformudur. Kullanıcılar harita tabanlı arayüzden ilanları inceleyebilir, teklif verebilir veya canlı ihalelere katılabilir. Tüm süreç dijital, şeffaf ve yasal güvence altındadır.',
  },
  {
    id: 2,
    category: 'genel',
    question: "NetTapu'ya üye olmak ücretsiz mi?",
    answer:
      'Evet, NetTapu platformuna üyelik tamamen ücretsizdir. İlanları incelemek, harita üzerinde konumları görmek ve genel bilgilere erişmek için herhangi bir ücret alınmaz. Yalnızca ihaleye katılmak için depozito yatırmanız gerekmektedir; bu tutar ihaleyi kaybetmeniz halinde iade edilir.',
  },
  {
    id: 3,
    category: 'genel',
    question: 'Hangi şehirlerde ilanlar mevcut?',
    answer:
      "NetTapu, Türkiye'nin 81 ilinde faaliyet göstermektedir. İstanbul, Ankara, İzmir, Bursa, Antalya gibi büyükşehirlerin yanı sıra yatırım potansiyeli yüksek küçük şehirlerdeki ilanlar da platformda yer almaktadır. Harita üzerinden dilediğiniz bölgeyi yakınlaştırarak o bölgedeki ilanları görüntüleyebilirsiniz.",
  },
  {
    id: 4,
    category: 'genel',
    question: 'İlan sahibi olarak mülkümü nasıl yayınlayabilirim?',
    answer:
      'Mülkünüzü yayınlamak için kurumsal hesap başvurusu yapmanız veya danışman ekibimizle iletişime geçmeniz gerekmektedir. Gayrimenkul sahipleri ve portföy yöneticileri için özel çözümler sunulmaktadır. Başvurunuzun değerlendirilmesinin ardından ilan oluşturma ve ihale konfigürasyonu konusunda destek alabilirsiniz.',
  },
  {
    id: 5,
    category: 'ihale',
    question: 'Canlı ihaleye nasıl katılabilirim?',
    answer:
      "Canlı ihaleye katılmak için önce NetTapu'ya üye olmanız, ardından ilgili ihale sayfasından depozito bedelini güvenli ödeme sistemiyle yatırmanız gerekmektedir. Depozito onaylandıktan sonra ihale başlangıç saatinde sisteme giriş yaparak tekliflerinizi gerçek zamanlı olarak iletebilirsiniz. İhale süresince rakip teklifler anlık olarak ekranınızda güncellenir.",
  },
  {
    id: 6,
    category: 'ihale',
    question: 'İhale sırasında bağlantım kesilirse ne olur?',
    answer:
      'İhale sistemi, anlık bağlantı kesintilerine karşı tasarlanmıştır. Son vermiş olduğunuz teklif geçerliliğini korur. Bağlantınız kesildiğinde sayfayı yenilediğinizde mevcut durumu görebilirsiniz. Kesinlikle bir teklifiniz kaybolmaz; sistem tüm teklifleri sunucu tarafında güvenle saklar.',
  },
  {
    id: 7,
    category: 'ihale',
    question: 'İhaleyi kazandıktan sonra ne kadar sürem var?',
    answer:
      'İhaleyi kazandıktan sonra size özel ödeme sayfasına yönlendirilirsiniz. Yasal düzenlemeler gereği ihale bedelinin tamamını veya belirlenen kaparo tutarını genellikle 3 iş günü içinde yatırmanız beklenir. Süre ve koşullar her ihale için önceden ilan sayfasında açıkça belirtilmektedir.',
  },
  {
    id: 8,
    category: 'ihale',
    question: 'Minimum teklif artışı ne kadardır?',
    answer:
      "Minimum teklif artış miktarı her ihale için ayrı ayrı belirlenir ve ihale sayfasında açıkça gösterilir. Genellikle muhammen bedelin %1'i ile %5'i arasında değişmektedir. Belirlenen minimum artışın altında teklif sisteme kabul edilmez; bu sayede ihale süreci düzenli ve adil biçimde yürütülür.",
  },
  {
    id: 9,
    category: 'odeme',
    question: 'Hangi ödeme yöntemleri kabul edilmektedir?',
    answer:
      'NetTapu üzerinde kredi kartı, banka kartı ve sanal kart ile ödeme yapabilirsiniz. Tüm kartlar için 3D Secure doğrulaması zorunludur. Yüksek tutarlı işlemler için EFT/havale ile ödeme seçeneği de sunulmaktadır. Taksitli ödeme imkanı belirli ilanlar ve banka anlaşmalarımız kapsamında geçerlidir.',
  },
  {
    id: 10,
    category: 'odeme',
    question: 'Ödeme bilgilerim güvende mi?',
    answer:
      "Tüm ödeme işlemleri PCI-DSS uyumlu sanal POS altyapısı üzerinden gerçekleştirilir. Kart bilgileriniz hiçbir zaman NetTapu sunucularında saklanmaz; doğrudan ödeme sağlayıcısının şifreli ortamına iletilir. SSL/TLS şifrelemesi ve 3D Secure protokolü ile tam koruma altındasınız.",
  },
  {
    id: 11,
    category: 'depozito',
    question: 'Depozito nedir ve ne kadar tutmaktadır?',
    answer:
      "Depozito (teminat), ihaleye katılımınızı teyit etmek amacıyla önceden yatırdığınız güvence bedelidir. Tutar, ihalenin toplam muhammen bedeline göre değişmekle birlikte genellikle %5 ile %20 arasında belirlenmektedir. Her ihale ilanında depozito tutarı açıkça belirtilmektedir.",
  },
  {
    id: 12,
    category: 'depozito',
    question: 'İhaleyi kazanamazsam depozitom iade edilir mi?',
    answer:
      'Evet, ihaleyi kazanamayan katılımcıların depozito bedelleri ihale bitiminden itibaren 3 iş günü içinde otomatik olarak iade edilir. İade, ödemeyi yaptığınız hesaba gerçekleştirilir. Herhangi bir kesinti uygulanmaz. Yalnızca ihaleyi kazanan taraf depozitosunu ödenmiş bedele mahsup ettirir.',
  },
  {
    id: 13,
    category: 'tapu',
    question: 'Tapu devri süreci nasıl işler?',
    answer:
      'İhale veya satın alma tamamlandıktan sonra NetTapu danışmanlık ekibi sizi telefonla arar ve süreç hakkında bilgi verir. Gerekli belgeler dijital olarak iletilir. Tapu müdürlüğündeki randevu organizasyonu tarafımızca yapılır. Satıcı ve alıcı belirlenen tarihte devir işlemini tamamlar.',
  },
  {
    id: 14,
    category: 'tapu',
    question: 'Ada ve parsel bilgilerini nasıl doğrulayabilirim?',
    answer:
      'Her arsa ilanı sayfasında TKGM (Tapu ve Kadastro Genel Müdürlüğü) parsel sorgulama bağlantısı yer almaktadır. Bu bağlantı aracılığıyla tapu sicil bilgilerini, imar durumunu ve ada/parsel numaralarını resmi devlet veri tabanından doğrulayabilirsiniz. Ayrıca e-Devlet üzerinden de parsel sorgulama yapabilirsiniz.',
  },
  {
    id: 15,
    category: 'guvenlik',
    question: 'Hesabımın güvenliğini nasıl artırabilirim?',
    answer:
      'Hesap güvenliğiniz için güçlü ve benzersiz bir parola kullanmanızı öneririz. Profil ayarlarından iki faktörlü doğrulamayı (2FA) etkinleştirebilirsiniz. Giriş yaptığınız her cihaz ve oturum bilgisi hesabınızda listelenir; şüpheli bir erişim görürseniz derhal destek ekibimizle iletişime geçin.',
  },
  {
    id: 16,
    category: 'guvenlik',
    question: 'Kişisel verilerim nasıl korunmaktadır?',
    answer:
      'NetTapu, KVKK (Kişisel Verilerin Korunması Kanunu) ve GDPR kapsamında veri koruma yükümlülüklerini yerine getirir. Verileriniz şifreli sunucularda saklanır, üçüncü taraflarla yasal zorunluluklar dışında paylaşılmaz. Açık rıza metni kapsamında hangi verilerinizin işlendiğini aydınlatma metnimizden inceleyebilirsiniz.',
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof FAQ_DATA)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border transition-all duration-200 ${
        isOpen
          ? 'border-indigo-500/30 bg-indigo-500/[0.05]'
          : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.12]'
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-semibold leading-snug text-white sm:text-base">{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="mt-0.5 shrink-0"
        >
          <ChevronDown
            className={`h-5 w-5 transition-colors ${isOpen ? 'text-indigo-400' : 'text-white/30'}`}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="border-t border-white/[0.06] px-6 pb-5 pt-4">
              <p className="text-sm leading-relaxed text-white/55">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqContent() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState<number | null>(1);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return FAQ_DATA.filter((f) => {
      const matchCat = activeCategory === 'all' || f.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0918]">
      {/* Hero */}
      <div className="relative overflow-hidden px-4 pb-16 pt-16 lg:px-8 lg:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-indigo-600/15 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5"
          >
            <HelpCircle className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-300">
              Yardım Merkezi
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl"
          >
            Sıkça Sorulan{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Sorular
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base text-white/50"
          >
            {FAQ_DATA.length} soru arasında arayın veya kategori seçerek filtreleyin
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
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Soru veya anahtar kelime ara..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] py-3.5 pl-11 pr-10 text-sm text-white placeholder-white/30 backdrop-blur-xl outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/30 hover:text-white/60"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category chips */}
      <div className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#0a0918]/90 px-4 py-4 backdrop-blur-xl lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'border border-white/[0.08] bg-white/[0.03] text-white/50 hover:bg-white/[0.07] hover:text-white/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ list */}
      <div className="px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <HelpCircle className="mx-auto mb-4 h-12 w-12 text-white/20" />
              <p className="text-white/40">
                {query ? `"${query}" için sonuç bulunamadı.` : 'Bu kategoride soru bulunamadı.'}
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 text-sm text-indigo-400 hover:underline"
              >
                Filtreleri temizle
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FAQItem
                      item={item}
                      isOpen={openId === item.id}
                      onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filtered.length > 0 && (
            <p className="mt-6 text-center text-xs text-white/25">
              {filtered.length} soru gösteriliyor
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-600/15 to-indigo-600/10 p-10 text-center backdrop-blur-xl"
        >
          <MessageSquare className="mx-auto mb-4 h-10 w-10 text-violet-400" />
          <h2 className="text-2xl font-bold text-white">Cevabını Bulamadın mı?</h2>
          <p className="mt-3 text-white/50">
            Danışman ekibimiz her gün 09:00–18:00 saatleri arasında sizi dinliyor.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105"
            >
              Bize Ulaşın
            </Link>
            <a
              href="tel:08509999999"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/10"
            >
              Ara: 0850 999 99 99
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
