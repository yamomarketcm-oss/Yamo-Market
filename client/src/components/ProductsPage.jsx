import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, SlidersHorizontal, X, ChevronDown, Star,
  Heart, Eye, MapPin, ArrowLeft, ShoppingBag,
  Grid3X3, List, ChevronRight, BadgeCheck, Package,
  TrendingUp, Zap, Filter,
  Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── constants ───────────────────────────────────── */
const CATEGORIES = ['Toutes', 'Électronique', 'Mode', 'Beauté', 'Maison', 'Alimentation', 'Services', 'Autre'];

const PRICE_RANGES = [
  { label: 'Tous les prix', min: 0,      max: Infinity },
  { label: 'Moins de 5 000',  min: 0,    max: 5000     },
  { label: '5 000 – 20 000',  min: 5000, max: 20000    },
  { label: '20 000 – 50 000', min: 20000,max: 50000    },
  { label: '50 000 – 100 000',min: 50000,max: 100000   },
  { label: 'Plus de 100 000', min: 100000,max: Infinity},
];

const SORT_OPTIONS = [
  { value: 'newest',   label: 'Plus récents'    },
  { value: 'popular',  label: 'Plus populaires' },
  { value: 'price_asc',label: 'Prix croissant'  },
  { value: 'price_desc',label:'Prix décroissant' },
  { value: 'rating',   label: 'Mieux notés'     },
];

const BADGES = ['Tous', 'New', 'Sale', 'Hot', 'Local', 'Promo'];

const REGIONS = [
  'Toutes les régions',
  'Centre', 'Littoral', 'Ouest', 'Nord-Ouest',
  'Sud-Ouest', 'Adamaoua', 'Nord', 'Extrême-Nord', 'Est', 'Sud',
];

/* ─── mock products ───────────────────────────────── */
const PRODUCTS = [
  { id:1,  name:'Smartphone Pro Max X12', price:85000,  category:'Électronique', badge:'New',   region:'Littoral', town:'Douala',    shop:'TechShop Douala',   rating:4.7, reviews:32, views:318, stock:7,  verified:true,  m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'📱' },
  { id:2,  name:'Robe élégante coton',    price:12500,  category:'Mode',         badge:'Sale',  region:'Centre',   town:'Yaoundé',   shop:'Mode Afrique',      rating:4.5, reviews:18, views:145, stock:20, verified:true,  m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'👗' },
  { id:3,  name:'Casque audio sans-fil',  price:22000,  category:'Électronique', badge:null,    region:'Littoral', town:'Douala',    shop:'SoundHub',          rating:4.9, reviews:54, views:201, stock:12, verified:true,  m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'🎧' },
  { id:4,  name:'Fauteuil design bois',   price:45000,  category:'Maison',       badge:'Local', region:'Centre',   town:'Yaoundé',   shop:'Déco Yaoundé',      rating:4.6, reviews:11, views:89,  stock:4,  verified:false, m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'🪑' },
  { id:5,  name:'Parfum Oud Intense',     price:18000,  category:'Beauté',       badge:'Hot',   region:'Ouest',    town:'Bafoussam', shop:'Beauté Prestige',   rating:4.8, reviews:27, views:233, stock:9,  verified:true,  m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'🌹' },
  { id:6,  name:'Sneakers Urban Run',     price:35000,  category:'Sport',        badge:null,    region:'Littoral', town:'Douala',    shop:'SportZone CM',      rating:4.4, reviews:43, views:176, stock:15, verified:true,  m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'👟' },
  { id:7,  name:'Montre connectée GT5',   price:55000,  category:'Électronique', badge:'Sale',  region:'Littoral', town:'Douala',    shop:'TechShop Douala',   rating:4.7, reviews:19, views:145, stock:3,  verified:true,  m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'⌚' },
  { id:8,  name:'Sac à main cuir',        price:28000,  category:'Mode',         badge:null,    region:'Centre',   town:'Yaoundé',   shop:'Mode Afrique',      rating:4.3, reviews:9,  views:67,  stock:8,  verified:true,  m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'👜' },
  { id:9,  name:'Laptop UltraSlim 14"',   price:320000, category:'Électronique', badge:'New',   region:'Littoral', town:'Douala',    shop:'TechShop Douala',   rating:4.8, reviews:22, views:267, stock:3,  verified:true,  m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'💻' },
  { id:10, name:'Épices locales assortis', price:4500,  category:'Alimentation', badge:'Local', region:'Centre',   town:'Yaoundé',   shop:'Cuisine & Saveurs', rating:4.7, reviews:38, views:112, stock:50, verified:true,  m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'🌶️' },
  { id:11, name:'Chaussures derby cuir',  price:42000,  category:'Mode',         badge:null,    region:'Sud-Ouest',town:'Buea',      shop:'FashionHub Buea',   rating:4.4, reviews:14, views:88,  stock:6,  verified:false, m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'👞' },
  { id:12, name:'Tabouret pliant bois',   price:8500,   category:'Maison',       badge:'Promo', region:'Centre',   town:'Mbalmayo', shop:'Déco Yaoundé',      rating:4.2, reviews:7,  views:44,  stock:22, verified:false, m_img:'https://i.pinimg.com/736x/35/bb/85/35bb853bc438f8f020ffb9887be6ddb2.jpg', icon:'🪑' },
];

