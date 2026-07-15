import React, { useState, useEffect } from 'react';
import {
  Star, MapPin, ChevronRight, BadgeCheck,
  Search, Heart, MessageCircle, Phone,
  Package, Users, TrendingUp, Clock, Grid3X3, List,
  Store, Shield, Zap, Facebook, Instagram, X,
  CheckCircle2, Copy, Mail
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

/* ─── static constants ───────────────────────────── */
const CATEGORIES = ['Tous', 'Électronique', 'Mode', 'Beauté', 'Maison', 'Alimentation', 'Services', 'Autre'];

const REVIEWS = [
  { name: 'Jean-Paul M.', rating: 5, date: 'il y a 2 jours', text: 'Boutique excellente ! Livraison rapide et produits authentiques. Je recommande fortement.' },
  { name: 'Amélie T.',    rating: 4, date: 'il y a 1 semaine', text: 'Bon service client, réponse rapide. Produit conforme à la description.' },
  { name: 'Rodrigue K.', rating: 5, date: 'il y a 3 semaines', text: 'TechShop est ma boutique préférée sur Yamo. Toujours satisfait de mes achats !' },
];

const TRUST_STATS = [
  { icon: <Shield size={15} className="text-green-600" />,    title: 'Vendeur vérifié',      desc: 'Identité et documents vérifiés par notre équipe.' },
  { icon: <Zap    size={15} className="text-amber-500" />,    title: 'Livraison rapide',     desc: 'Expédition sous 24–48h dans les grandes villes.' },
  { icon: <BadgeCheck size={15} className="text-blue-500" />, title: 'Produits authentiques', desc: 'Tous les produits sont contrôlés avant mise en ligne.' },
  { icon: <Users  size={15} className="text-violet-500" />,   title: 'Communauté active',    desc: 'Des milliers d\'acheteurs satisfaits sur YamoMarket.' },
];

/* ─── helpers ─────────────────────────────────────── */
const StarRow = ({ rating, size = 13 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={size}
        className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
    ))}
  </div>
);

const badgeColor = (b) => ({
  New:'bg-emerald-500', Sale:'bg-amber-400', Hot:'bg-rose-500',
  Local:'bg-green-700', Promo:'bg-violet-500',
}[b] || 'bg-gray-400');

/* ─── WhatsApp helpers ───────────────────────────── */
/**
 * Builds a wa.me deep-link with a pre-filled message.
 * Handles numbers with or without the 237 Cameroon prefix.
 */
const buildWhatsAppURL = (rawPhone, shopName, productName = null) => {
  const clean = (rawPhone || '').replace(/[\s\-().+]/g, '');
  const e164  = clean.startsWith('237') ? clean : `237${clean}`;

  const greeting = productName
    ? `Bonjour ${shopName || 'la boutique'} ! 👋\nJe vous contacte depuis *Yamo Market*.\nJe suis intéressé(e) par votre produit : *${productName}*.`
    : `Bonjour ${shopName || 'la boutique'} ! 👋\nJe vous contacte depuis *Yamo Market*.\nJe suis intéressé(e) par vos produits.`;

  return `https://wa.me/${e164}?text=${encodeURIComponent(greeting)}`;
};

const copyToClipboard = async (text) => {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const el = document.createElement('textarea');
    el.value = text; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
  }
};

