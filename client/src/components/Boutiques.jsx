import React, { useState, useMemo } from 'react';
import {
  Search, MapPin, Star, ChevronRight, BadgeCheck,
  Filter, X, SlidersHorizontal, Store, Users,
  TrendingUp, Package, ArrowLeft, Grid3X3, List,
  ChevronDown, Clock
} from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ─── static data ─────────────────────────────────── */
const REGIONS = [
  'Toutes les régions',
  'Centre', 'Littoral', 'Ouest', 'Nord-Ouest',
  'Sud-Ouest', 'Adamaoua', 'Nord', 'Extrême-Nord',
  'Est', 'Sud',
];

const TOWNS = {
  'Toutes les régions': ['Toutes les villes'],
  Centre:        ['Toutes les villes', 'Yaoundé', 'Mbalmayo', 'Obala', 'Nanga-Eboko'],
  Littoral:      ['Toutes les villes', 'Douala', 'Nkongsamba', 'Edéa', 'Loum'],
  Ouest:         ['Toutes les villes', 'Bafoussam', 'Dschang', 'Mbouda', 'Bangangté'],
  'Nord-Ouest':  ['Toutes les villes', 'Bamenda', 'Kumbo', 'Wum', 'Nkambe'],
  'Sud-Ouest':   ['Toutes les villes', 'Buea', 'Limbe', 'Kumba', 'Mamfé'],
  Adamaoua:      ['Toutes les villes', 'Ngaoundéré', 'Meiganga', 'Tibati'],
  Nord:          ['Toutes les villes', 'Garoua', 'Guider', 'Figuil'],
  'Extrême-Nord':['Toutes les villes', 'Maroua', 'Kousseri', 'Mokolo'],
  Est:           ['Toutes les villes', 'Bertoua', 'Batouri', 'Abong-Mbang'],
  Sud:           ['Toutes les villes', 'Ebolowa', 'Kribi', 'Sangmélima'],
};

const CATEGORIES = ['Toutes', 'Électronique', 'Mode', 'Beauté', 'Maison', 'Alimentation', 'Services', 'Sport', 'Auto'];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Mieux notées' },
  { value: 'sales', label: 'Plus de ventes' },
  { value: 'products', label: 'Plus de produits' },
  { value: 'newest', label: 'Plus récentes' },
];

