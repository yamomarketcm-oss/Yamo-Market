import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, Heart, Share2, Shield, Zap,
  MapPin, ChevronRight, CheckCircle2, Package,
  ChevronLeft, Eye, MessageCircle, Store, BadgeCheck,
  X,
  Phone,
  Copy,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const REVIEWS_DATA = [
  { name: 'Jean-Paul M.', rating: 5, date: 'il y a 3 jours', text: 'Excellent produit, livraison rapide depuis Douala. Très satisfait !' },
  { name: 'Amélie T.',    rating: 4, date: 'il y a 1 semaine', text: "Bon rapport qualité-prix. L'écran est vraiment superbe." },
  { name: 'Rodrigue K.', rating: 5, date: 'il y a 2 semaines', text: 'Le meilleur smartphone que j\'ai eu. La caméra est incroyable.' },
];

/* ─── StarRow ─────────────────────────────────────── */
const StarRow = ({ rating, size = 14, showNum = false }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={size}
        className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
    ))}
    {showNum && <span className="text-xs text-gray-500 ml-1">{rating}</span>}
  </div>
);

const RatingBar = ({ label, pct }) => (
  <div className="flex items-center gap-3 text-xs text-gray-500">
    <span className="w-3">{label}</span>
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
    </div>
    <span className="w-6 text-right">{pct}%</span>
  </div>
);