/* ─── Product Card ───────────────────────────────── */
const ProductCard = ({ p, viewMode, onFav, favs }) => {
  const handleClick = async () => {
    try {
      await fetch('https://yamo-market-server.vercel.app/api/market/click-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clict_type: 'product', shoplead_ip: p.product_id, vendor: p.product_id, shop: p.shop }),
      });
    } catch { /* silent */ }
  };

  const isList = viewMode === 'list';
  return (
    <Link to={`/product/${p.product_slug}`} onClick={handleClick}>
      <div className={`group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 cursor-pointer ${isList ? 'flex items-center gap-4 p-3' : 'flex flex-col'}`}>
        <div className={`relative bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center flex-shrink-0 ${isList ? 'w-20 h-20 rounded-xl' : 'h-44'}`}>
          {p.m_img
            ? <img src={p.m_img} alt={p.product_name} className={`${isList ? 'rounded-xl' : ''} w-full h-full object-cover`} />
            : <span className={`select-none group-hover:scale-110 transition-transform duration-300 ${isList ? 'text-4xl' : 'text-6xl'}`}>🛍️</span>
          }
          {p.tag && !isList && (
            <span className={`absolute top-3 left-3 ${badgeColor(p.tag)} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full`}>{p.tag}</span>
          )}
          <button
            onClick={e => { e.preventDefault(); onFav(p.product_id); }}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm ${isList ? 'hidden' : ''}`}
          >
            <Heart size={12} className={favs.includes(p.product_id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
          </button>
        </div>
        <div className={`flex flex-col flex-1 ${isList ? '' : 'p-4'}`}>
          {isList && p.tag && (
            <span className={`${badgeColor(p.tag)} text-white text-[9px] font-bold px-2 py-0.5 rounded-full w-fit mb-1`}>{p.tag}</span>
          )}
          <p className={`font-semibold text-gray-800 leading-snug ${isList ? 'text-sm' : 'text-sm mb-1'} truncate`}>{p.product_name}</p>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.desc}</p>
          <div className={`flex items-center justify-between ${isList ? 'mt-2' : 'mt-3'}`}>
            <span className="text-green-700 font-bold text-sm">
              {Number(p.price).toLocaleString('fr-CM')} <span className="text-xs font-normal text-gray-400">XAF</span>
            </span>
            <span className="text-xs font-medium text-green-700 border border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600 px-3 py-1.5 rounded-lg transition-all">
              Voir
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ─── Shared modal shell ─────────────────────────── */
const ModalShell = ({ onClose, topBarClass, children }) => (
  <>
    <div onClick={onClose} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className={`h-1.5 w-full ${topBarClass}`} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  </>
);

/* ─── Shared shop pill ───────────────────────────── */
const ShopPill = ({ shop }) => (
  <div className="mt-2.5 inline-flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl px-3.5 py-2.5 shadow-md shadow-green-200/60 max-w-full">
    <div className="w-7 h-7 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 text-sm">🏪</div>
    <div className="min-w-0">
      <p className="text-sm font-bold text-white leading-tight truncate">{shop?.shop_name || 'Boutique'}</p>
      <p className="text-[10px] text-green-200 flex items-center gap-0.5 mt-0.5">
        <MapPin size={9} className="flex-shrink-0" /> {shop?.region} • {shop?.town}
      </p>
    </div>
  </div>
);

/* ─── WhatsApp button ────────────────────────────── */
const WhatsAppButton = ({ onClick, subtext }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] text-white font-bold text-sm px-5 py-4 rounded-2xl transition-all shadow-lg shadow-green-300/40 group"
  >
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    <div className="flex-1 text-left">
      <p className="font-extrabold text-base leading-none">Ouvrir WhatsApp</p>
      <p className="text-[11px] text-white/80 mt-0.5 font-normal">{subtext || 'Message pré-rempli · réponse rapide'}</p>
    </div>
    <ChevronRight size={16} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
  </button>
);

/* ─── No-WhatsApp fallback banner ────────────────── */
const NoWhatsAppBanner = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
      <Phone size={14} className="text-amber-600" />
    </div>
    <div>
      <p className="text-sm font-bold text-amber-800">WhatsApp non renseigné</p>
      <p className="text-xs text-amber-600 mt-0.5">Utilisez les coordonnées ci-dessous pour contacter cette boutique.</p>
    </div>
  </div>
);

/* ─── Copy row ───────────────────────────────────── */
const CopyRow = ({ icon, value, label, copiedKey, activeCopied, onCopy, accentClass }) => (
  <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5">
    <div className="flex-shrink-0 text-gray-400">{icon}</div>
    <div className="flex-1 min-w-0">
      {label && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>}
      <p className="text-sm font-bold text-gray-700 truncate">{value}</p>
    </div>
    <button
      onClick={() => onCopy(value, copiedKey)}
      className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all
        ${activeCopied === copiedKey ? `${accentClass || 'bg-green-600'} text-white` : 'bg-white border border-gray-200 hover:border-green-300 text-gray-500'}`}
    >
      {activeCopied === copiedKey
        ? <><CheckCircle2 size={11} /> Copié</>
        : <><Copy size={11} /> Copier</>}
    </button>
  </div>
);

