import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, ExternalLink, Zap,
  Tag, MapPin, BadgeCheck, Eye, ArrowRight, X
} from 'lucide-react';

/* ─── Mock ad data ───────────────────────────────── */
/* Each ad has:
   id, title, subtitle, tag, cta (call-to-action label),
   link, shop, region, m_img (banner image from Cloudinary),
   accent (tailwind bg color for overlays), pill (badge label)
*/
const ADS = [
  {
    id: 1,
    title: 'Smartphone Pro Max X12',
    subtitle: 'L\'écran AMOLED 6,7" qui redéfinit le premium africain.',
    tag: 'Électronique',
    pill: '🔥 Offre limitée',
    cta: 'Voir le produit',
    link: '/product/1',
    shop: 'TechShop Douala',
    region: 'Littoral',
    price: '85 000 XAF',
    accent: 'from-green-900/80 via-green-800/60 to-transparent',
    m_img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&q=80',
  },
  {
    id: 2,
    title: 'Collection Mode Afrique',
    subtitle: 'Robes en coton local — élégance et authenticité réunies.',
    tag: 'Mode',
    pill: '✨ Nouveau',
    cta: 'Découvrir la collection',
    link: '/boutique/2',
    shop: 'Mode Afrique',
    region: 'Centre',
    price: 'Dès 12 500 XAF',
    accent: 'from-emerald-900/80 via-emerald-800/50 to-transparent',
    m_img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80',
  },
  {
    id: 3,
    title: 'Parfums Oud Prestige',
    subtitle: 'Senteurs orientales authentiques. Livrées partout au Cameroun.',
    tag: 'Beauté',
    pill: '🌹 Bestseller',
    cta: 'Commander maintenant',
    link: '/product/5',
    shop: 'Beauté Prestige',
    region: 'Ouest',
    price: '18 000 XAF',
    accent: 'from-teal-900/80 via-teal-800/50 to-transparent',
    m_img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    title: 'Déco Intérieure Yaoundé',
    subtitle: 'Meubles artisanaux en bois local. Pièces uniques, made in Cameroun.',
    tag: 'Maison',
    pill: '🪴 Local',
    cta: 'Explorer la boutique',
    link: '/boutique/4',
    shop: 'Déco Yaoundé',
    region: 'Centre',
    price: 'Dès 8 500 XAF',
    accent: 'from-green-900/80 via-green-700/50 to-transparent',
    m_img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80',
  },
  {
    id: 5,
    title: 'Laptop UltraSlim 14"',
    subtitle: 'Légèreté professionnelle. Puissance i7. Stock très limité.',
    tag: 'Électronique',
    pill: '⚡ Stock limité',
    cta: 'Voir l\'offre',
    link: '/product/9',
    shop: 'TechShop Douala',
    region: 'Littoral',
    price: '320 000 XAF',
    accent: 'from-slate-900/90 via-slate-800/60 to-transparent',
    m_img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80',
  },
];

