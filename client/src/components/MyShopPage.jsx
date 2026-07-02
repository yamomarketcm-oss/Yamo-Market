import React, { useEffect, useState } from 'react';
import {
  Plus, Package, TrendingUp, Eye, Edit3,
  Trash2, X, Check, Camera, ShoppingBag, MapPin,
  ToggleLeft, ToggleRight, Search, ArrowUpRight,
  AlertCircle, CheckCircle2, ImagePlus, Loader2
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Toast } from './Toastcomponent';
import ShopClickStats from './ShopClickStats';

/* â”€â”€â”€ Cloudinary config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const CLOUD_NAME = 'dsdrkaask';
  const UPLOAD_PRESET = 'Upload_Market';

const uploadToCloudinary = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url;
};

/* â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const CATEGORIES = ['Ã‰lectronique', 'Mode', 'BeautÃ©', 'Maison', 'Alimentation', 'Services', 'Autre'];

const BADGES     = ['New', 'Sale', 'Hot', 'Local', 'Promo'];

const badgeColor = (b) => ({
  New:'bg-emerald-500', Sale:'bg-amber-400', Hot:'bg-rose-500',
  Local:'bg-green-700', Promo:'bg-violet-500',
}[b] || 'bg-gray-400');

/* â”€â”€â”€ Image Upload Field â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
/*
 * Handles Cloudinary upload internally.
 * Props:
 *   label       â€“ field label string
 *   value       â€“ current cloudinary URL (or null)
 *   onChange    â€“ (url: string) => void   called after successful upload
 *   onError     â€“ (msg: string) => void   called on upload failure
 */
const CloudinaryImageField = ({ label, value, onChange, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      onError?.('Veuillez sÃ©lectionner un fichier image valide.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err) {
      onError?.(err.message || 'Ã‰chec du tÃ©lÃ©chargement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && (
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
          {label}
        </label>
      )}
      <label
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        className={`relative flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 border-dashed overflow-hidden transition-all ${
          dragOver ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 bg-gray-50'
        } ${value ? 'h-36' : 'h-28'}`}
      >
        <input
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={e => handleFile(e.target.files[0])}
          disabled={uploading}
        />

        {/* uploading spinner overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2 z-10 rounded-2xl">
            <Loader2 size={24} className="text-green-600 animate-spin" />
            <p className="text-xs text-green-700 font-semibold">Upload en coursâ€¦</p>
          </div>
        )}

        {/* preview */}
        {value && !uploading ? (
          <>
            <img src={value} alt="preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
              <p className="text-white text-xs font-semibold flex items-center gap-1.5">
                <Camera size={13} /> Changer l'image
              </p>
            </div>
          </>
        ) : !uploading ? (
          <>
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-2">
              <ImagePlus size={18} className="text-green-600" />
            </div>
            <p className="text-xs text-gray-400">
              Glissez ou <span className="text-green-600 font-medium">parcourez</span>
            </p>
            <p className="text-[10px] text-gray-300 mt-0.5">JPG, PNG, WEBP â€” max 10 Mo</p>
          </>
        ) : null}
      </label>

      {/* Cloudinary URL preview badge */}
      {value && (
        <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1 truncate">
          <CheckCircle2 size={9} /> Image upload reussi!
        </p>
      )}
    </div>
  );
};