/* ─── Disclaimer ─────────────────────────────────── */
const Disclaimer = () => (
  <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed">
    YamoMarket ne garantit pas les échanges hors plateforme. Restez vigilant.
  </p>
);

/* ═══════════════════════════════════════════════════
   MESSAGE MODAL  — WhatsApp primary, copy fallback
═══════════════════════════════════════════════════ */
const MessageModal = ({ shop, onClose }) => {
  const [copied, setCopied] = useState(null);

  const phone = shop?.phone   || shop?.b_phone || null;
  const email = shop?.b_email || shop?.email   || null;
  const hasWA = !!phone;

  const handleCopy = async (text, key) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ModalShell onClose={onClose} topBarClass="bg-gradient-to-r from-green-500 via-emerald-400 to-green-600">
      {/* header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 min-w-0 pr-3">
          <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center mb-3">
            <MessageCircle size={20} className="text-green-700" />
          </div>
          <h2 className="text-lg font-extrabold text-gray-900">Contacter la boutique</h2>
          <ShopPill shop={shop} />
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0">
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-3">
        {hasWA ? (
          <>
            {/* PRIMARY CTA */}
            <WhatsAppButton onClick={() => window.open(buildWhatsAppURL(phone, shop?.shop_name), '_blank')} />

            {/* number copy — secondary */}
            <CopyRow
              icon={<Phone size={13} />}
              value={phone}
              copiedKey="phone"
              activeCopied={copied}
              onCopy={handleCopy}
            />
          </>
        ) : (
          <NoWhatsAppBanner />
        )}

        {/* email copy — always shown if available */}
        {email && (
          <CopyRow
            icon={<Mail size={13} className="text-blue-400" />}
            value={email}
            label="Email"
            copiedKey="email"
            activeCopied={copied}
            onCopy={handleCopy}
            accentClass="bg-blue-600"
          />
        )}

        {/* address — read-only */}
        {shop?.address && (
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5">
            <MapPin size={13} className="text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-gray-700 leading-snug">{shop.address}</p>
          </div>
        )}
      </div>

      <Disclaimer />
    </ModalShell>
  );
};

