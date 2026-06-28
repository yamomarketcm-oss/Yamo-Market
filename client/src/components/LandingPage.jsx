import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, ShoppingBag, ChevronRight,
  Bell, User, Heart, TrendingUp, Shield, Zap, Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── static data ─────────────────────────────────── */
const CATEGORIES = ['All', 'Électronique', 'Mode', 'Beauté', 'Maison', 'Alimentation', 'Services', 'Autre'];

const FEATURES = [
  { icon: <Shield size={22} />, title: 'Vendeurs vérifiés', desc: 'Toutes les boutiques sont approuvées et vérifiées par notre équipe.' },
  { icon: <Zap size={22} />, title: 'Livraison rapide', desc: 'Recevez vos commandes en 24–48 h dans les grandes villes.' },
  { icon: <Package size={22} />, title: 'Large choix', desc: 'Plus de 340 produits dans 7 catégories différentes.' },
  { icon: <TrendingUp size={22} />, title: 'Meilleures offres', desc: 'Des promos exclusives chaque semaine sur Yamo Market.' },
];

/* ─── sub-components ──────────────────────────────── */
const StarRow = ({ rating, reviews }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={11}
        className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
    ))}
    <span className="text-xs text-gray-400 ml-1">{rating} ({reviews})</span>
  </div>
);

const badgeColor = (b) => ({
  New:'bg-emerald-500', Sale:'bg-amber-400', Hot:'bg-rose-500',
  Local:'bg-green-700', Promo:'bg-violet-500',
}[b] || 'bg-gray-400');

const ProductCard = ({ p, onFav, favs, Click }) => (

  <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-100/60 transition-all duration-300 flex flex-col">
   <Link to={`/product/${p.product_id}`}>
    <div className={`relative sm:h-48 h-40 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center`}>
        <img src={p.m_img} onClick={Click} alt={p.name} className="w-full h-full object-cover" />
        {p.tag && (
          <span className={`absolute top-3 left-3 ${badgeColor(p.tag)} text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide`}>
            {p.tag}
          </span>
        )}
      <button
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        aria-label="Ajouter aux favoris"
      >
        <Heart size={14} className={favs.includes(p.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
      </button>
    </div>
   </Link>
    <div className="p-4 flex flex-col flex-1">
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
        <ShoppingBag size={10} /> {p.shop_name}
      </p>
      <h3 className="font-semibold text-gray-800 text-sm leading-snug truncate">{p.product_name}</h3>
      <p className="text-xs text-gray-500 line-clamp-1">{p.desc}</p>
      <div className="pt-3 flex items-center justify-between">
        <span className="text-green-700 font-bold text-base">{p.price} <span className="text-xs font-normal text-gray-400">XAF</span></span>
        <Link to={`/product/${p.product_id}`} onClick={Click}>
          <button className="text-xs font-medium text-green-700 border border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600 px-3 py-1.5 rounded-lg transition-all duration-200">
            Voir
          </button>
        </Link>
      </div>
    </div>
  </div>
);

const BoutiqueCard = ({ b, Click }) => (
  <Link to={`/boutique/${b.shop_id}`} onClick={Click}>
  <div className="group bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 p-4 flex items-center gap-3 cursor-pointer">
    <div className={`w-16 h-16 rounded-xl ${b.color} flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform`}>
      <img src={b.profile} className='w-16 h-16 rounded-xl' />
    </div>
    <div className="min-w-0">
      <p className="font-semibold text-gray-800 text-sm truncate">{b.shop_name}</p>
      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
        <MapPin size={10} /> {b.region}, {b.town}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-medium">{b.category}</span>
        <span className="text-[10px] text-amber-500 font-medium flex items-center gap-0.5">
          <Star size={9} className="fill-amber-400 text-amber-400" /> TrusthWorthy
        </span>
      </div>
    </div>
    <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-green-500 transition-colors flex-shrink-0" />
  </div>
  </Link>
);

/* ─── main component ──────────────────────────────── */
const LandingPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favs, setFavs] = useState([]);
  const [products, setProducts]   = useState([]);
  const [shop, setShop]   = useState([]);
  const [loading, setLoading]     = useState(true);


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

    useEffect(() => {
      const fetchShop = async () => {
        setLoading(true);
        try {
          const res = await fetch('https://yamo-market-server.vercel.app/api/market/getshops', {
            headers: { 'Content-Type': 'application/json' },
          });
          if (!res.ok) throw new Error('API error');
  
          const result = await res.json();
          setShop(result.data);
  
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false);
        }
      };
      fetchShop();
    }, []);

  const toggleFav = (id) =>
    setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

 const handleClick = async (product) => {
  try {
    await fetch('https://yamo-market-server.vercel.app/api/market/click-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clict_type: 'product', shoplead_ip: product.product_id, vendor: product.product_id, shop: product.shop
      }),
    });
  } catch (err) {
    console.log('Could not submit update.', err);
  }
};