const BOUTIQUES = [
  { id: 1, name: 'TechShop Douala', tagline: 'Votre destination tech', icon: '💻', category: 'Électronique', region: 'Littoral', town: 'Douala', rating: 4.8, reviews: 312, sales: 1240, products: 48, followers: 890, verified: true, responseTime: '< 1h', joined: '2022', badge: 'Top vendeur' },
  { id: 2, name: 'Mode Afrique', tagline: 'La mode africaine moderne', icon: '👗', category: 'Mode', region: 'Centre', town: 'Yaoundé', rating: 4.6, reviews: 198, sales: 870, products: 134, followers: 1200, verified: true, responseTime: '< 2h', joined: '2021', badge: 'Top vendeur' },
  { id: 3, name: 'Beauté Prestige', tagline: 'Produits beauté authentiques', icon: '✨', category: 'Beauté', region: 'Ouest', town: 'Bafoussam', rating: 4.9, reviews: 445, sales: 2100, products: 86, followers: 2300, verified: true, responseTime: '< 30min', joined: '2020', badge: 'Premium' },
  { id: 4, name: 'Déco Yaoundé', tagline: 'Meublez votre intérieur', icon: '🪴', category: 'Maison', region: 'Centre', town: 'Yaoundé', rating: 4.5, reviews: 87, sales: 340, products: 62, followers: 430, verified: false, responseTime: '< 3h', joined: '2023', badge: null },
  { id: 5, name: 'SportZone CM', tagline: 'Équipements sportifs pro', icon: '⚽', category: 'Sport', region: 'Littoral', town: 'Douala', rating: 4.4, reviews: 156, sales: 520, products: 95, followers: 670, verified: true, responseTime: '< 2h', joined: '2022', badge: null },
  { id: 6, name: 'ElectroPlus Bamenda', tagline: 'High-tech à Bamenda', icon: '🔌', category: 'Électronique', region: 'Nord-Ouest', town: 'Bamenda', rating: 4.3, reviews: 72, sales: 210, products: 38, followers: 290, verified: false, responseTime: '< 4h', joined: '2023', badge: null },
  { id: 7, name: 'Cuisine & Saveurs', tagline: 'Épices et produits locaux', icon: '🌶️', category: 'Alimentation', region: 'Centre', town: 'Yaoundé', rating: 4.7, reviews: 234, sales: 1800, products: 210, followers: 1650, verified: true, responseTime: '< 1h', joined: '2021', badge: 'Top vendeur' },
  { id: 8, name: 'AutoParts Douala', tagline: 'Pièces auto certifiées', icon: '🔧', category: 'Auto', region: 'Littoral', town: 'Douala', rating: 4.5, reviews: 118, sales: 460, products: 312, followers: 540, verified: true, responseTime: '< 2h', joined: '2022', badge: null },
  { id: 9, name: 'GlamourShop Limbe', tagline: 'Beauté & bien-être', icon: '💄', category: 'Beauté', region: 'Sud-Ouest', town: 'Limbe', rating: 4.6, reviews: 143, sales: 620, products: 74, followers: 780, verified: true, responseTime: '< 1h', joined: '2022', badge: null },
  { id: 10, name: 'MaisonPlus Garoua', tagline: 'Déco et ameublement', icon: '🛋️', category: 'Maison', region: 'Nord', town: 'Garoua', rating: 4.2, reviews: 49, sales: 180, products: 41, followers: 210, verified: false, responseTime: '< 5h', joined: '2023', badge: null },
  { id: 11, name: 'FashionHub Buea', tagline: 'Mode tendance anglophone', icon: '🧥', category: 'Mode', region: 'Sud-Ouest', town: 'Buea', rating: 4.4, reviews: 91, sales: 330, products: 58, followers: 420, verified: true, responseTime: '< 2h', joined: '2022', badge: null },
  { id: 12, name: 'TechVision Kribi', tagline: 'Tech et numérique', icon: '📱', category: 'Électronique', region: 'Sud', town: 'Kribi', rating: 4.1, reviews: 38, sales: 140, products: 27, followers: 160, verified: false, responseTime: '< 6h', joined: '2024', badge: null },
];

/* ─── sub-components ──────────────────────────────── */
const StarRow = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={size}
        className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
    ))}
  </div>
);

