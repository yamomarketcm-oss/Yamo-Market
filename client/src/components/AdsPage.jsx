import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, ExternalLink, Zap,
  Tag, MapPin, BadgeCheck, Eye, ArrowRight, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Mock ad data ───────────────────────────────── */
/* Each ad has:
   id, title, subtitle, tag, cta (call-to-action label),
   link, shop, region, m_img (banner image from Cloudinary),
   accent (tailwind bg color for overlays), pill (badge label)

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

  const handleClick = async () => {
    try {
      const res = await fetch('https://yamo-market-server.vercel.app/api/market/click-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clict_type: 'ads', shoplead_ip: ad.product, vendor:ad.product, shop: ad.shop }),
      });
    } catch (err) {
      console.log('Could not submit update.', 'error');
    }
  };

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
          key={a?.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <img
            src={a?.m_img}
            alt={a?.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${a?.accent}`} />
        </div>
      ))}

      {/* content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/70 text-[10px] sm:text-xs font-medium border border-white/20 px-2 sm:px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              {ad?.tag}
            </span>
          </div>
          <span className="text-white/60 text-[9px] sm:text-[10px] flex items-center gap-1 bg-black/20 px-1.5 sm:px-2 py-1 rounded-full backdrop-blur-sm">
            <BadgeCheck size={10} className="text-emerald-400" />
            <span className="">Annonce officielle</span>
          </span>
        </div>

        <div className='mx-4'>
          <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-xl">
            {ad?.title}
          </h2>
          <p className="hidden sm:block text-white/80 text-sm sm:text-base max-w-md leading-relaxed">
            {ad?.slogan}
          </p>

          {/* Mobile: price + CTA stacked compactly, shop info below.
              Desktop layout (sm:flex-row, sm:items-center, sm:gap-4) left untouched. */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 mt-5">
            <div className="flex items-center justify-between sm:block gap-3">
              <div>
                <p className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider">A partir de</p>
                <span className='flex items-center justify-center gap-0.5'><p className="text-lg sm:text-2xl font-black text-white leading-none">{ad?.price}</p><p className='text-lg sm:text-2xl font-black text-white'>XAF</p></span>
              </div>

              <Link to={`/product/${ad?.product_slug}`}
               onClick={handleClick}
                className="sm:hidden flex items-center gap-1.5 bg-white text-green-800 font-bold text-xs px-4 py-2.5 rounded-xl active:scale-[0.97] transition-all shadow-lg shadow-black/20 flex-shrink-0">
                Voir <ArrowRight size={13} />
              </Link>
            </div>

            <Link to={`/product/${ad?.product_slug}`}
              className="hidden sm:flex items-center gap-2 bg-white text-green-800 font-bold text-sm px-6 py-3 rounded-2xl hover:bg-green-50 transition-all shadow-xl shadow-black/20 active:scale-[0.97]">
              Voir le produit <ArrowRight size={15} />
             </Link>

            <div className="text-white/60 text-[10px] sm:text-xs flex items-center gap-1">
              <MapPin size={10} /> {ad?.shop_name} . {ad?.town}
            </div>
          </div>
        </div>
      </div>

      {/* arrows */}
      <button onClick={() => go(idx - 1)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 bg-black/25 hover:bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all z-20"
        aria-label="PrÃ©cÃ©dent">
        <ChevronLeft size={16} className="sm:hidden" />
        <ChevronLeft size={18} className="hidden sm:block" />
      </button>
      <button onClick={() => go(idx + 1)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 bg-black/25 hover:bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all z-20"
        aria-label="Suivant">
        <ChevronRight size={16} className="sm:hidden" />
        <ChevronRight size={18} className="hidden sm:block" />
      </button>

      {/* dot indicators */}
      <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {ads.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-white' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/60'}`}
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
const MediumBanner = ({ ad, Click }) => (
  <Link to={`/product/${ad?.product_slug}`}
    onClick={Click}
    className="group relative rounded-2xl overflow-hidden flex-shrink-0 block"
    style={{ aspectRatio: '3/1' }}>
    <img src={ad.m_img} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    <div className={`absolute inset-0 bg-gradient-to-r ${ad?.accent}`} />
    <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
      <span className='bg-white/15 border border-white/30 text-white w-fit rounded-full text-xs font-semibold px-2'>{ad.tag}</span>
      <div>
        <p className="text-white font-extrabold text-lg leading-tight">{ad?.title}</p>
        <div className="flex gap-3">
          <span className='flex items-center justify-center gap-0.5'><p className="text-lg sm:text-2xl font-black text-white leading-none mt-0.5">{ad?.price}</p><p className='text-lg sm:text-2xl font-black text-white'>XAF</p></span>
          <span className="sm:mt-2.5 mt-1 text-white/60 text-sm font-semibold ">{ad?.shop_name} â€¢ {ad?.town}</span>
        </div>
      </div>
    </div>
    <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-10">
      <ExternalLink size={13} />
    </div>
  </Link>
);

/* ─── Small square card ──────────────────────────── */
const SmallCard = ({ ad, Click }) => {
  const pillColors = {
    Nouveau: 'bg-emerald-500 text-white',
    Hot:     'bg-rose-500 text-white',
    Local:   'bg-green-700 text-white',
    Sale:    'bg-amber-400 text-white',
  };
  return (
    <Link to={`/product/${ad?.product_slug}`}
    onClick={Click}
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 block">
      <div className="relative h-36 overflow-hidden">
        <img src={ad.m_img} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-2.5 left-2.5 text-white/60 text-[9px] sm:text-[10px] flex items-center gap-1 bg-black/20 px-1.5 sm:px-2 py-1 rounded-full backdrop-blur-sm">
            <BadgeCheck size={10} className="text-emerald-400" />
            <span className="sm:inline hidden">Annonce officielle</span>
          </span>
        <span className="absolute top-2.5 right-2.5 text-[9px] text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
          {ad.tag}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-800 text-sm truncate">{ad.title}</p>
        <p className="text-[10px] text-gray-400 flex items-center font-semibold gap-1 mt-0.5 truncate">
          <MapPin size={9} /> {ad.region} . {ad.town}
        </p>

        {/* Mobile: price on its own line, button full-width below.
            Desktop (sm:): original inline row, untouched. */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 gap-2 sm:gap-0">
          <p className="text-md sm:text-lg font-black text-green-600 leading-none mt-0.5">{ad?.price} XAF</p>
          <span className="text-center sm:text-[10px] text-xs text-green-700 border border-green-200 hover:bg-green-600 hover:text-white px-2.5 py-1.5 sm:py-1 rounded-lg transition-all font-medium w-full sm:w-auto">
            Voir
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ─── Inline strip banner ────────────────────────── */
const StripBanner = ({ ad, Click }) => (
  <Link to={`/product/${ad?.product_slug}`}
    onClick={Click}
    className="group relative w-full rounded-2xl overflow-hidden flex items-center block"
    style={{ height: '110px' }}>
    <img src={ad?.m_img} alt={ad?.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    <div className="relative z-10 px-6 flex items-center justify-between w-full">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/60 text-[9px] sm:text-[10px] flex items-center gap-1 bg-black/20 px-1.5 sm:px-2 py-1 rounded-full backdrop-blur-sm">
            <BadgeCheck size={10} className="text-emerald-400" />
            <span className="">Annonce officielle</span>
          </span>
          <span className="text-white/60 text-[10px]">{ad?.tag}</span>
        </div>
        <p className="text-white font-extrabold text-lg leading-tight">{ad?.title}</p>
        <p className="text-white/70 font-semibold text-xs mt-0.5">{ad?.shop_name} . {ad?.town}</p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-white font-black text-xl">{ad?.price} XAF</span>
        <span className="flex items-center gap-1.5 bg-white text-green-800 text-xs font-bold px-4 py-2 rounded-xl group-hover:bg-green-50 transition-colors shadow-lg">
          Voir <ArrowRight size={12} />
        </span>
      </div>
    </div>
  </Link>
);

/* ─── Main Page ──────────────────────────────────── */
const AdsPage = () => {
  const [ads, setAds] = useState([]);
  const [smallAds, setSmallAds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://yamo-market-server.vercel.app/api/market/getallads');
        const result = await res.json();
        setAds(result.data || []);
        setSmallAds(result.data || []);
      } catch { } finally { setLoading(false); }
    };
    fetchAds();
  }, []);

  const handleClick = async (product) => {
  try {
    await fetch('https://yamo-market-server.vercel.app/api/market/click-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clict_type: 'ads', shoplead_ip: product.product, vendor: product.product, shop: product.shop
      }),
    });
  } catch (err) {
    console.log('Could not submit update.', err);
  }
};

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
           {ads?.slice(0, 2).map(ad => (
              <MediumBanner key={ad.ads_id} ad={ad} Click={() => handleClick(ad)} />
            ))}
          </div>
        </section>

        {/* ── Full-width strip ── */}
        <section>
          <StripBanner ad={ads[0]} Click={() => handleClick(ads[0])} />
        </section>

        {/* ── 4-column small cards ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Tag size={14} className="text-green-600" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">À ne pas manquer</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {smallAds.map(ad => (
              <SmallCard key={ad.ads_id} ad={ad} Click={() => handleClick(ad)} />
            ))}
          </div>
        </section>

        {/* ── Second strip ── */}
        <section>
          <StripBanner ad={ads[1]} Click={() => handleClick(ads[1])} />
        </section>

        {/* ── Bottom 3-column medium banners ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Eye size={14} className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Sélection de la semaine</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ads.slice(0, 3).map(ad => (
              <MediumBanner key={ad.ads_id} ad={ad} Click={() => handleClick(ad)} />
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