/* Small ads (sidebar / grid cards) */
const SMALL_ADS = [
  { id: 10, title: 'Sneakers Urban Run', tag: 'Sport', price: '35 000 XAF', shop: 'SportZone CM', pill: 'Nouveau', m_img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', link: '/product/6' },
  { id: 11, title: 'Casque Studio Pro', tag: 'Audio', price: '22 000 XAF', shop: 'SoundHub',    pill: 'Hot',     m_img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', link: '/product/3' },
  { id: 12, title: 'Épices locales',     tag: 'Alimentation', price: '4 500 XAF',  shop: 'Cuisine & Saveurs', pill: 'Local', m_img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80', link: '/product/10' },
  { id: 13, title: 'Sac cuir artisanal', tag: 'Mode', price: '28 000 XAF', shop: 'Mode Afrique', pill: 'Sale',  m_img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80', link: '/product/8' },
];

/* ─── Pill badge ─────────────────────────────────── */
const Pill = ({ label, className = '' }) => (
  <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full ${className}`}>
    {label}
  </span>
);

/* ─── Hero Carousel ──────────────────────────────── */
const HeroCarousel = ({ ads }) => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = (n) => setIdx((n + ads.length) % ads.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % ads.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [paused, ads.length]);

  const ad = ads[idx];

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden select-none"
      style={{ aspectRatio: '16/7' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* background image with crossfade */}
      {ads.map((a, i) => (
        <div
          key={a.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <img
            src={a.m_img}
            alt={a.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${a.accent}`} />
        </div>
      ))}

      {/* content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Pill label={ad.pill} className="bg-white/15 border border-white/30 text-white backdrop-blur-sm" />
            <span className="text-white/70 text-xs font-medium border border-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              {ad.tag}
            </span>
          </div>
          <span className="text-white/60 text-[10px] flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
            <BadgeCheck size={10} className="text-emerald-400" /> Annonce officielle
          </span>
        </div>

        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-xl">
            {ad.title}
          </h2>
          <p className="text-white/80 text-sm sm:text-base mt-2 max-w-md leading-relaxed">
            {ad.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5">
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wider">À partir de</p>
              <p className="text-2xl font-black text-white leading-none mt-0.5">{ad.price}</p>
            </div>

            <a href={ad.link}
              className="flex items-center gap-2 bg-white text-green-800 font-bold text-sm px-6 py-3 rounded-2xl hover:bg-green-50 transition-all shadow-xl shadow-black/20 active:scale-[0.97]">
              {ad.cta} <ArrowRight size={15} />
            </a>

            <div className="text-white/60 text-xs flex items-center gap-1">
              <MapPin size={10} /> {ad.shop} • {ad.region}
            </div>
          </div>
        </div>
      </div>

      {/* arrows */}
      <button onClick={() => go(idx - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/25 hover:bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all z-20"
        aria-label="Précédent">
        <ChevronLeft size={18} />
      </button>
      <button onClick={() => go(idx + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/25 hover:bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all z-20"
        aria-label="Suivant">
        <ChevronRight size={18} />
      </button>

      {/* dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {ads.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full z-20">
          <div
            key={idx}
            className="h-full bg-green-400 rounded-full"
            style={{ animation: 'progress 5s linear forwards' }}
          />
        </div>
      )}

      <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
};

/* ─── Medium banner (wide rectangular) ──────────── */
const MediumBanner = ({ ad }) => (
  <a href={ad.link}
    className="group relative rounded-2xl overflow-hidden flex-shrink-0 block"
    style={{ aspectRatio: '3/1' }}>
    <img src={ad.m_img} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    <div className={`absolute inset-0 bg-gradient-to-r ${ad.accent}`} />
    <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
      <Pill label={ad.pill} className="bg-white/15 border border-white/30 text-white w-fit" />
      <div>
        <p className="text-white font-extrabold text-lg leading-tight">{ad.title}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-white font-bold text-sm">{ad.price}</span>
          <span className="text-white/60 text-xs">{ad.shop}</span>
        </div>
      </div>
    </div>
    <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-10">
      <ExternalLink size={13} />
    </div>
  </a>
);

/* ─── Small square card ──────────────────────────── */
const SmallCard = ({ ad }) => {
  const pillColors = {
    Nouveau: 'bg-emerald-500 text-white',
    Hot:     'bg-rose-500 text-white',
    Local:   'bg-green-700 text-white',
    Sale:    'bg-amber-400 text-white',
  };
  return (
    <a href={ad.link}
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 block">
      <div className="relative h-36 overflow-hidden">
        <img src={ad.m_img} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${pillColors[ad.pill] || 'bg-gray-500 text-white'}`}>
          {ad.pill}
        </span>
        <span className="absolute top-2.5 right-2.5 text-[9px] text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
          {ad.tag}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-800 text-sm truncate">{ad.title}</p>
        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 truncate">
          <MapPin size={9} /> {ad.shop}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-green-700 font-bold text-sm">{ad.price}</span>
          <span className="text-[10px] text-green-700 border border-green-200 hover:bg-green-600 hover:text-white px-2.5 py-1 rounded-lg transition-all font-medium">
            Voir
          </span>
        </div>
      </div>
    </a>
  );
};

/* ─── Inline strip banner ────────────────────────── */
const StripBanner = ({ ad }) => (
  <a href={ad.link}
    className="group relative w-full rounded-2xl overflow-hidden flex items-center block"
    style={{ height: '110px' }}>
    <img src={ad.m_img} alt={ad.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    <div className={`absolute inset-0 bg-gradient-to-r ${ad.accent}`} />
    <div className="relative z-10 px-6 flex items-center justify-between w-full">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Pill label={ad.pill} className="bg-white/20 border border-white/30 text-white" />
          <span className="text-white/60 text-[10px]">{ad.tag}</span>
        </div>
        <p className="text-white font-extrabold text-lg leading-tight">{ad.title}</p>
        <p className="text-white/70 text-xs mt-0.5">{ad.shop} • {ad.region}</p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-white font-black text-xl">{ad.price}</span>
        <span className="flex items-center gap-1.5 bg-white text-green-800 text-xs font-bold px-4 py-2 rounded-xl group-hover:bg-green-50 transition-colors shadow-lg">
          {ad.cta} <ArrowRight size={12} />
        </span>
      </div>
    </div>
  </a>
);

/* ─── Main Page ──────────────────────────────────── */
const AdsPage = () => {
  const [ads, setAds] = useState(ADS);
  const [smallAds, setSmallAds] = useState(SMALL_ADS);
  const [loading, setLoading] = useState(false);

  /* Uncomment to fetch from API:
  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5050/api/market/getads');
        const data = await res.json();
        setAds(data.featured || ADS);
        setSmallAds(data.cards || SMALL_ADS);
      } catch { } finally { setLoading(false); }
    };
    fetchAds();
  }, []);
  */

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">

      {/* ── Page header ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between flex-wrap mt-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600 uppercase tracking-widest">Annonces YamoMarket</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Publicités & Promotions</h1>
            <p className="text-sm text-gray-400 mt-1">Découvrez les meilleures offres sélectionnées par notre équipe.</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
            <BadgeCheck size={12} className="text-green-600" /> Annonces officielles YamoMarket
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── Hero carousel ── */}
        <section>
          <HeroCarousel ads={ads} />
        </section>

        {/* ── 2-column medium banners ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-amber-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Offres du moment</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ads.slice(0, 2).map(ad => (
              <MediumBanner key={ad.id} ad={ad} />
            ))}
          </div>
        </section>

        {/* ── Full-width strip ── */}
        <section>
          <StripBanner ad={ads[2]} />
        </section>

        {/* ── 4-column small cards ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Tag size={14} className="text-green-600" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">À ne pas manquer</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {smallAds.map(ad => (
              <SmallCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>

        {/* ── Second strip ── */}
        <section>
          <StripBanner ad={ads[3]} />
        </section>

        {/* ── Bottom 3-column medium banners ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Eye size={14} className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Sélection de la semaine</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ads.slice(2, 5).map(ad => (
              <MediumBanner key={ad.id} ad={ad} />
            ))}
          </div>
        </section>

        {/* ── Sponsor note ── */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Ces annonces sont gérées directement par l'équipe YamoMarket.{' '}
            <a href="/contact" className="text-green-600 hover:underline font-medium">Nous contacter pour faire de la publicité</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdsPage;