/* â”€â”€â”€ Shared Form Fields â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FormFields = ({ form, setForm, onImageError }) => {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      {/* Two Cloudinary image fields side by side */}
      <div className="grid grid-cols-2 gap-3">
        <CloudinaryImageField
          label="Image principale"
          value={form.m_img}
          onChange={url => set('m_img', url)}
          onError={onImageError}
        />
        <CloudinaryImageField
          label="Image secondaire"
          value={form.img}
          onChange={url => set('img', url)}
          onError={onImageError}
        />
      </div>

      {/* Name */}
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Nom du produit *</label>
        <input
          value={form.product_name}
          onChange={e => set('product_name', e.target.value)}
          placeholder="Ex: Smartphone Pro Max"
          className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
        />
      </div>

      {/* Category + Badge */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">CatÃ©gorie *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-white appearance-none cursor-pointer">
            <option value="">Choisirâ€¦</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Badge</label>
          <select value={form.tag} onChange={e => set('tag', e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-white appearance-none cursor-pointer">
            <option value="">Aucun</option>
            {BADGES.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Prix (XAF) *</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
            placeholder="25000"
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Description</label>
        <textarea value={form.desc} onChange={e => set('desc', e.target.value)}
          placeholder="DÃ©crivez votre produitâ€¦" rows={3}
          className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all resize-none" />
      </div>

      {/* Publish toggle */}
      <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-700">Publier immÃ©diatement</p>
          <p className="text-xs text-gray-400">Visible sur le marketplace dÃ¨s la crÃ©ation</p>
        </div>
        <button type="button"
          onClick={() => set('status', form.status === 'active' ? 'inactive' : 'active')}
          className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${form.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}>
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${form.status === 'active' ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>
    </div>
  );
};

/* â”€â”€â”€ Add Product Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const AddProductModal = ({ shopId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    product_name: '', desc: '', price: '', stock: '',
    category: '', tag: '', status: 'active',
    m_img: '',
    img:   ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const isValid = form.product_name && form.category && form.price;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {

      const token = localStorage.getItem('market_token');

      // imageUrl already uploaded to Cloudinary â€” send as plain JSON
      const res = await fetch('https://yamo-market-server.vercel.app/api/market/createproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_name: form.product_name,
          desc:         form.desc,
          price:        form.price,
          category:     form.category,
          tag:          form.tag,
          status:       form.status,
          shop:         shopId,
          m_img:        form.m_img,   // main image Cloudinary URL
          img:          form.img,     // secondary image Cloudinary URL
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ã‰chec de la crÃ©ation');
      onSuccess(
        { type: 'success', msg: 'Produit crÃ©Ã© avec succÃ¨s !' },
        data.product || { id: Date.now(), product_name: form.product_name, ...form, image: form.m_img || form.img, views: 0, sales: 0 }
      );
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Nouveau produit</h2>
            <p className="text-green-200 text-xs mt-0.5">L'image est hÃ©bergÃ©e sur Cloudinary</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 max-h-[68vh] overflow-y-auto">
          <FormFields form={form} setForm={setForm} onImageError={msg => setError(msg)} />
          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle size={15} /> {error}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3 border-t border-gray-100 pt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 font-medium hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={!isValid || loading}
            className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> CrÃ©ationâ€¦</>
              : <><Check size={15} /> CrÃ©er le produit</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* â”€â”€â”€ Edit Product Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const EditProductModal = ({ product, shopId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    product_name: product.product_name        || '',
    desc:         product.desc || '',
    price:        product.price       || '',
    category:     product.category    || '',
    tag:          product.tag       || '',
    status:       product.status      || '',
    m_img:        product.m_img       || '',  // existing main image
    img:          product.img         || '',                   // existing secondary image
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const isValid = form.product_name && form.price;

  const handleUpdate = async () => {
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('market_token');

      const res = await fetch(`https://yamo-market-server.vercel.app/api/market/updateproduct/${product.product_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_name: form.product_name,
          desc:         form.desc,
          price:        form.price,
          category:     form.category,
          tag:          form.tag,
          status:       form.status,
          shop:         shopId,
          m_img:        form.m_img,   // main image Cloudinary URL
          img:          form.img,     // secondary image Cloudinary URL
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ã‰chec de la mise Ã  jour');
       onSuccess(
        { type: 'success', msg: 'Produit mis Ã  jour avec succÃ¨s !' },
        { ...product, product_name: form.product_name, desc: form.desc, price: form.price, tag: form.tag, category: form.category, status: form.status, m_img: form.m_img, img: form.img}
      );
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Modifier le produit</h2>
            <p className="text-blue-200 text-xs mt-0.5 truncate max-w-[260px]">{product.product_name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 max-h-[68vh] overflow-y-auto">
          <FormFields form={form} setForm={setForm} onImageError={msg => setError(msg)} />
          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle size={15} /> {error}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3 border-t border-gray-100 pt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 font-medium hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button onClick={handleUpdate} disabled={!isValid || loading}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mise Ã  jourâ€¦</>
              : <> Enregistrer les modifications</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* â”€â”€â”€ Delete Confirm Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const DeleteModal = ({ product, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={24} className="text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Supprimer ce produit ?</h3>
      <p className="text-sm text-gray-400 mt-2 leading-relaxed">
        Vous Ãªtes sur le point de supprimer <strong className="text-gray-700">"{product?.product_name}"</strong>. Cette action est irrÃ©versible.
      </p>
      <div className="flex gap-3 mt-6">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
          Annuler
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60">
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Suppressionâ€¦</>
            : <><Trash2 size={14} /> Supprimer</>}
        </button>
      </div>
    </div>
  </div>
);

/* â”€â”€â”€ Stat Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:shadow-green-100/50 transition-all">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-extrabold text-gray-900 leading-tight">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
      {sub && <p className="text-xs text-green-600 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* â”€â”€â”€ Product Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ProductRow = ({ p, onEdit, onDelete, onToggle }) => (
  <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-3 hover:border-green-200 hover:shadow-md hover:shadow-green-100/40 transition-all">
    <img src={p.m_img || 'https://via.placeholder.com/56'} alt={p.product_name}
      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
    <img src={p.img || 'https://via.placeholder.com/56'} alt={p.product_name}
      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 sm:inline hidden bg-gray-100" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-gray-800 text-sm truncate">{p.product_name}</p>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {p.status === 'active' ? 'Actif' : 'Inactif'}
        </span>
        {p.badge && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-700">{p.badge}</span>}
      </div>
      <div className='flex mt-0.5 gap-1'>
          <span className="bg-green-200 text-xs font-semibold px-4 py-0.5 rounded-full">{p.category}</span>
          <span className={`${badgeColor(p.tag)} text-xs font-semibold px-2 py-0.5 rounded-full`}>{p.tag}</span>
      </div>
        <div className="">
          <span className="text-green-700 font-bold text-md ml-2">{p.price} XAF</span>
        </div>
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      <button onClick={() => onToggle(p.product_id)} title={p.status === 'active' ? 'DÃ©sactiver' : 'Activer'}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${p.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}>
        {p.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
      </button>
      <button onClick={() => onEdit(p)} title="Modifier"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
        <Edit3 size={14} />
      </button>
      <button onClick={() => onDelete(p)} title="Supprimer"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-colors">
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

/* â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const MyShopPage = () => {
  const { shop_id } = useParams();

  const [products, setProducts]       = useState([]);
  const [shopDetail, setShopDetail]   = useState({});
  const [search, setSearch]           = useState('');
  const [toast, setToast]             = useState(null);
  const [showAdd, setShowAdd]         = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  /* fetch shop */
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const token = localStorage.getItem('market_token');
        const res = await fetch(`https://yamo-market-server.vercel.app/api/market/getshop/${shop_id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch shop');
        const result = await res.json()
        setShopDetail(result);
      } catch (err) {
        console.error('Shop fetch failed:', err);
      }
    };
    fetchShop();
  }, [shop_id]);

  useEffect(() => {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('market_token');
          const res = await fetch(`https://yamo-market-server.vercel.app/api/market/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }});
          if (!res.ok) throw new Error('Failed to fetch profile');
          const result = await res.json();
          setUser(result);
        } catch (error) {
          console.error('Profile fetch failed:', error);
          setUser(null)
        }
      };
      fetchProfile();
    }, [])

  useEffect(() => {
    const fetchShopProduct = async () => {
      try {
        const token = localStorage.getItem('market_token');
        const res = await fetch(`https://yamo-market-server.vercel.app/api/market/shop-product/${shop_id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch shop');
        const result = await res.json()
        setProducts(result.data);
      } catch (err) {
        console.error('Shop fetch failed:', err);
      }
    };
    fetchShopProduct();
  }, [shop_id]);

  if (user?.user_id !== shopDetail?.user) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center">
        
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 9l-6 6m0-6l6 6"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          AccÃ¨s RefusÃ©
        </h1>

        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Vous n'avez pas l'autorisation nÃ©cessaire pour accÃ©der Ã  cette
          boutique ou effectuer cette action.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm">
          Unauthorized Access
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-green-200"
        >
          Retour Ã  l'accueil
        </button>
      </div>
    </div>
  );
}

  const handleAddSuccess = (toastPayload, newProduct) => {
    setProducts(ps => [{ ...newProduct}, ...ps]);
    setToast(toastPayload);
  };
 
  const handleEditSuccess = (toastPayload, updated) => {
    setProducts(ps => ps.map(p => p.product_id === updated.product_id ? updated : p));
    setToast(toastPayload);
  };

  const handleToggle = async (product_id) => {
    const product   = products.find(p => p.product_id === product_id);
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    setProducts(ps => ps.map(p => p.product_id === product_id ? { ...p, status: newStatus } : p));
    try {
      const token = localStorage.getItem('market_token');
      await fetch(`https://yamo-market-server.vercel.app/api/market/updateproduct/${product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...product, status: newStatus }),
      });
    } catch {
      setProducts(ps => ps.map(p => p.product_id === product_id ? { ...p, status: product.status } : p));
      setToast({ type: 'error', msg: 'Ã‰chec de la mise Ã  jour du statut' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('market_token');
      const res = await fetch(`https://yamo-market-server.vercel.app/api/market/deleteproduct/${deleteTarget.shop}/${deleteTarget.product_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setProducts(ps => ps.filter(p => p.product_id !== deleteTarget.product_id));
      setToast({ type: 'success', msg: 'Produit supprimÃ© avec succÃ¨s' });
      setDeleteTarget(null);
    } catch (err) {
      setToast({ type: 'error', msg: err.message || 'Erreur lors de la suppression' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">

      {/* Shop banner */}
      <div className="max-w-6xl sm:mx-auto mx-2 relative bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl overflow-hidden p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <img src={shopDetail?.profile} className='w-24 h-20 object-cover rounded-md' />
          <div>
            <h1 className="text-white font-extrabold text-xl">{shopDetail?.shop_name || 'Ma boutique'}</h1>
            <p className="text-green-200 text-xs">{shopDetail?.b_email}</p>
            <p className="text-green-200 text-sm mt-0.5 flex items-center gap-1">
              <MapPin size={11} />{shopDetail?.region} â€¢ {shopDetail?.town} â€¢ {shopDetail?.address}
            </p>
            <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-medium mt-1 inline-block">â˜… Boutique vÃ©rifiÃ©e</span>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
          <Link to={`/boutique/${shopDetail?.shop_slug}`} target="_blank" rel="noopener noreferrer">
            <button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
              <Eye size={13} /> AperÃ§u public
            </button>
          </Link>
          <button onClick={() => setShowAdd(true)}
            className="bg-white text-green-800 text-xs font-bold px-4 py-2 rounded-xl hover:bg-green-50 transition-colors flex items-center gap-1.5 shadow-lg">
            <Plus size={13} /> Ajouter un produit
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<Package   size={18} className="text-green-700"  />} label="Produits"      value={products.length}               color="bg-green-100"  />
          <StatCard icon={<Eye       size={18} className="text-blue-600"   />} label="Vues totales"  value=""                                 color="bg-blue-100"   />
          <StatCard icon={<ShoppingBag size={18} className="text-amber-600"/>} label="Ventes"        value=""                                                  color="bg-amber-100"  />
          <StatCard icon={<TrendingUp size={18} className="text-emerald-600"/>} label="Revenus"      value=""              sub="% ce mois"    color="bg-emerald-100"/>
        </div>

        <ShopClickStats shopId={shop_id} />

        {/* Product list */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Mes produits</h2>
              <p className="text-xs text-gray-400">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                <Search size={13} className="text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercherâ€¦"
                  className="text-sm outline-none w-36 text-gray-700 placeholder-gray-400" />
              </div>
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-green-200">
                <Plus size={15} /> Nouveau
              </button>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="space-y-2">
              {products.map(p => (
                <ProductRow p={p}
                  onEdit={product => setEditProduct(product)}
                  onDelete={product => setDeleteTarget(product)}
                  onToggle={handleToggle} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <Package size={24} className="text-green-500" />
              </div>
              <p className="font-semibold text-gray-700">Aucun produit trouvÃ©</p>
              <p className="text-sm text-gray-400 max-w-xs">Ajoutez votre premier produit pour commencer Ã  vendre.</p>
              <button onClick={() => setShowAdd(true)}
                className="mt-2 bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2">
                <Plus size={14} /> CrÃ©er un produit
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs">ðŸ’¡</span>
            Conseils pour booster vos ventes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { tip: "Ajoutez des photos de qualitÃ© pour attirer plus d'acheteurs.", action: 'Modifier les images' },
              { tip: 'ComplÃ©tez la description de chaque produit pour le rÃ©fÃ©rencement.', action: 'Voir mes produits' },
              { tip: 'Activez le badge "Promo" pour mettre en avant vos rÃ©ductions.', action: 'Ajouter un badge' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-500 leading-relaxed">{t.tip}</p>
                <button className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1 hover:gap-2 transition-all">
                  {t.action} <ArrowUpRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Modals */}
      {showAdd && (
        <AddProductModal shopId={shop_id} onClose={() => setShowAdd(false)} onSuccess={handleAddSuccess} />
      )}
      {editProduct && (
        <EditProductModal product={editProduct} shopId={shop_id} onClose={() => setEditProduct(null)} onSuccess={handleEditSuccess} />
      )}
      {deleteTarget && (
        <DeleteModal product={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default MyShopPage;