const ContactModal = ({ product, onClose }) => {
  const [copied, setCopied] = useState(null); // 'phone' | 'email'
 
  const phone   = product?.phone    || product?.b_phone    || product?.shop_phone || null;
  const email   = product?.b_email  || product?.shop_email || product?.email      || null;
  const address = product?.address  || product?.b_address  || null;
  const region  = product?.region   || null;
  const town    = product?.town     || null;
  const shopName = product?.shop_name || 'le vendeur';
 
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };
 
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
      />
 
      {/* Panel */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600" />
 
          <div className="p-6">
            {/* header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 min-w-0 pr-3">
                <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center text-2xl mb-3">🏪</div>
                <h2 className="text-lg font-extrabold text-gray-900">Contacter le vendeur</h2>
 
                {/* shop name + location pill */}
                <div className="mt-2.5 w-80 inline-flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl px-3.5 py-2.5 shadow-md shadow-green-200/60 max-w-full">
                  <div className="w-7 h-7 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 text-sm">
                    🏪
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-tight truncate">{shopName}</p>
                    <p className="text-[10px] text-green-200 flex items-center gap-0.5 mt-0.5">
                      <MapPin size={9} className="flex-shrink-0" />
                      {product?.region} • {product?.town}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Fermer"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
 
            {/* contact info rows */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
 
              {/* Phone */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Téléphone</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
                    {phone || <span className="text-gray-400 font-normal italic">Non disponible</span>}
                  </p>
                </div>
                {phone && (
                  <button
                    onClick={() => copyToClipboard(phone, 'phone')}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-green-400 flex items-center justify-center transition-all flex-shrink-0"
                    aria-label="Copier le numéro"
                  >
                    {copied === 'phone'
                      ? <CheckCircle2 size={13} className="text-green-600" />
                      : <Copy size={12} className="text-gray-400" />}
                  </button>
                )}
              </div>
 
              {/* Region */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Région</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
                    {region || <span className="text-gray-400 font-normal italic">Non disponible</span>}
                  </p>
                </div>
              </div>
 
              {/* Town */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Ville</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
                    {town || <span className="text-gray-400 font-normal italic">Non disponible</span>}
                  </p>
                </div>
              </div>
 
              {/* Address */}
              <div className="flex items-start gap-3 px-4 py-3.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Store size={14} className="text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Adresse</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5 leading-snug">
                    {address || <span className="text-gray-400 font-normal italic">Non disponible</span>}
                  </p>
                </div>
              </div>
 
            </div>
 
            {/* footer note */}
            <p className="text-center text-[10px] text-gray-400 mt-5 leading-relaxed">
              YamoMarket ne garantit pas les échanges hors plateforme. Restez vigilant.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Share Modal ─────────────────────────────────── */
const ShareModal = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);
 
  const url   = window.location.href;
  const title = product?.product_name || 'Produit sur YamoMarket';
  const text  = `Découvrez "${title}" sur YamoMarket — ${url}`;
 
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
 
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch { /* user cancelled */ }
    }
  };
 
  const CHANNELS = [
    {
      label: 'WhatsApp',
      color: 'bg-[#25D366] hover:bg-[#1ebe5d]',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      href: `https://wa.me/?text=${encodeURIComponent(text)}`,
    },
    {
      label: 'Facebook',
      color: 'bg-[#1877F2] hover:bg-[#1465d8]',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'Twitter / X',
      color: 'bg-gray-900 hover:bg-gray-700',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    },
    {
      label: 'Telegram',
      color: 'bg-[#229ED9] hover:bg-[#1a8bc0]',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ];
 
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600" />
 
          <div className="p-6">
            {/* header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center mb-3">
                  <Share2 size={20} className="text-green-700" />
                </div>
                <h2 className="text-lg font-extrabold text-gray-900">Partager ce produit</h2>
                <p className="text-sm text-gray-400 mt-0.5 truncate max-w-[220px]">{title}</p>
              </div>
              <button onClick={onClose}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Fermer">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
 
            {/* social channels */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {CHANNELS.map(ch => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 ${ch.color} text-white text-sm font-semibold px-4 py-3 rounded-2xl transition-all`}
                >
                  {ch.icon}
                  {ch.label}
                </a>
              ))}
            </div>
 
            {/* copy link row */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Lien du produit</p>
                <p className="text-xs text-gray-600 truncate">{url}</p>
              </div>
              <button
                onClick={copyLink}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl flex-shrink-0 transition-all ${
                  copied ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 hover:border-green-400 text-gray-600 hover:text-green-700'
                }`}
                aria-label="Copier le lien"
              >
                {copied ? <><CheckCircle2 size={13} /> Copié !</> : <><Copy size={13} /> Copier</>}
              </button>
            </div>
 
            {/* native share if supported */}
            {navigator.share && (
              <button
                onClick={nativeShare}
                className="mt-3 w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-green-400 text-gray-600 hover:text-green-700 text-sm font-semibold py-3 rounded-2xl transition-all"
              >
                <Share2 size={15} /> Partager via l'appareil
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


const badgeColor = (b) => ({
  New:'bg-emerald-500', Sale:'bg-amber-400', Hot:'bg-rose-500',
  Local:'bg-green-700', Promo:'bg-violet-500',
}[b] || 'bg-gray-400');

/* ─── Image panel ─────────────────────────────────── */
/*
 * productdetail has two separate image fields:
 *   m_img  — main / primary image URL
 *   img    — secondary image URL
 *
 * We build a small images array [m_img, img] (filtering nulls)
 * and let the user switch between them with arrows + thumbnails.
 */
const ImagePanel = ({ product }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  // Build image list from the two fields, skip empty ones
  const images = [product.m_img, product.img].filter(Boolean);

  // Reset to first image whenever the product changes
  useEffect(() => { setActiveIdx(0); }, [product.product_id]);

  const prev = () => setActiveIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx(i => (i + 1) % images.length);

  const current = images[activeIdx];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl overflow-hidden aspect-square flex items-center justify-center group">
        {current ? (
          <img
            src={current}
            alt={product.product_name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <span className="text-[100px] select-none group-hover:scale-110 transition-transform duration-500">🛍️</span>
        )}

        {/* arrows — only show if 2 images */}
        {images.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md hover:bg-white transition-all"
              aria-label="Image précédente">
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <button onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md hover:bg-white transition-all"
              aria-label="Image suivante">
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </>
        )}

        {/* tag badge */}
        {product.tag && (
          <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            {product.tag}
          </span>
        )}

        {/* verified pill */}
        {product.status && (
          <span className="absolute top-3 right-3 bg-black/20 border border-white/30 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
            <BadgeCheck size={10} className="text-emerald-300" /> Vérifié
          </span>
        )}

        {/* dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activeIdx ? 'bg-green-500 w-4' : 'bg-white/60'}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails — one per real image */}
      {images.length > 1 && (
        <div className="flex w-48 h-24 mx-auto gap-3">
          {images.map((src, i) => (
            <button key={i} onClick={() => setActiveIdx(i)}
              className={`flex-1 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                activeIdx === i
                  ? 'border-green-500 shadow-md shadow-green-100'
                  : 'border-transparent hover:border-green-200'
              }`}
              aria-label={i === 0 ? 'Image principale' : 'Image secondaire'}
            >
              <img src={src} alt={`Aperçu ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
          {/* filler slots so thumbnails don't stretch weirdly when only 2 */}
          {images.length < 4 && Array.from({ length: 2 - images.length }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 aspect-square rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200" />
          ))}
        </div>
      )}

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Shield size={15} className="text-green-600" />,  label: 'Vendeur vérifié'    },
          { icon: <Zap    size={15} className="text-amber-500" />,  label: 'En Activité'         },
          { icon: <Package size={15} className="text-blue-500" />,  label: 'Consommation Valide' },
        ].map(b => (
          <div key={b.label} className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center">
            {b.icon}
            <span className="text-[10px] text-gray-500 font-medium leading-tight">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main component ──────────────────────────────── */
const ProductDetail = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav]         = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showContact, setShowContact] = useState(false);
  const [showShare, setShowShare]     = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://yamo-market-server.vercel.app/api/market/getproduct/${product_id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const result = await res.json();
        setProduct(result);
      } catch (err) {
        console.error('Product fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [product_id]);

  const handleClick = async (product) => {
  try {
    await fetch('https://yamo-market-server.vercel.app/api/market/click-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clict_type: 'shop', shoplead_ip: product.shop, vendor: product.shop, shop: product.shop
      }),
    });
  } catch (err) {
    console.log('Could not submit update.', err);
  }
};

  /* ── loading skeleton ── */
  if (loading) return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-xl w-3/4" />
            <div className="h-4 bg-gray-200 rounded-xl w-1/2" />
            <div className="h-24 bg-gray-200 rounded-2xl" />
            <div className="h-12 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );

  /* ── not found ── */
  if (!product) return (
    <div className="min-h-screen pt-16 bg-gray-50 flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">😕</p>
      <p className="text-lg font-bold text-gray-700">Produit introuvable</p>
      <Link to="/products" className="text-green-600 hover:underline text-sm font-medium flex items-center gap-1">
        <ArrowLeft size={14} /> Retour aux produits
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link to="/" className="hover:text-green-600">Accueil</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-green-600">{product.product_category}</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium truncate max-w-[180px]">{product.product_name}</span>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* LEFT — dynamic images from m_img + img */}
          <ImagePanel product={product} />

          {/* RIGHT — info */}
          <div className="space-y-4">

            {/* title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {product.product_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="flex items-center gap-1 bg-orange-400 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                  <BadgeCheck size={11} className="text-yellow-200" /> Crédible
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                  Valide
                </span>
                {product.tag && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor(product.tag)} text-white`}>
                    {product.tag}
                  </span>
                )}
              </div>
            </div>

            {/* price */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-green-700">
                  {Number(product.price).toLocaleString('fr-CM')}
                </span>
                <span className="text-lg text-gray-400 font-medium mb-0.5">XAF</span>
              </div>
              <p className="text-sm text-green-700 font-medium mt-1">
                Vous économisez votre temps avec YamoMarket
              </p>
            </div>

            {/* image field indicators */}
            <div className="flex gap-2">
              {product.m_img && (
                <span className="flex items-center gap-1 text-[10px] bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full font-medium">
                  <CheckCircle2 size={9} /> Image principale
                </span>
              )}
              {product.img && (
                <span className="flex items-center gap-1 text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                  <CheckCircle2 size={9} /> Image secondaire
                </span>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowContact(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold text-sm py-4 rounded-2xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2">
                <MessageCircle size={17} /> Contacter le vendeur
              </button>
              <button
                onClick={() => setShowShare(true)}
                className="px-4 py-4 rounded-2xl border-2 border-green-200 hover:border-green-500 text-green-700 font-semibold text-sm transition-all flex items-center gap-2"
                aria-label="Partager"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Shop card */}
            <Link to={`/boutique/${product.shop}`} onClick={() => handleClick(product)} >
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:border-green-200 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">🏪</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-gray-800 text-sm truncate">{product.shop_name}</p>
                  <BadgeCheck size={14} className="text-green-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                  <MapPin size={10} /> {product.region}, {product.town}
                </p>
              </div>
              <div className="flex items-center gap-1 text-green-600 group-hover:gap-2 transition-all">
                <Store size={14} /><ChevronRight size={14} />
              </div>
            </div>
            </Link>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-10">
          <div className="flex gap-0 border-b border-gray-200 mb-8">
            {[
              { key: 'description', label: 'Description' },
              { key: 'reviews',     label: `Avis (${REVIEWS_DATA.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === t.key ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="max-w-2xl">
              {product.desc
                ? <p className="text-gray-600 leading-relaxed text-[15px]">{product.desc}</p>
                : <p className="text-gray-400 italic text-sm">Aucune description disponible.</p>
              }
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center lg:sticky lg:top-20 self-start">
                <p className="text-6xl font-black text-gray-900">4.7</p>
                <StarRow rating={4.7} size={20} />
                <p className="text-sm text-gray-400 mt-2">{REVIEWS_DATA.length} avis vérifiés</p>
                <div className="w-full mt-5 space-y-2">
                  {[[5,72],[4,19],[3,6],[2,2],[1,1]].map(([s,p]) => (
                    <RatingBar key={s} label={s} pct={p} />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {REVIEWS_DATA.map((r, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {r.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.date}</p>
                        </div>
                      </div>
                      <StarRow rating={r.rating} size={13} />
                    </div>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
      </div>
      {/* ── Contact Modal ── */}
      {showContact && (
        <ContactModal product={product} onClose={() => setShowContact(false)} />
      )}

      {showShare && (
        <ShareModal product={product} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
};

export default ProductDetail;