const BoutiqueCard = ({ b, viewMode }) => {
  const isList = viewMode === 'list';
  return (
        <Link to={`/boutique/${b.shop_id}`}>
    <div className={`group bg-white border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 cursor-pointer overflow-hidden ${isList ? 'flex items-center gap-4 p-4' : ''}`}>
      {/* cover / icon */}
      {isList ? (
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
            <img src={b.profile} alt="" className="w-full h-full object-cover rounded-lg" />
          </div>
      ) : (
        <div className="relative h-36 bg-gradient-to-br from-green-700 to-emerald-600 flex items-center justify-center overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
            <img src={b.profile} alt="" className="w-full h-full object-cover" />
          {b.badge && (
            <span className="absolute top-3 left-3 bg-white/20 border border-white/30 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              {b.badge}
            </span>
          )}
          {b.status && (
            <span className="absolute top-3 right-3 bg-white/20 border border-white/30 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
              <BadgeCheck size={10} /> Vérifié
            </span>
          )}
        </div>
      )}

      {/* body */}
      <div className={`flex-1 min-w-0 ${isList ? '' : 'p-4'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-gray-800 text-sm truncate">{b.shop_name}</h3>
              {isList && b.status && <BadgeCheck size={13} className="text-green-600 flex-shrink-0" />}
            </div>
          </div>
          <ChevronRight size={15} className="text-gray-300 text-xs font-medium group-hover:text-green-500 transition-colors flex-shrink-0 mt-0.5" />
        </div>

        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} className="text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500 font-semibold">{b.town}, {b.region}, {b.address}</span>
        </div>

        <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-1 ${isList ? 'hidden sm:flex' : ''}`}>
          {[
            { icon: <Package size={10} />, val: 'Nos produits' },
            { icon: <TrendingUp size={10} />, val: `Ads ventes` },
            { icon: <Clock size={10} />, val: 'Visit' },
          ].map(s => (
            <span key={s.val} className="flex items-center gap-1 text-[11px] text-gray-400">
              <span className="text-green-500 font-medium">{s.icon}</span>{s.val}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full font-medium">
            {b.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <Users size={10} /> Trusth Worthy
          </span>
        </div>
      </div>
    </div>
      </Link>
  );
};

/* ─── main component ──────────────────────────────── */
const Boutiques = () => {
  const [query, setQuery]               = useState('');
  const [selectedRegion, setRegion]     = useState('Toutes les régions');
  const [selectedTown, setTown]         = useState('Toutes les villes');
  const [selectedCategory, setCategory] = useState('Toutes');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode]         = useState('grid');
  const [showFilters, setShowFilters]   = useState(false);
  const [regionOpen, setRegionOpen]     = useState(false);
  const [townOpen, setTownOpen]         = useState(false);
  const [boutique, setBoutique]         = useState([])
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
      const fetchBoutiques = async () => {
        setLoading(true);
        try {
          const res = await fetch('http://localhost:5050/api/market/getshops', {
            headers: { 'Content-Type': 'application/json' },
          });
          if (!res.ok) throw new Error('API error');
  
          const result = await res.json();
          setBoutique(result.data);
          setLoading(false)
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false);
        }
      };
      fetchBoutiques();
    }, []);

  const handleRegionChange = (r) => {
    setRegion(r);
    setTown('Toutes les villes');
    setRegionOpen(false);
  };

  const activeFilterCount = [
    selectedRegion !== 'Toutes les régions',
    selectedTown !== 'Toutes les villes',
    selectedCategory !== 'Toutes',
    verifiedOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setRegion('Toutes les régions');
    setTown('Toutes les villes');
    setCategory('Toutes');
    setVerifiedOnly(false);
    setQuery('');
  };

  const filtered = useMemo(() => {
    let list = boutique.filter(b => {
      const q = query.toLowerCase();
      const matchQuery = !q || b.shop_name.toLowerCase().includes(q) || b.town.toLowerCase().includes(q) || b.region.toLowerCase().includes(q)
      const matchRegion = selectedRegion === 'Toutes les régions' || b.region === selectedRegion;
      const matchTown = selectedTown === 'Toutes les villes' || b.town === selectedTown;
      const matchCat = selectedCategory === 'Toutes' || b.category === selectedCategory;
      const matchVerified = !verifiedOnly || b.status;
      return matchQuery && matchRegion && matchTown && matchCat && matchVerified;
    });
    return list;
  }, [boutique, query, selectedRegion, selectedTown, selectedCategory, verifiedOnly]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page hero ── */}
      <section className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-green-200 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Retour à l'accueil
          </button>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-4">
                <Store size={12} /> Marketplace officiel
              </span>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Nos Boutiques</h1>
              <p className="text-green-200 mt-2 text-sm max-w-md">
                Découvrez les boutiques locales vérifiées à travers tout le Cameroun.
              </p>
            </div>
            <div className="flex gap-6 text-center">
              {[['80+', 'Boutiques'], ['10', 'Régions'], ['4.6★', 'Note moy.']].map(([v, l]) => (
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
                placeholder="Rechercher une boutique, ville, catégorie…"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none py-2 bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`relative flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl transition-all ${showFilters ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'}`}
            >
              <SlidersHorizontal size={15} /> Filtres
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── Filter panel (collapsible) ── */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Region dropdown */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Région</label>
                <button
                  onClick={() => { setRegionOpen(o => !o); setTownOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-green-400 transition-colors"
                >
                  <span className="flex items-center gap-2"><MapPin size={14} className="text-green-600" />{selectedRegion}</span>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform ${regionOpen ? 'rotate-180' : ''}`} />
                </button>
                {regionOpen && (
                  <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    <div className="max-h-52 overflow-y-auto">
                      {REGIONS.map(r => (
                        <button
                          key={r}
                          onClick={() => handleRegionChange(r)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedRegion === r ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Town dropdown */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Ville</label>
                <button
                  onClick={() => { setTownOpen(o => !o); setRegionOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-green-400 transition-colors disabled:opacity-50"
                  disabled={selectedRegion === 'Toutes les régions'}
                >
                  <span className="flex items-center gap-2"><MapPin size={14} className="text-green-600" />{selectedTown}</span>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform ${townOpen ? 'rotate-180' : ''}`} />
                </button>
                {townOpen && selectedRegion !== 'Toutes les régions' && (
                  <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    <div className="max-h-48 overflow-y-auto">
                      {(TOWNS[selectedRegion] || []).map(t => (
                        <button
                          key={t}
                          onClick={() => { setTown(t); setTownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedTown === t ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-green-400 outline-none transition-colors appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Verified toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Options</label>
                <button
                  onClick={() => setVerifiedOnly(v => !v)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${verifiedOnly ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-400'}`}
                >
                  <span className="flex items-center gap-2">
                    <BadgeCheck size={15} /> Vendeurs vérifiés
                  </span>
                  <div className={`w-9 h-5 rounded-full transition-all relative ${verifiedOnly ? 'bg-white/30' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${verifiedOnly ? 'left-4' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>

            {/* active chips */}
            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">Filtres actifs :</span>
                {selectedRegion !== 'Toutes les régions' && (
                  <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    <MapPin size={10} /> {selectedRegion}
                    <button onClick={() => { setRegion('Toutes les régions'); setTown('Toutes les villes'); }} className="ml-0.5 hover:text-green-900"><X size={11} /></button>
                  </span>
                )}
                {selectedTown !== 'Toutes les villes' && (
                  <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    <MapPin size={10} /> {selectedTown}
                    <button onClick={() => setTown('Toutes les villes')} className="ml-0.5 hover:text-green-900"><X size={11} /></button>
                  </span>
                )}
                {selectedCategory !== 'Toutes' && (
                  <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    {selectedCategory}
                    <button onClick={() => setCategory('Toutes')} className="ml-0.5 hover:text-green-900"><X size={11} /></button>
                  </span>
                )}
                {verifiedOnly && (
                  <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    <BadgeCheck size={10} /> Vérifiés
                    <button onClick={() => setVerifiedOnly(false)} className="ml-0.5 hover:text-green-900"><X size={11} /></button>
                  </span>
                )}
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                selectedCategory === c
                  ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700'
              }`}
            >
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
              Nos Boutique
            </p>
            {(selectedRegion !== 'Toutes les régions' || selectedTown !== 'Toutes les villes') && (
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <MapPin size={10} />
                {selectedTown !== 'Toutes les villes' ? selectedTown : selectedRegion}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* view toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Vue grille"
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Vue liste"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* region group headers when no specific region selected */}
        {selectedRegion === 'Toutes les régions' && !query && selectedCategory === 'Toutes' && !verifiedOnly ? (
  loading ? (
    <div className="flex flex-col items-center gap-3 py-24">
      <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm font-medium">Chargement des boutiques…</p>
    </div>
  ) :
  /* group by region */
  REGIONS.slice(1).map(region => {
    const group = boutique.filter(b => b.region === region);
    if (!group.length) return null;
            return (
              <div key={region} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-green-600" />
                    <h2 className="text-base font-bold text-gray-800">{region}</h2>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{group.length}</span>
                  </div>
                </div>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'flex flex-col gap-3'
                }>
                  {group.map(b => <BoutiqueCard key={b.shop_id} b={b} viewMode={viewMode} />)}
                </div>
              </div>
            );
          })
        ) : filtered.length === 0 ? (
          /* empty state */
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🏪</p>
            <p className="text-gray-700 font-bold text-lg">Aucune boutique trouvée</p>
            <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
              Essayez de modifier vos filtres ou d'élargir votre zone de recherche.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          /* flat results */
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'flex flex-col gap-3'
          }>
            {filtered.map(b => <BoutiqueCard key={b.shop_id} b={b} viewMode={viewMode} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Boutiques;
