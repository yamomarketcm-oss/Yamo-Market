import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Store, Package, ShieldCheck,
  Bell, Settings, LogOut, Search, ChevronRight, X,
  CheckCircle2, XCircle, AlertCircle, Eye, Trash2,
  TrendingUp, ShoppingBag, BadgeCheck, Clock, Filter,
  MoreVertical, RefreshCw, FileText, Megaphone, Menu,
  ArrowUpRight, ArrowDownRight, Activity, Ban, Image as ImageIcon,
  Calendar, Link as LinkIcon, ToggleLeft, ToggleRight, Phone, Mail, MapPin, CreditCard,
  Fingerprint,
  MousePointerClick
} from 'lucide-react';

const ACTIVITY_LOG = [
  { id: 1, action: 'Utilisateur vérifié',    subject: 'Nos Utilisateur',  time: '',  type: 'verify'  },
  { id: 2, action: 'Boutique approuvée',      subject: 'Market Place',       time: '', type: 'approve' },
  { id: 3, action: 'Produit supprimé',        subject: 'Les Produit Expire', time: '',    type: 'delete'  },
  { id: 4, action: 'Utilisateur suspendu',    subject: 'Utilisateur Banni',   time: '',    type: 'ban'     },
  { id: 5, action: 'Boutique refusée',        subject: 'Des Boutique Suspendu',   time: '',    type: 'reject'  },
  { id: 6, action: 'Annonce publiée',         subject: 'Nos Publicite',   time: '',    type: 'ad'      },
];