/* ═══════════════════════════════════════════════════
   CALL MODAL  — WhatsApp primary, tel: + copy fallback
═══════════════════════════════════════════════════ */
const CallModal = ({ shop, onClose }) => {
  const [copied, setCopied] = useState(false);
  const phone = shop?.phone || shop?.b_phone || null;

  const handleCopy = async () => {
    await copyToClipboard(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalShell onClose={onClose} topBarClass="bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500">
      {/* header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 min-w-0 pr-3">
          <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center mb-3">
            <Phone size={20} className="text-green-700" />
          </div>
          <h2 className="text-lg font-extrabold text-gray-900">Appeler la boutique</h2>
          <ShopPill shop={shop} />
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0">
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {phone ? (
        <div className="space-y-3">
          {/* ── big phone display ── */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 text-center">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-300/50">
              <Phone size={24} className="text-white" />
            </div>
            <p className="text-2xl font-black text-gray-900 tracking-wide">{phone}</p>
            <p className="text-xs text-gray-400 mt-1">{shop?.shop_name}</p>
          </div>

          {/* ── PRIMARY: WhatsApp call / chat ── */}
          <WhatsAppButton
            onClick={() => window.open(buildWhatsAppURL(phone, shop?.shop_name), '_blank')}
            subtext="Discutez ou appelez via WhatsApp"
          />

          {/* ── SECONDARY: native tel dial ── */}
          <a
            href={`tel:+237${(phone).replace(/[\s\-().+]/g, '').replace(/^237/, '')}`}
            className="w-full flex items-center justify-center gap-2 border-2 border-green-200 hover:border-green-400 text-green-700 font-semibold text-sm py-3.5 rounded-2xl transition-all"
          >
            <Phone size={15} /> Appel téléphonique direct
          </a>

          {/* ── TERTIARY: copy number ── */}
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl transition-all border
              ${copied ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-200 hover:border-green-300 text-gray-500'}`}
          >
            {copied ? <><CheckCircle2 size={13} /> Numéro copié</> : <><Copy size={13} /> Copier le numéro</>}
          </button>

          {/* location context */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {[
              { label: 'Région',  value: shop?.region,  icon: <MapPin size={13} className="text-emerald-700" /> },
              { label: 'Ville',   value: shop?.town,    icon: <MapPin size={13} className="text-emerald-600" /> },
              { label: 'Adresse', value: shop?.address, icon: <Store  size={13} className="text-orange-600"  /> },
            ].map(r => r.value && (
              <div key={r.label} className="flex items-center gap-3 px-4 py-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">{r.icon}</div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{r.label}</p>
                  <p className="text-sm font-bold text-gray-900 leading-snug">{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Phone size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-semibold">Numéro non disponible</p>
          <p className="text-xs text-gray-400 mt-1">Cette boutique n'a pas renseigné de numéro.</p>
        </div>
      )}

      <Disclaimer />
    </ModalShell>
  );
};

/* ─── Main component ─────────────────────────────── */
const BoutiqueDetail = () => {
  const { slug } = useParams();

  const [shopDetail,     setShopDetail]     = useState({});
  const [shopProducts,   setShopProducts]   = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeTab,      setActiveTab]      = useState('products');
  const [viewMode,       setViewMode]       = useState('grid');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [favs,           setFavs]           = useState([]);
  const [following,      setFollowing]      = useState(false);
  const [showMessage,    setShowMessage]    = useState(false);
  const [showCall,       setShowCall]       = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`https://yamo-market-server.vercel.app/api/market/getshopslug/${slug}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch shop');
        setShopDetail(await res.json());
      } catch (err) { console.error('Shop fetch failed:', err); }
    };
    fetchShop();
  }, [slug]);

  useEffect(() => {
    if (!shopDetail.shop_id) return;
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('market_token');
        const res = await fetch(`https://yamo-market-server.vercel.app/api/market/shop-product/${shopDetail.shop_id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const result = await res.json();
        setShopProducts(result.data || []);
      } catch (err) { console.error('Products fetch failed:', err); }
    };
    fetchProducts();
  }, [shopDetail.shop_id]);

  const toggleFav = id => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const filtered = shopProducts.filter(p =>
    (activeCategory === 'Tous' || p.category === activeCategory) &&
    (p.product_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="relative pt-12 bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* avatar */}
            <div className="w-24 h-24 rounded-3xl bg-white/15 border-2 border-white/30 overflow-hidden flex-shrink-0 shadow-2xl">
              {shopDetail.profile
                ? <img src={shopDetail.profile} alt={shopDetail.shop_name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-4xl">🏪</div>
              }
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {shopDetail.status && (
                  <span className="flex items-center gap-1 bg-white/15 border border-white/25 text-white text-xs font-medium px-3 py-1 rounded-full">
                    <BadgeCheck size={12} /> Vérifié
                  </span>
                )}
                {shopDetail.category && (
                  <span className="bg-white/15 border border-white/25 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {shopDetail.category}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {shopDetail.shop_name || 'Boutique'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <span className="text-green-200 text-xs flex items-center gap-1">
                  <MapPin size={11} /> {shopDetail.region}, {shopDetail.town}
                </span>
                <span className="text-green-200 text-xs flex items-center gap-1">
                  <Clock size={11} /> Most TrustWorthy
                </span>
              </div>
            </div>

            {/* actions */}
            <div className="flex gap-2.5 flex-shrink-0 flex-wrap">
              <button
                onClick={() => setFollowing(f => !f)}
                className="text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all bg-white text-green-800 border-white shadow-lg"
              >
                ✓ Abonné
              </button>

              {/* Message → opens modal (WhatsApp primary inside) */}
              <button
                onClick={() => setShowMessage(true)}
                className="flex items-center gap-1.5 bg-green-500/20 border border-white/25 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-500/30 transition-all"
              >
                <MessageCircle size={15} /> Message
              </button>

              {/* Call → opens modal (WhatsApp primary inside) */}
              <button
                onClick={() => setShowCall(true)}
                className="flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all"
              >
                <Phone size={15} /> Appeler
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: <Package    size={16} />, value: shopProducts.length || '—', label: 'Produits' },
              { icon: <TrendingUp size={16} />, value: '—', label: 'Ventes'   },
              { icon: <Users      size={16} />, value: '—', label: 'Abonnés'  },
              { icon: <Clock      size={16} />, value: '—', label: 'Réponse'  },
            ].map(s => (
              <div key={s.label} className="py-5 px-4 flex flex-col items-center text-center">
                <div className="text-green-600 mb-1">{s.icon}</div>
                <p className="font-bold text-gray-900 text-lg leading-none">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-3">
          {['Vendeur vérifié', 'Livraison rapide', 'Top vendeur 2024'].map(b => (
            <span key={b} className="flex items-center gap-1.5 text-xs font-medium text-green-800 bg-white border border-green-200 px-3 py-1.5 rounded-full shadow-sm">
              <Shield size={11} className="text-green-600" /> {b}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link to="/" className="hover:text-green-600">Accueil</Link>
          <ChevronRight size={12} />
          <Link to="/boutiques" className="hover:text-green-600">Boutiques</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">{shopDetail.shop_name}</span>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-0 border-b border-gray-200 mb-8">
          {[
            { key: 'products', label: `Produits (${shopProducts.length})` },
            { key: 'about',    label: 'À propos' },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === t.key ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher dans cette boutique…"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 focus:border-green-400 rounded-xl outline-none transition-all" />
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 self-start">
                <button onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Grid3X3 size={16} />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                  <List size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    activeCategory === c
                      ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700'
                  }`}>{c}</button>
              ))}
            </div>

            <p className="text-sm text-gray-600 font-semibold mb-4">Nos Produits</p>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500 font-medium">Aucun produit trouvé</p>
                <p className="text-gray-400 text-sm mt-1">Essayez un autre terme ou catégorie</p>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'flex flex-col gap-3'}>
                {filtered.map(p => (
                  <ProductCard key={p.product_id || p.id} p={p} viewMode={viewMode} onFav={toggleFav} favs={favs} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ABOUT TAB ── */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* bio */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
                  <Store size={16} className="text-green-600" /> À propos de la boutique
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {shopDetail.bio || 'Aucune description disponible pour cette boutique.'}
                </p>
              </div>

              {/* contact info */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" /> Informations de contact
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: 'Adresse',   value: shopDetail.address },
                    { label: 'Téléphone', value: shopDetail.phone   },
                    { label: 'Email',     value: shopDetail.b_email },
                    { label: 'Ville',     value: shopDetail.town    },
                    { label: 'Région',    value: shopDetail.region  },
                  ].map(item => (
                    <li key={item.label} className="flex gap-4 text-sm">
                      <span className="text-gray-400 w-20 flex-shrink-0">{item.label}</span>
                      <span className="text-gray-800 font-medium">{item.value || '—'}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* map placeholder */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 rounded-2xl h-48 flex flex-col items-center justify-center text-center gap-2">
                <MapPin size={28} className="text-green-500" />
                <p className="text-sm font-semibold text-green-800">{shopDetail.address || 'Adresse non renseignée'}</p>
                <p className="text-xs text-green-600">{shopDetail.region}, {shopDetail.town}</p>
                <button className="mt-2 text-xs bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Voir sur la carte
                </button>
              </div>
            </div>

            {/* sidebar */}
            <div className="space-y-5">
              {/* trust stats */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Pourquoi nous faire confiance ?</h3>
                <div className="space-y-4">
                  {TRUST_STATS.map(s => (
                    <div key={s.title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* socials */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Réseaux sociaux</h3>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors">
                    <Facebook size={14} /> Facebook
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-pink-50 text-pink-600 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-pink-100 transition-colors">
                    <Instagram size={14} /> Instagram
                  </button>
                </div>
              </div>

              {/* CTA buttons */}
              <button
                onClick={() => setShowMessage(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-4 rounded-2xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
              >
                <MessageCircle size={17} /> Envoyer un message
              </button>
              <button
                onClick={() => setShowCall(true)}
                className="w-full border-2 border-green-200 hover:border-green-400 text-green-700 font-semibold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Phone size={15} /> Appeler la boutique
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showMessage && <MessageModal shop={shopDetail} onClose={() => setShowMessage(false)} />}
      {showCall    && <CallModal    shop={shopDetail} onClose={() => setShowCall(false)}    />}
    </div>
  );
};

export default BoutiqueDetail;