const handleClick2 = async (shop) => {
  try {
    await fetch('https://yamo-market-server.vercel.app/api/market/click-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       clict_type: 'shop', shoplead_ip: shop.shop_id, vendor: shop.shop_id, shop: shop.shop_id
      }),
    });
  } catch (err) {
    console.log('Could not submit update.', err);
  }
};

  const filtered = products.filter(p =>
    (activeCategory === 'All' || p.product_category === activeCategory) &&
    p.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const randomProducts = [...filtered];

for (let i = randomProducts.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [randomProducts[i], randomProducts[j]] = [randomProducts[j], randomProducts[i]];
}

const HomeProducts = randomProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
              Marketplace officiel — Cameroun
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Le marché<br />
              <span className="text-green-300">digital</span> du<br />
              Cameroun
            </h1>
            <p className="mt-5 text-green-100 text-lg leading-relaxed max-w-md">
              Découvrez des milliers de produits auprès de boutiques locales vérifiées — rapide, fiable, proche de chez vous.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
             <Link to='/products'>
              <button className="bg-white text-green-800 font-semibold text-sm px-7 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg shadow-green-900/20">
                Explorer les produits
              </button>
             </Link>
             <Link to='/boutiques'>
              <p className="border border-white/30 text-white font-semibold text-sm px-7 py-3 rounded-xl hover:bg-white/10 transition-colors">
                Voir les boutiques
              </p>
             </Link>
            </div>

            {/* mini stats */}
            <div className="mt-10 flex flex-wrap gap-8">
              {[['340+', 'Produits'], ['80+', 'Boutiques'], ['4.8★', 'Note moyenne']].map(([n, l]) => (
                <div key={l}>
                  <p className="text-2xl font-bold text-white">{n}</p>
                  <p className="text-green-200 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating product cards */}
          <div className="hidden lg:flex items-center justify-center relative h-80">
            {/* card 1 */}
            <div className="absolute cursor-pointer -top-4 left-0 bg-white rounded-2xl shadow-2xl p-4 w-52 rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
              <div className="h-24 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl flex items-center justify-center text-4xl mb-3">📱</div>
              <p className="text-xs text-gray-500 truncate">TechShop Douala</p>
              <p className="font-bold text-gray-800 text-sm">Smartphone Pro Max</p>
              <p className="text-green-700 font-bold text-sm mt-1">85 000 XAF</p>
            </div>
            {/* card 2 */}
            <div className="absolute cursor-pointer top-8 right-0 bg-white rounded-2xl shadow-2xl p-4 w-48 rotate-[5deg] hover:rotate-0 transition-transform duration-500">
              <div className="h-20 bg-gradient-to-br from-lime-50 to-emerald-100 rounded-xl flex items-center justify-center text-3xl mb-3">🎧</div>
              <p className="text-xs text-gray-500 truncate">SoundHub</p>
              <p className="font-bold text-gray-800 text-sm">Casque sans-fil</p>
              <p className="text-green-700 font-bold text-sm mt-1">22 000 XAF</p>
            </div>
            {/* card 3 */}
            <div className="absolute cursor-pointer -bottom-4 left-12 bg-white rounded-2xl shadow-xl p-3 w-40">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">⌚</div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Montre smart</p>
                  <p className="text-green-700 text-xs font-bold">55 000 XAF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search (mobile) ── */}
      <div className="sm:hidden px-4 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center px-4 py-3 gap-3">
          <Search size={16} className="text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher…"
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* ── Features bar ── */}
      <section id="features" className="bg-white border-b border-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="flex sm:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Produits en vedette</h2>
            <p className="text-sm text-gray-400 -mt-1.5">Les meilleures annonces du moment</p>
          </div>
          <Link to='/products'>
            <button className="flex items-center mt-4 gap-1 text-sm text-green-700 font-medium hover:text-green-300 self-start sm:self-auto">
              Voir tout <ChevronRight size={15} />
            </button>
          </Link>
        </div>

        {/* Category chips */}
        <div className="flex gap-1 flex-wrap mb-8">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                activeCategory === c
                  ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {
          HomeProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {HomeProducts.map(p => (
                <ProductCard key={p.product_id} p={p} Click={() => handleClick(p)} onFav={toggleFav} favs={favs} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-gray-700 font-bold text-lg">Aucun produit trouvé</p>
              <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                Essayez de modifier vos filtres ou d'élargir votre recherche.
              </p>
              <button onClick={() => setActiveCategory('All')}
                className="mt-6 bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
                Réinitialiser les filtres
              </button>
          </div>
          )
        }
      </section>

      {/* ── Promo banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="relative bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl overflow-hidden px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-green-200 text-sm font-medium mb-1">Cette semaine seulement</p>
            <h2 className="text-white text-3xl font-extrabold leading-tight">Semaine des<br />bonnes affaires</h2>
            <p className="text-green-100 text-sm mt-2 max-w-xs">Des réductions exclusives sur des centaines de produits dans toutes les catégories.</p>
            <button className="mt-5 bg-white text-green-800 font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-green-50 transition-colors shadow-lg">
              Explorer les offres
            </button>
          </div>
          <div className="relative z-10 text-center sm:w-fit w-full bg-white/10 border border-white/20 rounded-2xl px-10 py-6 flex-shrink-0">
            <p className="text-6xl font-black text-green-200 leading-none">90%</p>
            <p className="text-white/80 text-sm mt-1">réduction max</p>
          </div>
        </div>
      </section>

      {/* ── Boutiques ── */}
      <section id="boutiques" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Boutiques de confiance</h2>
              <p className="text-sm font-medium text-gray-400 -mt-1">Toutes vérifiées par l'équipe Yamo Market</p>
            </div>
            <Link to='/boutiques'>
              <button className="flex items-center gap-1 text-sm mt-2 text-green-700 font-medium hover:text-green-500">
                Voir Tout <ChevronRight size={15} />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shop.map(b => <BoutiqueCard key={b.shop_id} b={b} Click={() => handleClick2(b)} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;