/* ─── helpers ─────────────────────────────────────── */
const API = 'http://localhost:5050/api/market';
const token = () => localStorage.getItem('market_token');
const authHeader = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` });

const statusPill = (active) => active
  ? <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700"><CheckCircle2 size={9} /> Vérifié</span>
  : <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full w-24 bg-amber-100 text-amber-600"><Clock size={9} /> En attente</span>;

const activityIcon = (type) => ({
  verify:  <div className="w-7 h-7 rounded-xl bg-green-100 flex items-center justify-center"><BadgeCheck size={14} className="text-green-600" /></div>,
  approve: <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center"><Store size={14} className="text-blue-600" /></div>,
  delete:  <div className="w-7 h-7 rounded-xl bg-rose-100 flex items-center justify-center"><Trash2 size={14} className="text-rose-500" /></div>,
  ban:     <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center"><Ban size={14} className="text-orange-500" /></div>,
  reject:  <div className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center"><XCircle size={14} className="text-red-500" /></div>,
  ad:      <div className="w-7 h-7 rounded-xl bg-violet-100 flex items-center justify-center"><Megaphone size={14} className="text-violet-600" /></div>,
}[type]);

/* ─── Toast ──────────────────────────────────────── */
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
      {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {toast.msg}
      <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-1"><X size={14} /></button>
    </div>
  );
};

/* ─── Confirm Modal ──────────────────────────────── */
const ConfirmModal = ({ config, onConfirm, onCancel }) => {
  if (!config) return null;
  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${config.iconBg}`}>
            {config.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{config.title}</h3>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">{config.desc}</p>
          <div className="flex gap-3 mt-6">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all">
              Annuler
            </button>
            <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all ${config.btnClass}`}>
              {config.btnLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── User Verification Detail Modal ────────────── */
const UserDetailModal = ({ user, onClose, onApprove, onReject }) => {
  if (!user) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
                {user.username[0]}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">{user.username}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Dossier de vérification</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <X size={14} className="text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5">
                <Mail size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5">
                <Phone size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5">
                <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* document info */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                <CreditCard size={13} /> Document d'identité
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {user.id_front && (
                  <div>
                    <img src={user.id_front} alt="Document - recto" className="w-full h-28 object-cover rounded-xl border border-gray-100" />
                    <p className="text-[10px] text-gray-400 mt-1 text-center">Recto</p>
                  </div>
                )}
                {user.id_back && (
                  <div>
                    <img src={user.id_back} alt="Document - verso" className="w-full h-28 object-cover rounded-xl border border-gray-100" />
                    <p className="text-[10px] text-gray-400 mt-1 text-center">Verso</p>
                  </div>
                )}
                {user.photo && (
                  <div>
                    <img src={user.photo} alt="Selfie de vérification" className="w-full h-28 object-cover rounded-xl border border-gray-100" />
                    <p className="text-[10px] text-gray-400 mt-1 text-center">Selfie</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
            <button onClick={() => onReject(user)} className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 hover:bg-red-50 text-red-500 text-sm font-bold py-2.5 rounded-xl transition-all">
              <XCircle size={14} /> Refuser
            </button>
            <button onClick={() => onApprove(user)} className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-green-200">
              <CheckCircle2 size={14} /> Approuver
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Ad Form Modal (create / edit) ──────────────── */
const AdFormModal = ({ ad, onSuccess, onClose }) => {
  const [form, setForm] = useState(ad || {
    title: '', product: '', slogan: '', chancing: '',
  });
 
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('market_token');
        const res = await fetch(`http://localhost:5050/api/market/getallproducts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const result = await res.json();
        setProducts(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error('Products fetch failed:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);
 
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
 
  const filteredProducts = products.filter(p =>
    (p.product_name || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.shop_name || p.shop || '').toLowerCase().includes(productSearch.toLowerCase())
  );
 
  /* selecting a product only links it — title and slogan stay manual */
  const selectProduct = (p) => {
    setForm(f => ({
      ...f,
      product: p.product_id ?? p.id ?? p._id,
      productSnapshot: {
        product_name: p.product_name,
        image: p.m_img,
        shop_name: p.shop_name || p.shop,
        price: p.price,
      },
    }));
    setShowPicker(false);
    setProductSearch('');
  };
 
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.product || isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      const token = localStorage.getItem('market_token');
      const response = await fetch('http://localhost:5050/api/market/createads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
 
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Échec de la création');
 
      onSuccess(
        { type: 'success', msg: ad ? 'Annonce mise à jour ✓' : 'Annonce créée avec succès ✓' },
        data
      );
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue, veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">{ad ? 'Modifier l\'annonce' : 'Nouvelle annonce'}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <X size={14} className="text-gray-500" />
            </button>
          </div>
 
          <div className="space-y-3.5">
            {/* error banner */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="flex-shrink-0" /> {error}
              </div>
            )}
 
            {/* Product picker */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Produit</label>
              {form.productSnapshot ? (
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2.5">
                  {form.productSnapshot.image ? (
                    <img src={form.productSnapshot.image} alt={form.productSnapshot.product_name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                      <Package size={16} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{form.productSnapshot.product_name}</p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {form.productSnapshot.shop_name}
                      {form.productSnapshot.price ? ` • ${Number(form.productSnapshot.price).toLocaleString('fr-FR')} FCFA` : ''}
                    </p>
                  </div>
                  <button onClick={() => setShowPicker(s => !s)} className="text-xs font-semibold text-green-700 hover:underline flex-shrink-0">
                    Changer
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowPicker(s => !s)}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 hover:border-green-400 text-gray-500 hover:text-green-700 text-sm font-semibold py-2.5 rounded-xl transition-all">
                  <Search size={14} /> Sélectionner un produit
                </button>
              )}
 
              {showPicker && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
                    <Search size={13} className="text-gray-400 flex-shrink-0" />
                    <input autoFocus value={productSearch} onChange={e => setProductSearch(e.target.value)}
                      placeholder="Rechercher un produit ou une boutique…"
                      className="w-full text-sm outline-none bg-transparent" />
                    <button onClick={() => setShowPicker(false)} className="flex-shrink-0">
                      <X size={13} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                    {productsLoading ? (
                      <p className="text-xs text-gray-400 text-center py-4">Chargement des produits…</p>
                    ) : filteredProducts.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">Aucun produit trouvé.</p>
                    ) : filteredProducts.map(p => (
                      <button key={p.id ?? p._id} onClick={() => selectProduct(p)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left transition-colors">
                        {p.m_img ? (
                          <img src={p.m_img} alt={p.product_name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                            <Package size={12} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{p.product_name}</p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {p.shop_name || p.shop}{p.price ? ` • ${Number(p.price).toLocaleString('fr-FR')} FCFA` : ''}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
 
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Titre</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Promo Smartphone -20%"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 transition-all" />
            </div>
 
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Slogan</label>
              <input value={form.slogan} onChange={e => set('slogan', e.target.value)} placeholder="Ex: Offre limitée, ne manquez pas ça !"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 transition-all" />
            </div>
 
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Chance d'affichage (%)</label>
              <input type="number" min="1" max="100" value={form.chancing} onChange={e => set('chancing', e.target.value)} placeholder="Ex: 50"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 transition-all" />
              <p className="text-[11px] text-gray-400 mt-1">Plus la valeur est élevée, plus l'annonce apparaît souvent.</p>
            </div>
          </div>
 
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} disabled={isLoading} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Annuler
            </button>
            <button onClick={handleSubmit} disabled={!form.title.trim() || !form.product || productsLoading || isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-md shadow-green-200">
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> {ad ? 'Enregistrement…' : 'Création…'}
                </>
              ) : (
                ad ? 'Enregistrer' : 'Créer l\'annonce'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Edit Ad Modal ──────────────────────────────── */
const EditAdModal = ({ ad, onSuccess, onClose }) => {
  const [form, setForm] = useState({
    title:    ad?.title    ?? '',
    slogan:   ad?.slogan   ?? '',
    chancing: ad?.chancing ?? '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');
 
  /* product details come from the joined ads query — read directly from ad prop */
  const product = ad?.product_name ? {
    product_name: ad.product_name,
    image:        ad.m_img ?? ad.image,
    shop_name:    ad.shop_name,
    price:        ad.price,
    category:     ad.category,
    stock:        ad.stock,
    description:  ad.description,
  } : ad?.productSnapshot ?? null;
 
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
 
  const handleSubmit = async () => {
    if (!form.title.trim() || isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      const token = localStorage.getItem('market_token');
      const response = await fetch(`http://localhost:5050/api/market/updatead/${ad.ads_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, product: ad.product }),
      });
 
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Échec de la mise à jour');
 
      onSuccess(
        { type: 'success', msg: 'Annonce mise à jour ✓' },
        { ...ad, ...form }
      );
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue, veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
 
          {/* header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900">Modifier l'annonce</h3>
              <p className="text-xs text-gray-400 mt-0.5">Les champs ci-dessous sont modifiables.</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <X size={14} className="text-gray-500" />
            </button>
          </div>
 
          <div className="px-6 py-5 space-y-4">
 
            {/* ── Product detail card (read-only, from joined query) ── */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Produit lié</p>
              {product ? (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex gap-4 p-4">
                    {product.image ? (
                      <img src={product.image} alt={product.product_name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                        <Package size={28} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{product.product_name}</p>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5">
                        {product.shop_name && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                            <Store size={10} /> {product.shop_name}
                          </span>
                        )}
                        {product.category && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                            <Package size={10} /> {product.category}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                        {product.price && (
                          <span className="font-bold text-gray-800">
                            {Number(product.price).toLocaleString('fr-FR')} FCFA
                          </span>
                        )}
                        {product.stock !== undefined && product.stock !== null && (
                          <span className={product.stock === 0 ? 'text-rose-500 font-semibold' : 'text-gray-500'}>
                            Stock : {product.stock}
                          </span>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-amber-50 border-t border-amber-100 px-4 py-2 flex items-center gap-1.5">
                    <AlertCircle size={11} className="text-amber-500 flex-shrink-0" />
                    <span className="text-[11px] text-amber-600 font-medium">Le produit lié ne peut pas être changé.</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <Package size={14} /> Aucun détail produit disponible.
                </div>
              )}
            </div>
 
            {/* error banner */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="flex-shrink-0" /> {error}
              </div>
            )}
 
            {/* ── Editable fields ── */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Titre</label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="Ex: Promo Smartphone -20%"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 transition-all" />
            </div>
 
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Slogan</label>
              <input value={form.slogan} onChange={e => set('slogan', e.target.value)}
                placeholder="Ex: Offre limitée, ne manquez pas ça !"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 transition-all" />
            </div>
 
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Chance d'affichage (%)</label>
              <input type="number" min="1" max="100" value={form.chancing} onChange={e => set('chancing', e.target.value)}
                placeholder="Ex: 50"
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 transition-all" />
              <p className="text-[11px] text-gray-400 mt-1">Plus la valeur est élevée, plus l'annonce apparaît souvent.</p>
            </div>
          </div>
 
          {/* footer */}
          <div className="flex gap-3 px-6 pb-6">
            <button onClick={onClose} disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Annuler
            </button>
            <button onClick={handleSubmit} disabled={!form.title.trim() || isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-md shadow-green-200">
              {isLoading
                ? <><RefreshCw size={14} className="animate-spin" /> Enregistrement…</>
                : 'Enregistrer'
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


const NAV = [
  { key: 'overview',      label: 'Vue d\'ensemble', icon: <LayoutDashboard size={16} /> },
  { key: 'verify-users',  label: 'Vérif. utilisateurs', icon: <ShieldCheck size={16} /> },
  { key: 'users',         label: 'Utilisateurs',        icon: <Users size={16} />          },
  { key: 'shops',         label: 'Boutiques',            icon: <Store size={16} />          },
  { key: 'products',      label: 'Produits',             icon: <Package size={16} />        },
  { key: 'ads',           label: 'Annonces',             icon: <Megaphone size={16} />      },
  { key: 'clicklogs',      label: 'Click',                icon: <Fingerprint size={16} />       },
  { key: 'activity',      label: 'Activité',             icon: <Activity size={16} />       },
  { key: 'settings',      label: 'Paramètres',           icon: <Settings size={16} />       },
];

/* ─── Main Admin component ───────────────────────── */
const AdminDashboard = () => {
  const [activeTab,  setActiveTab]  = useState('overview');
  const [sidebarOpen,setSidebarOpen]= useState(false);
  const [search,     setSearch]     = useState('');
  const [toast,      setToast]      = useState(null);
  const [confirm,    setConfirm]    = useState(null); // { config, onConfirm }
 
  /* local state for pending lists (so we can remove after action) */
  const [allUsers,      setAllUsers]      = useState([]);
  const [allShops,      setAllShops]      = useState([]);
  const [products,      setProducts]      = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [ads,           setAds]           = useState([]);
  const [adstotal, setAdsTotal]  = useState(null);
  const [showAdForm,    setShowAdForm]    = useState(false);
  const [editingAd,     setEditingAd]     = useState(null);
  const [showEditAd,    setShowEditAd]    = useState(false);
  const [editAdTarget,  setEditAdTarget]  = useState(null);

  const [usertotal, setUserTotal]  = useState(null);
  const [boutiquetotal, setBoutiqueTotal]  = useState(null);
  const [producttotal, setProductTotal]  = useState(null);

  const [updateproductId, setUpdateproductId] = useState(null);

  /* user detail / verification modal */
  const [userDetail, setUserDetail] = useState(null);

  const handleAddSuccess = (toastPayload, newAds) => {
    setAds(ad => [{ ...newAds}, ...ad]);
    setToast(toastPayload);
  };

   useEffect(() => {
        const fetchUsers = async () => {
          try {
            const token = localStorage.getItem('market_token');
            const res = await fetch(`http://localhost:5050/api/market/getallusers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }});
            if (!res.ok) throw new Error('Failed to fetch profile');
            const result = await res.json();
            setAllUsers(result.data);
            setUserTotal(result.total)
          } catch (error) {
            console.error('Profile fetch failed:', error);
            setAllUsers(null)
          }
        };
        fetchUsers();
      }, [])

       useEffect(() => {
        const fetchAllshops = async () => {
          try {
            const token = localStorage.getItem('market_token');
            const res = await fetch(`http://localhost:5050/api/market/getshops`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }});
            if (!res.ok) throw new Error('Failed to fetch profile');
            const result = await res.json();
            setAllShops(result.data);
            setBoutiqueTotal(result.total)
          } catch (error) {
            console.error('Profile fetch failed:', error);
            setAllShops(null)
          }
        };
        fetchAllshops();
      }, [])

       useEffect(() => {
        const fetchProducts = async () => {
          try {
            const token = localStorage.getItem('market_token');
            const res = await fetch(`http://localhost:5050/api/market/getallproducts`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }});
            if (!res.ok) throw new Error('Failed to fetch profile');
            const result = await res.json();
            setProducts(result.data);
            setProductTotal(result.total)
          } catch (error) {
            console.error('Profile fetch failed:', error);
            setProducts(null)
          }
        };
        fetchProducts();
      }, [])

      useEffect(() => {
        const fetchAds = async () => {
          try {
            const token = localStorage.getItem('market_token');
            const res = await fetch(`http://localhost:5050/api/market/getallads`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }});
            if (!res.ok) throw new Error('Failed to fetch profile');
            const result = await res.json();
            setAds(result.data);
            setAdsTotal(result.total)
          } catch (error) {
            console.error('Profile fetch failed:', error);
            setAds(null)
          }
        };
        fetchAds();
      }, [])

  /* fetch real products from backend (falls back to mock on error) */
  useEffect(() => {
    if (activeTab !== 'products') return;
    let cancelled = false;
    setProductsLoading(true);
    fetch(`${API}/products`, { headers: authHeader() })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : (data.products || []);
        if (list.length) setProducts(list);
      })
      .catch(() => { /* keep mock data */ })
      .finally(() => { if (!cancelled) setProductsLoading(false); });
    return () => { cancelled = true; };
  }, [activeTab]);

  const pendingUsers = allUsers.filter(u => !u.status && u.review === "review")

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const askConfirm = (config, onConfirm) => setConfirm({ config, onConfirm });
  const closeConfirm = () => setConfirm(null);

  const banUser = async (userId) => {
    try {
      await fetch(`${API}/ban-user/${userId}`, { method: 'PUT', headers: authHeader() });
    } catch { }
    setAllUsers(us => us.filter(u => u.id !== userId));
    showToast('Utilisateur suspendu');
  };

  const verifyUser = async (user, status, review) => {
    try {
      const token = localStorage.getItem('market_token');
      const res = await fetch(`http://localhost:5050/api/market/updateuser/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...user, status, review }),
      });
      if (!res.ok) throw new Error('Failed to submit update');
 
      /* remove from pending list and reflect new status in allUsers */
      setPendingUsers(ps => ps.filter(p => p.user_id !== user.user_id));
      setAllUsers(us => us.map(u => u.user_id === user.user_id ? { ...u, status } : u));
      showToast(status ? 'Utilisateur approuvé ✓' : 'Utilisateur refusé', status ? 'success' : 'error');
    } catch (err) {
      showToast('Impossible de traiter la demande.', 'error');
    }
  };

  const deleteShop = async (shopId) => {
    try {
      const token = localStorage.getItem('market_token');
      const res = await fetch(`http://localhost:5050/api/market/deleteshop/${shopId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Promo supprimé');
      setAllShops(s => s.filter(b => b.shop_id !== shopId));
    } catch {
      setToast('Could not remove manager');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('market_token');
      const res = await fetch(`http://localhost:5050/api/market/deleteproduct/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Produit supprimé');
      setProducts(s => s.filter(p => p.product_id !== productId));
    } catch {
      setToast('Could not remove manager');
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('market_token');
      const res = await fetch(`http://localhost:5050/api/market/deleteuser/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Utilisateur supprimé');
      setAllUsers(s => s.filter(u => u.user_id !== userId));
    } catch {
      setToast('Could not remove manager');
    }
  };

  /* ── Ads actions ── */
  const toggleAdStatus = (adId) => {
    setAds(as => as.map(a => a.id === adId ? { ...a, status: !a.status } : a));
  };

  const deleteAd = async (adId) => {
    try {
      const token = localStorage.getItem('market_token');
      const res = await fetch(`http://localhost:5050/api/market/deletead/${adId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Promo supprimé');
      setAds(as => as.filter(a => a.ads_id !== adId));
    } catch {
      setToast('Could not remove manager');
    }
  };

  /* ── Sidebar ── */
  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col h-full bg-gray-900`}>
      {/* logo */}
      <div className="px-5 py-6 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center">
            <ShoppingBag size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">YamoMarket</p>
            <p className="text-gray-500 text-[10px] mt-0.5">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(n => (
          <button key={n.key} onClick={() => { setActiveTab(n.key); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === n.key
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}>
            <span className="flex-shrink-0">{n.icon}</span>
            <span className="flex-1">{n.label}</span>
            {n.badge > 0 && (
              <span className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${activeTab === n.key ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'}`}>
                {n.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all">
          <LogOut size={16} /> Se déconnecter
        </button>
      </div>
    </div>
  );

  /* ── Top bar ── */
  const TopBar = ({ title, sub }) => (
    <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <Menu size={16} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-gray-900 leading-tight">{title}</h1>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <Search size={13} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
            className="text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400 w-40" />
        </div>
        <button className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <Bell size={16} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold text-sm">A</div>
      </div>
    </div>
  );

  /* ── OVERVIEW ── */
  const OverviewTab = () => (
    <div className="p-6 space-y-6">
      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
  { label: 'Utilisateurs',    value: usertotal, change: '+12%', up: true,  icon: <Users size={18} />,       color: 'bg-blue-100 text-blue-600'    },
  { label: 'Boutiques',       value: boutiquetotal,    change: '+5%',  up: true,  icon: <Store size={18} />,       color: 'bg-green-100 text-green-700'  },
  { label: 'Produits',        value: producttotal, change: '+8%',  up: true,  icon: <Package size={18} />,     color: 'bg-amber-100 text-amber-600'  },
  { label: 'En attente',      value: pendingUsers.length,    change: '-3',   up: false, icon: <Clock size={18} />,       color: 'bg-rose-100 text-rose-600'    },
].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <span className={`flex items-center gap-0.5 text-xs font-bold ${s.up ? 'text-green-600' : 'text-rose-500'}`}>
                {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{s.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 mt-3 leading-none">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 2 col: pending actions + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* pending */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-sm">Actions en attente</h2>
            <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2.5 py-1 rounded-full">{pendingUsers.length} en attente</span>
          </div>
          <div className="space-y-3">
            {pendingUsers.slice(0, 4).map(u => (
              <div key={u?.user_id} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-sm flex-shrink-0">
                  {u?.username[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{u?.username}</p>
                  <p className="text-xs text-gray-400">Vérification utilisateur • {u?.doc}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => askConfirm({
                    title: 'Approuver cet utilisateur ?',
                    desc: `Valider l'identité de "${u?.username}" sur YamoMarket.`,
                    icon: <BadgeCheck size={24} className="text-green-600" />,
                    iconBg: 'bg-green-100', btnClass: 'bg-green-600 hover:bg-green-700', btnLabel: 'Approuver'
                  }, () => { verifyUser(u, true, 'approved'); closeConfirm(); })}
                    className="w-8 h-8 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors">
                    <CheckCircle2 size={14} className="text-green-700" />
                  </button>
                  <button onClick={() => askConfirm({
                    title: 'Refuser cet utilisateur ?',
                    desc: `Rejeter la demande de "${u.username}".`,
                    icon: <XCircle size={24} className="text-red-500" />,
                    iconBg: 'bg-red-100', btnClass: 'bg-red-500 hover:bg-red-600', btnLabel: 'Refuser'
                  }, () => { verifyUser(u, true, 'approuve'); closeConfirm(); })}
                    className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors">
                    <XCircle size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
            {pendingUsers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">Aucune action en attente.</p>
            )}
            <button onClick={() => setActiveTab('verify-users')} className="w-full text-xs text-green-700 font-semibold py-2 hover:underline">
              Voir toutes les demandes →
            </button>
          </div>
        </div>

        {/* activity log */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-sm">Activité récente</h2>
            <button onClick={() => setActiveTab('activity')} className="text-xs text-green-700 font-semibold hover:underline">Tout voir</button>
          </div>
          <div className="space-y-3">
            {ACTIVITY_LOG.map(a => (
              <div key={a.id} className="flex items-center gap-3">
                {activityIcon(a.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{a.action}</p>
                  <p className="text-xs text-gray-400 truncate">{a.subject}</p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── VERIFY USERS ── */
  const VerifyUsersTab = () => (
    <div className="p-6 space-y-4">
      {pendingUsers.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
          <p className="font-bold text-gray-700">Aucune demande en attente</p>
          <p className="text-sm text-gray-400 mt-1">Toutes les vérifications ont été traitées.</p>
        </div>
      ) : pendingUsers.map(u => (
        <div key={u.user_id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-green-200 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
              {u.username[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-gray-900">{u.username}</p>
              </div>
              <div className="flex flex-wrap gap-x-1 gap-y-1 mt-1.5 text-xs text-gray-400">
                <span>{u.email},</span>
                <span>{u.phone},</span>
                <span>Inscrit le {u.created_at}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setUserDetail(u)}
                className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold px-4 py-0.5 sm:py-1.5 rounded-xl transition-all">
                Voir le dossier
              </button>
              <button
                onClick={() => askConfirm({
                  title: 'Approuver cet utilisateur ?',
                  desc: `Valider l'identité de "${u.username}" sur YamoMarket.`,
                  icon: <BadgeCheck size={24} className="text-green-600" />,
                  iconBg: 'bg-green-100', btnClass: 'bg-green-600 hover:bg-green-700', btnLabel: 'Approuver'
                }, () => { verifyUser(u, true, 'approved'); closeConfirm(); })}
                className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 sm:py-1.5 rounded-xl transition-all shadow-md shadow-green-200">
                Approuver
              </button>
              <button
                onClick={() => askConfirm({
                  title: 'Refuser cette demande ?',
                  desc: `Rejeter la demande de vérification de "${u.username}".`,
                  icon: <XCircle size={24} className="text-red-500" />,
                  iconBg: 'bg-red-100', btnClass: 'bg-red-500 hover:bg-red-600', btnLabel: 'Refuser'
                }, () => { verifyUser(u, true, 'approuve'); closeConfirm(); })}
                className="flex items-center justify-center gap-1.5 border border-red-200 hover:bg-red-50 text-red-500 text-xs font-bold px-4 sm:py-1.5 rounded-xl transition-all">
                Refuser
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /* ── ALL USERS ── */
  const UsersTab = () => {
    const filtered = allUsers.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Utilisateur','Email','Phone','Review','Statut',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 overflow-x-scroll">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                        {u.username[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{u.username}</p>
                        <p className="text-[10px] text-gray-400">{u.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.phone}</td>
                  <td className="">
                    <span className={`text-[10px] font-bold px-4 flex justify-center items-center w-fit rounded-full ${u.review === 'rejected' ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                      {u.review}
                    </span>
                  </td>
                  <td className="px-4 py-3">{statusPill(u.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Voir">
                        <Eye size={12} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => askConfirm({
                          title: 'Suspendre cet utilisateur ?',
                          desc: `"${u.username}" sera banni de la plateforme.`,
                          icon: <Ban size={24} className="text-orange-500" />,
                          iconBg: 'bg-orange-100', btnClass: 'bg-orange-500 hover:bg-orange-600', btnLabel: 'Suspendre'
                        }, () => { banUser(u.id); closeConfirm(); })}
                        className="w-7 h-7 rounded-lg bg-orange-50 hover:bg-orange-100 flex items-center justify-center transition-colors" title="Suspendre">
                        <Ban size={12} className="text-orange-500" />
                      </button>
                      <button
                        onClick={() => askConfirm({
                          title: 'Supprimer cet utilisateur ?',
                          desc: `Cette action est irréversible pour "${u.username}".`,
                          icon: <Trash2 size={24} className="text-red-500" />,
                          iconBg: 'bg-red-100', btnClass: 'bg-red-500 hover:bg-red-600', btnLabel: 'Supprimer'
                        }, () => { deleteUser(u.user_id); closeConfirm(); showToast('Utilisateur supprimé'); })}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors" title="Supprimer">
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ── ALL SHOPS ── */
  const ShopsTab = () => {
    const filtered = allShops.filter(s =>
      s.shop_name.toLowerCase().includes(search.toLowerCase()) ||
      s.username.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Boutique','Propriétaire','Région','Town','Address','Catégorie','Statut','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                        {s.shop_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{s.shop_name}</p>
                        <p className="text-[10px] text-gray-400">{new Date(s.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.username}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.region}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.town}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-700">{s.address}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{s.category}</span>
                  </td>
                  <td className="px-4 py-3">{statusPill(s.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Voir">
                        <Eye size={12} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => askConfirm({
                          title: 'Supprimer cette boutique ?',
                          desc: `"${s.shop_name}" et tous ses produits seront supprimés.`,
                          icon: <Trash2 size={24} className="text-red-500" />,
                          iconBg: 'bg-red-100', btnClass: 'bg-red-500 hover:bg-red-600', btnLabel: 'Supprimer'
                        }, () => { deleteShop(s.shop_id); closeConfirm(); })}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors" title="Supprimer">
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ── ACTIVITY ── */
  const ActivityTab = () => (
    <div className="p-6">
      <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50">
        {ACTIVITY_LOG.map(a => (
          <div key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
            {activityIcon(a.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{a.action}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.subject}</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── SETTINGS ── */
  const SettingsTab = () => (
    <div className="p-6 max-w-xl space-y-5">
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 text-sm mb-4">Paramètres généraux</h3>
        <div className="space-y-4">
          {['Nom de la plateforme', 'Email de contact', 'Téléphone support'].map(l => (
            <div key={l}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{l}</label>
              <input placeholder={l} className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 transition-all" />
            </div>
          ))}
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all">
            Sauvegarder
          </button>
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 text-sm mb-4">Zone de danger</h3>
        <button className="flex items-center gap-2 border border-red-200 hover:bg-red-50 text-red-500 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
          <Trash2 size={14} /> Réinitialiser les données de test
        </button>
      </div>
    </div>
  );

  /* ── PRODUCTS ── */
  const ProductsTab = () => {
    const filtered = products.filter(p =>
      (p.product_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.shop_name || '').toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="p-6">
        {productsLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <RefreshCw size={12} className="animate-spin" /> Chargement des produits…
          </div>
        )}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Produit','Boutique','Catégorie','Prix','Desc','Statut','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {p.m_img ? (
                        <img src={p.m_img} alt={p.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                          <Package size={14} />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{p.product_name}</p>
                        <p className="text-[10px] text-gray-400">Ajouté le {p.created_at || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                      <Store size={11} /> {p.shop_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-semibold">{p.tag || '—'}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-700">
                    {p.price ? `${Number(p.price).toLocaleString('fr-FR')} FCFA` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold line-clamp-1`}>
                      {p.desc || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{statusPill(!!p.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Voir">
                        <Eye size={12} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => askConfirm({
                          title: 'Supprimer ce produit ?',
                          desc: `"${p.name}" sera retiré de la boutique "${p.shop_name || p.shop}".`,
                          icon: <Trash2 size={24} className="text-red-500" />,
                          iconBg: 'bg-red-100', btnClass: 'bg-red-500 hover:bg-red-600', btnLabel: 'Supprimer'
                        }, () => { deleteProduct(p.product_id); closeConfirm(); showToast('Produit supprimé'); })}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors" title="Supprimer">
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !productsLoading && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">Aucun produit trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ── ADS ── */
  const AdsTab = () => (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{adstotal} annonce(s) configurée(s)</p>
        <button onClick={() => { setEditingAd(null); setShowAdForm(true); }}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-green-200">
          <Megaphone size={13} /> Nouvelle annonce
        </button>
      </div>

      {!ads || ads.length === 0 ? (
        <div className="text-center py-20">
          <Megaphone size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700">Aucune annonce</p>
          <p className="text-sm text-gray-400 mt-1">Créez votre première publicité pour le site.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map(a => (
            <div key={a.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
              {a?.m_img ? (
                <img src={a?.m_img} alt={a?.title} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-300">
                  <ImageIcon size={28} />
                </div>
              )}
              <div className="p-4">
                 <span className="inline-block text-[11px] font-bold px-3 rounded-full ml-1 bg-violet-100 text-violet-700 w-fit h-fit">{a?.product_category}</span>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-gray-900 text-sm leading-tight">{a?.title}</p>
                  <button onClick={() => toggleAdStatus(a.id)} className="flex-shrink-0" title="Activer / désactiver">
                    {a?.status === "active" ? <ToggleRight size={22} className="text-green-600" /> : <ToggleLeft size={22} className="text-gray-300" />}
                  </button>
                </div>
                <div className="text-sm font-semibold text-gray-400">
                  <p>{a.slogan}</p>
                </div>
                <div className='flex justify-end'>
                 <p className='text-sm font-semibold text-green-400'>{a?.price} XAF</p>
                </div>
                <div className="flex gap-2 mt-3.5">
                  <button onClick={() => { setEditAdTarget(a); setShowEditAd(true); }}
                    className="flex-1 text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-600 py-2 rounded-xl transition-all">
                    Modifier
                  </button>
                  <button
                    onClick={() => askConfirm({
                      title: 'Supprimer cette annonce ?',
                      desc: `"${a?.title}" sera retirée du site.`,
                      icon: <Trash2 size={24} className="text-red-500" />,
                      iconBg: 'bg-red-100', btnClass: 'bg-red-500 hover:bg-red-600', btnLabel: 'Supprimer'
                    }, () => { deleteAd(a?.ads_id); closeConfirm(); })}
                    className="flex-1 text-xs font-semibold border border-red-200 hover:bg-red-50 text-red-500 py-2 rounded-xl transition-all">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

 const ClicksTab = () => {
    const [shopData,    setShopData]    = useState([]);
    const [productData, setProductData] = useState([]);
    const [adsData,     setAdsData]     = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [activeType,  setActiveType]  = useState('shop');
    const [detailTarget, setDetailTarget] = useState(null); // { type, id, data }
    const [detailLoading, setDetailLoading] = useState(false);
 
    /* fetch all three admin summaries in parallel */
    useEffect(() => {
      const fetchAll = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('market_token');
          const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
          const [shopRes, productRes, adsRes] = await Promise.all([
            fetch('http://localhost:5050/api/market/admin?clict_type=shop',    { headers }),
            fetch('http://localhost:5050/api/market/admin?clict_type=product', { headers }),
            fetch('http://localhost:5050/api/market/admin?clict_type=ads',     { headers }),
          ]);
          const [s, p, a] = await Promise.all([shopRes.json(), productRes.json(), adsRes.json()]);
          setShopData(s.data    || []);
          setProductData(p.data || []);
          setAdsData(a.data     || []);
        } catch (err) {
          console.error('[ClicksTab]', err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAll();
    }, []);
 
    /* fetch detail (monthly) for a specific target */
    const fetchDetail = async (type, id) => {
      setDetailLoading(true);
      setDetailTarget({ type, id, data: null });
      try {
        const token = localStorage.getItem('market_token');
        const route = type === 'shop'    ? `shop/${id}`
                    : type === 'product' ? `product/${id}`
                    :                      `ads/${id}`;
        const res = await fetch(`http://localhost:5050/api/market/${route}?months=6`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const result = await res.json();
        setDetailTarget({ type, id, data: result });
      } catch (err) {
        console.error('[fetchDetail]', err.message);
      } finally {
        setDetailLoading(false);
      }
    };
 
    const activeData = activeType === 'shop' ? shopData : activeType === 'product' ? productData : adsData;
 
    /* total unique IPs across all entries of selected type */
    const totalUnique = activeData.reduce((sum, r) => sum + (r.unique_ips || 0), 0);
    const totalClicks = activeData.reduce((sum, r) => sum + (r.total_clicks || 0), 0);
 
    /* bar width % relative to max */
    const maxClicks = Math.max(...activeData.map(r => r.total_clicks), 1);
 
    const TYPE_TABS = [
      { key: 'shop',    label: 'Boutiques',  color: 'bg-blue-600',   light: 'bg-blue-50 text-blue-700 border-blue-200'   },
      { key: 'product', label: 'Produits',   color: 'bg-green-600',  light: 'bg-green-50 text-green-700 border-green-200' },
      { key: 'ads',     label: 'Annonces',   color: 'bg-violet-600', light: 'bg-violet-50 text-violet-700 border-violet-200' },
    ];
    const activeStyle = TYPE_TABS.find(t => t.key === activeType);
 
    return (
      <div className="p-6 space-y-6">
 
        {/* ── summary cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Clics boutiques (mois)',  value: shopData.reduce((s,r)=>s+r.total_clicks,0),    icon: <Store size={16} />,              color: 'bg-blue-100 text-blue-600'   },
            { label: 'Clics produits (mois)',   value: productData.reduce((s,r)=>s+r.total_clicks,0), icon: <Package size={16} />,            color: 'bg-green-100 text-green-700' },
            { label: 'Clics annonces (mois)',   value: adsData.reduce((s,r)=>s+r.total_clicks,0),     icon: <Megaphone size={16} />,          color: 'bg-violet-100 text-violet-700'},
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">
                {loading ? '—' : s.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
 
        {/* ── type selector ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Détail par cible</h2>
              <p className="text-xs text-gray-400 mt-0.5">Mois en cours — clics uniques par IP</p>
            </div>
            <div className="flex items-center gap-2">
              {TYPE_TABS.map(t => (
                <button key={t.key} onClick={() => { setActiveType(t.key); setDetailTarget(null); }}
                  className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                    activeType === t.key
                      ? `${t.color} text-white border-transparent shadow-md`
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
 
          {/* ── totals row ── */}
          <div className="flex gap-6 mb-5 p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total clics</p>
              <p className="text-lg font-extrabold text-gray-900">{loading ? '—' : totalClicks.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">IPs uniques</p>
              <p className="text-lg font-extrabold text-gray-900">{loading ? '—' : totalUnique.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Entrées</p>
              <p className="text-lg font-extrabold text-gray-900">{loading ? '—' : activeData.length}</p>
            </div>
          </div>
 
          {/* ── bar list ── */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="h-3 bg-gray-100 rounded-full w-24 flex-shrink-0" />
                  <div className="h-6 bg-gray-100 rounded-xl flex-1" />
                  <div className="h-3 bg-gray-100 rounded-full w-16 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : activeData.length === 0 ? (
            <div className="text-center py-12">
              <MousePointerClick size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold text-sm">Aucun clic enregistré ce mois-ci</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeData.map((r, i) => {
                const pct = Math.round((r.total_clicks / maxClicks) * 100);
                const id  = r.shoplead_ip;
                const isSelected = detailTarget?.id === id && detailTarget?.type === activeType;
                return (
                  <div key={id}>
                    <button
                      onClick={() => isSelected ? setDetailTarget(null) : fetchDetail(activeType, id)}
                      className={`w-full text-left rounded-xl border transition-all p-3 ${
                        isSelected ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                      }`}>
                      <div className="flex items-center gap-3">
                        {/* rank */}
                        <span className="text-[11px] font-bold text-gray-400 w-5 flex-shrink-0">#{i + 1}</span>
 
                        {/* id + bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-gray-700">
                              {activeType === 'shop' ? 'Boutique' : activeType === 'product' ? 'Produit' : 'Annonce'} #{id}
                            </span>
                            <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                              {r.unique_ips} IP · {r.total_clicks} clics
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${activeStyle.color}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
 
                        {/* chevron */}
                        <ChevronRight size={14} className={`flex-shrink-0 transition-transform ${isSelected ? 'rotate-90 text-green-600' : 'text-gray-300'}`} />
                      </div>
                    </button>
 
                    {/* ── inline monthly detail ── */}
                    {isSelected && (
                      <div className="mt-1 mx-1 bg-white border border-green-100 rounded-xl p-4">
                        {detailLoading ? (
                          <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                            <RefreshCw size={12} className="animate-spin" /> Chargement du détail…
                          </div>
                        ) : detailTarget?.data ? (
                          <>
                            {/* this month highlight */}
                            <div className="flex gap-6 mb-4">
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Ce mois</p>
                                <p className="text-xl font-extrabold text-gray-900">
                                  {(detailTarget.data.this_month?.total_clicks ?? detailTarget.data.shop_clicks?.total_clicks ?? 0).toLocaleString()}
                                  <span className="text-xs font-normal text-gray-400 ml-1">clics</span>
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">IPs uniques</p>
                                <p className="text-xl font-extrabold text-gray-900">
                                  {(detailTarget.data.this_month?.unique_ips ?? detailTarget.data.shop_clicks?.unique_ips ?? 0).toLocaleString()}
                                </p>
                              </div>
                              {detailTarget.data.vs_last_month?.change_pct !== null && detailTarget.data.vs_last_month?.change_pct !== undefined && (
                                <div>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">vs mois dernier</p>
                                  <p className={`text-xl font-extrabold ${detailTarget.data.vs_last_month.change_pct >= 0 ? 'text-green-600' : 'text-rose-500'}`}>
                                    {detailTarget.data.vs_last_month.change_pct >= 0 ? '+' : ''}{detailTarget.data.vs_last_month.change_pct}%
                                  </p>
                                </div>
                              )}
                            </div>
 
                            {/* monthly breakdown table */}
                            {(detailTarget.data.monthly || detailTarget.data.monthly_totals || []).length > 0 && (
                              <>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Historique mensuel</p>
                                <div className="space-y-1.5">
                                  {(detailTarget.data.monthly || detailTarget.data.monthly_totals || []).map(m => {
                                    const mMax = Math.max(...(detailTarget.data.monthly || detailTarget.data.monthly_totals).map(x => x.total_clicks), 1);
                                    const mPct = Math.round((m.total_clicks / mMax) * 100);
                                    return (
                                      <div key={m.month} className="flex items-center gap-3">
                                        <span className="text-[10px] text-gray-500 font-medium w-16 flex-shrink-0">{m.month}</span>
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                          <div className={`h-full rounded-full ${activeStyle.color}`} style={{ width: `${mPct}%` }} />
                                        </div>
                                        <span className="text-[10px] text-gray-400 w-24 text-right flex-shrink-0">
                                          {m.total_clicks} clics · {m.unique_ips} IPs
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            )}
 
                            {/* shop: product + ad breakdown */}
                            {activeType === 'shop' && detailTarget.data.product_clicks?.length > 0 && (
                              <div className="mt-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Top produits ce mois</p>
                                <div className="space-y-1.5">
                                  {detailTarget.data.product_clicks.slice(0, 5).map(p => (
                                    <div key={p.product_id} className="flex items-center justify-between text-xs">
                                      <span className="text-gray-600 font-medium">Produit #{p.product_id}</span>
                                      <span className="text-gray-400">{p.total_clicks} clics · {p.unique_ips} IPs</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {activeType === 'shop' && detailTarget.data.ad_clicks?.length > 0 && (
                              <div className="mt-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Top annonces ce mois</p>
                                <div className="space-y-1.5">
                                  {detailTarget.data.ad_clicks.slice(0, 5).map(a => (
                                    <div key={a.ads_id} className="flex items-center justify-between text-xs">
                                      <span className="text-gray-600 font-medium">Annonce #{a.ads_id}</span>
                                      <span className="text-gray-400">{a.total_clicks} clics · {a.unique_ips} IPs</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-gray-400 py-2">Aucune donnée disponible.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };


  const TAB_META = {
    overview:      { title: 'Vue d\'ensemble',       sub: 'Activité globale de YamoMarket' },
    'verify-users':{ title: 'Vérifications utilisateurs', sub: `${pendingUsers.length} demande(s) en attente` },
    users:         { title: 'Utilisateurs',              sub: `${allUsers.length} comptes enregistrés` },
    shops:         { title: 'Boutiques',                  sub: `${allShops.length} boutiques sur la plateforme` },
    products:      { title: 'Produits',                   sub: 'Tous les produits publiés' },
    ads:           { title: 'Annonces publicitaires',     sub: 'Gérer les banners et promotions' },
    activity:      { title: 'Journal d\'activité',        sub: 'Toutes les actions administratives' },
    settings:      { title: 'Paramètres',                 sub: 'Configuration de la plateforme' },
    clicklogs:        { title: 'Statistiques Clics',         sub: 'Clics par boutique, produit et annonce — mois en cours' },
  };

  const renderTab = () => {
    if (activeTab === 'overview')       return <OverviewTab />;
    if (activeTab === 'verify-users')   return <VerifyUsersTab />;
    if (activeTab === 'users')          return <UsersTab />;
    if (activeTab === 'shops')          return <ShopsTab />;
    if (activeTab === 'products')       return <ProductsTab />;
    if (activeTab === 'ads')            return <AdsTab />;
    if (activeTab === 'activity')       return <ActivityTab />;
    if (activeTab === 'settings')       return <SettingsTab />;
    if (activeTab === 'clicklogs')       return <ClicksTab />;
    return (
      <div className="p-6 text-center py-20 text-gray-400">
        <Package size={36} className="mx-auto mb-3 opacity-30" />
        <p className="font-semibold">Section en construction</p>
      </div>
    );
  };

  const meta = TAB_META[activeTab] || { title: activeTab, sub: '' };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">

      {/* ── Desktop sidebar ── */}
      <div className="w-56 flex-shrink-0 hidden lg:block">
        <Sidebar />
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />
          <div className="fixed left-0 top-0 bottom-0 w-56 z-40 lg:hidden">
            <Sidebar mobile />
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={meta.title} sub={meta.sub} />
        <main className="flex-1 overflow-y-auto">
          {renderTab()}
        </main>
      </div>

      {/* ── Confirm modal ── */}
      {confirm && (
        <ConfirmModal
          config={confirm.config}
          onConfirm={confirm.onConfirm}
          onCancel={closeConfirm}
        />
      )}

      {userDetail && (
        <UserDetailModal
          user={userDetail}
          onClose={() => setUserDetail(null)}
          onApprove={(u) => askConfirm({
            title: 'Approuver cet utilisateur ?',
            desc: `Valider l'identité de "${u.username}" sur YamoMarket.`,
            icon: <BadgeCheck size={24} className="text-green-600" />,
            iconBg: 'bg-green-100', btnClass: 'bg-green-600 hover:bg-green-700', btnLabel: 'Approuver'
          }, () => { verifyUser(u, true, 'approved'); closeConfirm(); })}
          onReject={(u) => askConfirm({
            title: 'Refuser cette demande ?',
            desc: `Rejeter la demande de vérification de "${u.username}".`,
            icon: <XCircle size={24} className="text-red-500" />,
            iconBg: 'bg-red-100', btnClass: 'bg-red-500 hover:bg-red-600', btnLabel: 'Refuser'
          }, () => { verifyUser(u, true, 'rejected'); closeConfirm(); })}
        />
      )}

      {showAdForm && (
        <AdFormModal
          ad={editingAd}
          onSuccess={(toastConfig, data) => {
            const created = data?.data || data?.ad || data || {};
            if (editingAd) {
              setAds(ad => ad.map(a => a.ads_id === editingAd.ads_id ? { ...a, ...editingAd, ...created } : a));
            } else {
              setAds(ad => [{ status: true, ...created, id: created.id ?? Date.now() }, ...ad]);
            }
            setToast(toastConfig);
            setEditingAd(null);
          }}
          onClose={() => { setShowAdForm(false); setEditingAd(null); }}
        />
      )}

      {showEditAd && editAdTarget && (
        <EditAdModal
          ad={editAdTarget}
          onSuccess={(toastConfig, updatedAd) => {
            setAds(as => as.map(a => a.id === updatedAd.id ? { ...a, ...updatedAd } : a));
            setToast(toastConfig);
            setEditAdTarget(null);
          }}
          onClose={() => { setShowEditAd(false); setEditAdTarget(null); }}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default AdminDashboard;