/* ─── helpers ─────────────────────────────────────── */
const fmtPrice = (n) => n.toLocaleString('fr-CM');

const badgeColor = (b) => ({
  New:'bg-emerald-500', Sale:'bg-amber-400', Hot:'bg-rose-500',
  Local:'bg-green-700', Promo:'bg-violet-500',
}[b] || 'bg-gray-400');

/* ─── StarRow ─────────────────────────────────────── */
const StarRow = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={size}
        className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
    ))}
  </div>
);

/* ─── ProductCard ─────────────────────────────────── */
const ProductCard = ({ p, viewMode }) => {

  const handleClick = async () => {
    try {
      const res = await fetch('https://yamo-market-server.vercel.app/api/market/click-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clict_type: 'product', shoplead_ip: p.product_id, vendor:p.product_id, shop: p.shop }),
      });
    } catch (err) {
      console.log('Could not submit update.', 'error');
    }
  };

  const isList = viewMode === 'list';
  return (
    <div className={`group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 cursor-pointer ${isList ? 'flex items-center gap-4 p-3' : 'flex flex-col'}`}>

      {/* image / icon */}
      <Link to={`/product/${p.product_slug}`}>
      <div className={`relative bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center flex-shrink-0 ${isList ? 'w-24 h-24 rounded-xl' : 'h-44'}`}>
        {p.m_img
          ? <img src={p.m_img} onClick={handleClick} className={`${isList && 'rounded-xl'} w-full h-full object-cover`} />
          : <span className={`select-none group-hover:scale-110 transition-transform duration-300 ${isList ? 'text-4xl' : 'text-6xl'}`}>{p.icon}</span>
        }
        {p.tag && !isList && (
          <span className={`absolute top-3 left-3 ${badgeColor(p.tag)} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full`}>{p.tag}</span>
        )}
        {p.status && !isList && (
          <span
            className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-lg shadow-black/10 text-white text-[11px] font-semibold tracking-wide"
          >
            <BadgeCheck size={13} className="text-emerald-400" />
            Verified
          </span>
        )}
      </div>
      </Link>

      {/* body */}
      <div className={`flex flex-col flex-1 min-w-0 ${isList ? '' : 'p-4'}`}>
       <div className='flex gap-1'>
        {isList && p.tag && (
          <span className={`${badgeColor(p.tag)} text-white text-[9px] font-bold px-2 py-0.5 rounded-full w-fit`}>{p.tag}</span>
        )}
        {p.status && isList && (
          <span
            className="flex items-center justify-center gap-0.5 mt-0.5 text-[9px] px-1 rounded-full w-fit bg-green-500 backdrop-blur-md border border-white/20 shadow-lg shadow-black/10 text-white font-semibold"
          >
            <BadgeCheck size={10} className="text-emerald-400" />
            Verified
          </span>
        )}
       </div>
        <p className={`font-semibold text-gray-800 truncate ${isList ? 'text-sm' : 'text-sm mb-0.5'}`}>{p.product_name}</p>

        <div className="flex items-center gap-1 mt-0.5 mb-1">
          <ShoppingBag size={9} className="text-gray-400 flex-shrink-0" />
          <p className="text-[10px] text-gray-400 truncate">{p.shop_name}</p>
          {p.status && <BadgeCheck size={10} className="text-green-600 flex-shrink-0" />}
        </div>

        {!isList && (
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <MapPin size={9} /> {p.town}, {p.region}
          </p>
        )}

        <div className={`flex items-center justify-between ${isList ? 'mt-2' : 'mt-3'}`}>
          <div className='ml-1'>
            <span className="text-green-700 font-bold text-sm">{fmtPrice(p.price)}</span>
            <span className="text-xs text-gray-400 ml-1">XAF</span>
          </div>
          <div className="flex items-center">
            <Link to={`/product/${p.product_slug}`}>
            <button className="text-xs font-medium text-green-700 border border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600 px-3 py-1.5 rounded-lg transition-all">
              Voir
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Dropdown ────────────────────────────────────── */
const Dropdown = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-green-400 transition-colors min-w-[160px] justify-between"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="max-h-52 overflow-y-auto">
              {options.map(opt => {
                const label_ = typeof opt === 'string' ? opt : opt.label;
                const val_   = typeof opt === 'string' ? opt : opt.value;
                return (
                  <button key={val_} onClick={() => { onChange(val_); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === label_ ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {label_}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────── */
const ProductsPage = () => {
   const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState('');
  const [category, setCategory]   = useState('Toutes');
  const [region, setRegion]       = useState('Toutes les régions');
  const [priceRange, setPriceRange] = useState('Tous les prix');
  const [badge, setBadge]         = useState('Tous');
  const [sortBy, setSort]         = useState('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode]   = useState('grid');
  const [showFilters, setShowFilters]   = useState(false);

  /* fetch products from API (falls back to mock) */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://yamo-market-server.vercel.app/api/market/getallproducts', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('API error');

        const result = await res.json();
        setProducts(result.data);

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ── resolve selected price range object ── */
  const priceObj = PRICE_RANGES.find(r => r.label === priceRange);

  /* ── active filter count ── */
  const activeCount = [
    category     !== 'Toutes',
    region       !== 'Toutes les régions',
    priceRange   !== 'Tous les prix',
    badge        !== 'Tous',
    verifiedOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setCategory('Toutes'); setRegion('Toutes les régions');
    setPriceRange('Tous les prix'); setBadge('Tous');
    setVerifiedOnly(false); setInStockOnly(false); setQuery('');
  };

  /* ── filter ── */
  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const q = query.toLowerCase();
      return (
        (!q || p.product_name?.toLowerCase().includes(q) || p.shop_name?.toLowerCase().includes(q) || p.town?.toLowerCase().includes(q)) &&
        (category  === 'Toutes'             || p.product_category === category) &&
        (region    === 'Toutes les régions' || p.region   === region) &&
        (p.price   >= priceObj.min && p.price <= priceObj.max) &&
        (badge     === 'Tous'               || p.tag    === badge) &&
        (verifiedOnly === !p.status || p.status)
      );
    });

    return list;
  }, [products, query, category, region, priceObj, badge, verifiedOnly]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

          <div className="flex pt-12 justify-between gap-1">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-4">
                <Package size={12} /> Tous les produits
              </span>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Nos Produits</h1>
              <p className="text-green-200 mt-2 text-sm max-w-md">
                Découvrez des centaines de produits locaux — authentiques, vérifiés, livrés partout.
              </p>
            </div>
            <div className="flex gap-6 text-center">
              {[['340+','Produits'],['80+','Boutiques'],['4.7★','Note moy.']].map(([v,l]) => (
                <div key={l}>
                  <p className="text-2xl font-bold text-white">{v}</p>
                  <p className="text-green-300 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Main search bar ── */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl shadow-green-900/20 p-2 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher un produit, boutique, ville…"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none py-2 bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`relative flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl transition-all ${showFilters ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'}`}
            >
              <SlidersHorizontal size={15} /> Filtres
              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── Filter panel ── */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Region */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Région</label>
                <Dropdown
                  value={region}
                  options={REGIONS}
                  onChange={setRegion}
                />
              </div>

              {/* Price range */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Prix</label>
                <Dropdown
                  value={priceRange}
                  options={PRICE_RANGES.map(r => r.label)}
                  onChange={setPriceRange}
                />
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Badge</label>
                <Dropdown
                  value={badge}
                  options={BADGES}
                  onChange={setBadge}
                />
              </div>

              {/* Toggle options */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Options</label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setVerifiedOnly(v => !v)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${verifiedOnly ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-400'}`}
                  >
                    <span className="flex items-center gap-2"><BadgeCheck size={14} /> Vérifiés</span>
                    <div className={`w-8 h-4 rounded-full relative transition-all ${verifiedOnly ? 'bg-white/30' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${verifiedOnly ? 'left-4' : 'left-0.5'}`} />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* active filter chips */}
            {activeCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">Filtres actifs :</span>
                {category   !== 'Toutes'             && <Chip label={category}   onRemove={() => setCategory('Toutes')} />}
                {region     !== 'Toutes les régions' && <Chip label={region}     onRemove={() => setRegion('Toutes les régions')} icon={<MapPin size={9} />} />}
                {priceRange !== 'Tous les prix'      && <Chip label={priceRange} onRemove={() => setPriceRange('Tous les prix')} />}
                {badge      !== 'Tous'               && <Chip label={badge}      onRemove={() => setBadge('Tous')} />}
                {verifiedOnly && <Chip label="Vérifiés"  onRemove={() => setVerifiedOnly(false)} />}
                <button onClick={clearFilters} className="text-xs text-rose-500 hover:text-rose-700 font-medium ml-1 hover:underline">
                  Tout effacer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Category quick chips ── */}
      <div className="bg-white border-b border-gray-100 max-w-6xl mx-auto sticky top-[72px] z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                category === c
                  ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-base font-bold text-gray-900">
              Nos Produit
            </p>
            {query && (
              <p className="text-xs text-gray-400 mt-0.5">Résultats pour "<span className="text-gray-600 font-medium">{query}</span>"</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* view toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
              <button onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Grille"><Grid3X3 size={15} /></button>
              <button onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Liste"><List size={15} /></button>
            </div>
          </div>
        </div>

        {/* loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-44 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-4 bg-gray-100 rounded-full w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* empty state */
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-700 font-bold text-lg">Aucun produit trouvé</p>
            <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
              Essayez de modifier vos filtres ou d'élargir votre recherche.
            </p>
            <button onClick={clearFilters}
              className="mt-6 bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'flex flex-col gap-3'
          }>
            {filtered.map(p => (
              <ProductCard key={p.id} p={p} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── small helper chip ───────────────────────────── */
const Chip = ({ label, onRemove, icon }) => (
  <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
    {icon}{label}
    <button onClick={onRemove} className="ml-0.5 hover:text-green-900"><X size={10} /></button>
  </span>
);

export default ProductsPage;
