import React, { useEffect, useState } from 'react';
import {
  User, Mail, Phone, MapPin, Camera, BadgeCheck,
  Shield, Store, ChevronRight, Bell, Lock,
  Package, Heart, Star, TrendingUp, Eye, Edit3,
  Upload, X, CheckCircle2, AlertCircle, ArrowRight,
  FileText, Clock, Zap, CreditCard, LogOut, Settings,
  Image as ImageIcon, Building2,
  PhoneCall,
  MapPinIcon,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Toast } from './Toastcomponent';

/* ─── mock user ───────────────────────────────────── */
const USER = {
  name: 'Jean-Paul Mbarga',
  email: 'jeanpaul@exemple.cm',
  phone: '+237 6 55 44 33 22',
  city: 'Yaoundé',
  region: 'Centre',
  joined: 'Mars 2024',
  avatar: null,
  verified: false,
  stats: { orders: 12, wishlist: 34, reviews: 8, viewed: 120 },
};

/* ─── Backdrop ────────────────────────────────────── */
const Backdrop = ({ onClick }) => (
  <div onClick={onClick} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
);

/* ─── Verify Modal ────────────────────────────────── */
const VerifyModal = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1=method, 2=upload docs, 3=success
  const [method, setMethod] = useState(null);
  const [img, setImg] = useState(null);
  const [imgb, setImgb] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateUser, setUpdateUser] = useState({});
  const [isloading, setIsLoading] = useState(false);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('market_token');
        const res = await fetch(`http://localhost:5050/api/market/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }});
        if (!res.ok) throw new Error('Failed to fetch profile');
        const result = await res.json();
        setUpdateUser(result);
      } catch (error) {
        console.error('Profile fetch failed:', error);
      }
    };
    fetchProfile();
  }, [])

  const CLOUD_NAME = 'dsdrkaask';
  const UPLOAD_PRESET = 'Upload_Market';

  const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
          try {
              setIsLoading(true);
              const imageUrl = await uploadImage(file);
              setImg(imageUrl);
              setUpdateUser({ ...updateUser, id_front: imageUrl });
              showToast("Front ID uploaded successfully!", 'success');
          } catch (err) {
              showToast(err.message, 'error');
          } finally {
              setIsLoading(false);
          }
      }
  };
  
  const uploadImage = async (file) => {
    const imageData = new FormData();
    imageData.append('file', file);
    imageData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: imageData,
            }
        );

        if (!response.ok) throw new Error("Image upload failed");
        const data = await response.json();
        return data.secure_url;
    } catch (err) {
        throw new Error('Failed to upload image: ' + err.message);
    }
  }
  
  const uploadImageback = async (file) => {
    const imageData = new FormData();
    imageData.append('file', file);
    imageData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: imageData,
            }
        );

        if (!response.ok) throw new Error("Image upload failed");
        const data = await response.json();
        return data.secure_url;
    } catch (err) {
        throw new Error('Failed to upload image: ' + err.message);
    }
  }

    const handleImagebackChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
          try {
              setIsLoading(true);
              const imagebackUrl = await uploadImageback(file);
              setImgb(imagebackUrl);
              setUpdateUser({ ...updateUser, id_back: imagebackUrl });
              showToast("Back ID uploaded successfully!", 'success');
          } catch (err) {
              showToast(err.message, 'error');
          } finally {
              setIsLoading(false);
          }
      }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('market_token');
      const res = await fetch(`http://localhost:5050/api/market/updateuser/${updateUser.user_id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updateUser, review: 'review' }),
      });
      if (!res.ok) throw new Error('Failed to submit verification');
      showToast('Verification submitted !!');
      setStep(3);
    } catch (err) {
      showToast('Could not submit verification.', 'error');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600" />
          {
            updateUser?.review === "review" ? ( 
              <div className=" p-8 pt-5 text-center py-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Demande envoyée avec succès</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Notre équipe examinera vos documents sous <strong className="text-gray-600">24 à 48 heures</strong>.
                  Vous recevrez une notification par email.
                </p>
                <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4 text-left space-y-2">
                  {['Documents reçus et sécurisés', 'Examen en cours par notre équipe', 'Notification par email à la fin'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-green-800">
                      <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" /> {t}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { onClose(); }}
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-green-200"
                >
                  Parfait, merci !
                </button>
              </div>
             ) : (
              <>
              {/* Step indicator */}
          {step < 3 && (
            <div className="px-8 pt-6">
              <div className="flex items-center gap-2">
                {[1, 2].map(s => (
                  <React.Fragment key={s}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {step > s ? <CheckCircle2 size={14} /> : s}
                    </div>
                    {s < 2 && <div className={`flex-1 h-1 rounded-full transition-all ${step > s ? 'bg-green-500' : 'bg-gray-100'}`} />}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-gray-400 font-medium">
                <span>Méthode</span>
                <span>Documents</span>
              </div>
            </div>
          )}

          <div className="p-8 pt-5">
            {/* header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                {step === 1 && <>
                  <h2 className="text-xl font-extrabold text-gray-900">Vérifier mon compte</h2>
                  <p className="text-sm text-gray-400 mt-1">Choisissez une méthode de vérification</p>
                </>}
                {step === 2 && <>
                  <h2 className="text-xl font-extrabold text-gray-900">Soumettre les documents</h2>
                  <p className="text-sm text-gray-400 mt-1">Téléchargez vos pièces justificatives</p>
                </>}
                {step === 3 && <h2 className="text-xl font-extrabold text-gray-900">Demande soumise !</h2>}
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* ── Step 1: method ── */}
            {step === 1 && (
              <div className="space-y-2">
                {[
                  { val: 'cni', icon: <FileText size={20} />, label: "Carte Nationale d'Identité", desc: 'CNI camerounaise valide (recto/verso)', time: '24–48h', color: 'green' },
                  { val: 'phone', icon: <Phone size={20} />, label: 'Numéro de téléphone', desc: 'Vérification par SMS (rapide)', time: '< 5 min', color: 'emerald' },
                ].map(m => (
                  <button
                    key={m.val}
                    onClick={() => setMethod(m.val)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${method === m.val ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-200 bg-gray-50'}`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${method === m.val ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
                      {m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{m.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${method === m.val ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      <Clock size={9} /> {m.time}
                    </span>
                  </button>
                ))}
                <button
                  disabled={!method}
                  onClick={() => setStep(2)}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                >
                  Continuer <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* ── Step 2: documents ── */}
            {step === 2 && (
              <div className="">
                {/* ID upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    {method === 'phone' ? 'Numéro de téléphone' : "Pièce d'identité (recto/verso)"}
                  </label>
                  {method === 'phone' ? (
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={updateUser.phone || ''}
                        onChange={e => setUpdateUser({...updateUser, phone: e.target.value})}
                        placeholder="+237 6XX XXX XXX"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${img ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300 bg-gray-50'}`}>
                      <input type="file" className="sr-only" accept="image/*,.pdf"
                        onChange={handleImageChange} />
                      {img ? (
                        <>
                          <CheckCircle2 size={28} className="text-green-600" />
                          <p className="text-sm font-semibold text-green-700">{img?.name}</p>
                          <p className="text-xs text-green-500">Fichier prêt à l'envoi</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                            <Upload size={20} className="text-green-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-700">Recto ID</p>
                            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG ou PDF — max 5 Mo</p>
                          </div>
                        </>
                      )}
                    </label>
                  )}
                </div>

                {/* Selfie upload */}
                {method !== 'phone' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Selfie avec la pièce d'identité
                    </label>
                    <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${imgb ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300 bg-gray-50'}`}>
                      <input type="file" className="sr-only" accept="image/*"
                        onChange={handleImagebackChange} />
                      {imgb ? (
                        <>
                          <CheckCircle2 size={28} className="text-green-600" />
                          <p className="text-sm font-semibold text-green-700">{imgb?.name}</p>
                          <p className="text-xs text-green-500">Fichier prêt à l'envoi</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                            <Camera size={20} className="text-green-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-700">Verso ID</p>
                            <p className="text-xs text-gray-400 mt-0.5">Tenez votre pièce d'identité visible</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                )}

                {/* info note */}
                <div className="flex items-start gap-3 mt-2 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Vos documents sont traités de manière sécurisée et ne sont jamais partagés avec des tiers.
                    La vérification prend généralement 24 à 48 heures.
                  </p>
                </div>

                <div className="flex mt-4 gap-3">
                  <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all">
                    Retour
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isloading || (method === 'cni' && (!img || !imgb)) || (method === 'phone' && !updateUser.phone)}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                  >
                    {isloading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi en cours…</>
                    ) : (
                      <><CheckCircle2 size={16} /> Soumettre la demande</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: success ── */}
            {step === 3 && (
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Demande envoyée avec succès</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Notre équipe examinera vos documents sous <strong className="text-gray-600">24 à 48 heures</strong>.
                  Vous recevrez une notification par email.
                </p>
                <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4 text-left space-y-2">
                  {['Documents reçus et sécurisés', 'Examen en cours par notre équipe', 'Notification par email à la fin'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-green-800">
                      <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" /> {t}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-green-200"
                >
                  Parfait, merci !
                </button>
              </div>
            )}
          </div>
          </>
             )
          } 
        </div>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
};

/* ─── Create Shop Modal ───────────────────────────── */
const CreateShopModal = ({ onClose, isVerified, verifyModal }) => {
  const [form, setForm] = useState({ shop_name: '', bio: '', category: '', profile: '', region: "", town: '', address: "", b_phone: '', b_email: '', license_num: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [done, setDone] = useState(false);

  const categories = ['Électronique', 'Mode', 'Beauté', 'Maison', 'Alimentation', 'Services', 'Sport', 'Auto'];
  const regions = ['Centre', 'Littoral', 'Ouest', 'Nord-Ouest', 'Sud-Ouest', 'Adamaoua', 'Nord', 'Extrême-Nord', 'Est', 'Sud'];

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const CLOUD_NAME = 'drzoiigek';
  const UPLOAD_PRESET = 'afcon_videos';

  const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
          try {
              setIsLoading(true);
              const imageUrl = await uploadImage(file);
              setImg(imageUrl);
              setForm({ ...form, profile: imageUrl });
              showToast("Uploaded successfully!", 'success');
          } catch (err) {
              showToast(err.message, 'error');
          } finally {
              setIsLoading(false);
          }
      }
  };
  
  const uploadImage = async (file) => {
    const imageData = new FormData();
    imageData.append('file', file);
    imageData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: imageData,
            }
        );

        if (!response.ok) throw new Error("Image upload failed");
        const data = await response.json();
        return data.secure_url;
    } catch (err) {
        throw new Error('Failed to upload image: ' + err.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {

      const token = localStorage.getItem('market_token');
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5050/api/market/registershop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
        showToast(data.message || 'Registration failed', 'error');
      }

      showToast('Registration Send...');

      // Redirect or update app state here
      setTimeout(() => {
        setDone(true);
      }, 3000);
      
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVerified) return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Compte non vérifié</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Vous devez vérifier votre compte avant de créer une boutique. Cela garantit la confiance entre acheteurs et vendeurs.
            </p>
            <div className="mt-5 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left space-y-2">
              {['Protège les acheteurs', 'Augmente votre crédibilité', 'Accès aux fonctionnalités vendeur'].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-amber-800">
                  <CheckCircle2 size={13} className="text-amber-500 flex-shrink-0" /> {t}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all">
                Annuler
              </button>
              <button onClick={verifyModal} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-green-200">
                Vérifier mon compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none overflow-y-scroll">
        <div className="pointer-events-auto w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-2">
          <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600" />
          <div className="px-8 py-2">
            {!done ? (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center mb-3">
                      <Store size={22} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Créer ma boutique</h2>
                    <p className="text-sm text-gray-400 -mt-1">Commencez à vendre sur YamoMarket</p>
                  </div>
                  <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-1">
                  {/* shop logo placeholder */}
                  <div className="flex items-center gap-4">
                  {
                    img ? (
                      <div>
                         <label className="w-16 h-16 px-8 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-dashed border-green-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors flex-shrink-0">
                      <CheckCircle2 size={18} className="text-green-500" />
                      <span className="text-xs text-green-500 font-medium mt-0.5">
                        profile
                      </span>
                    </label>
                      </div>
                    ) : (
                      <label className="w-16 h-16 px-8 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-dashed border-green-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors flex-shrink-0">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <Camera size={18} className="text-green-500" />
                      <span className="text-[9px] text-green-500 font-medium mt-0.5">
                        Logo
                      </span>
                    </label>
                    )
                  }
                    
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Nom de la boutique *</label>
                      <input
                        value={form.shop_name}
                        onChange={e => setForm(({ ...form, shop_name: e.target.value }))}
                        placeholder="Ex: TechShop Douala"
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mt-2">License Number</label>
                    <input
                      value={form.license_num}
                      onChange={e => setForm(({ ...form, license_num: e.target.value }))}
                      placeholder="License Number"
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mt-1">Catégorie</label>
                      <select
                        value={form.category}
                        onChange={e => setForm(({ ...form, category: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Choisir…</option>
                        {categories.map(c => <option key={c} value={c}>
                          {c}
                        </option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mt-1">Region</label>
                      <select
                        value={form.region}
                        onChange={e => setForm(({ ...form, region: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Choisir…</option>
                        {regions.map(r => <option key={r} value={r}>
                          {r}
                        </option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Town</label>
                      <input
                        value={form.town}
                        onChange={e => setForm(({...form, town: e.target.value }))}
                        placeholder="Ex: Douala"
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Téléphone *</label>
                      <input
                        value={form.b_phone}
                        onChange={e => setForm(({...form, b_phone: e.target.value }))}
                        placeholder="+237 6XX XXX"
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mt-1">Email professionnel</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={form.b_email}
                        onChange={e => setForm(({...form, b_email: e.target.value }))}
                        type="email"
                        placeholder="boutique@exemple.cm"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mt-1">Address</label>
                    <div className="relative">
                      <MapPinIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={form.address}
                        onChange={e => setForm(({...form, address: e.target.value }))}
                        type="email"
                        placeholder="123 Rue de la Liberté, Douala"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mt-1">Description</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(({...form, bio: e.target.value }))}
                      rows={3}
                      placeholder="Décrivez votre boutique, vos produits et services…"
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
                    <Zap size={15} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800 leading-relaxed">
                      Votre boutique sera visible après validation par notre équipe (sous 24h). Vous pourrez ajouter vos produits immédiatement.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all">
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isloading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                    >
                      {isloading ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Création…</>
                      ) : (
                        <><Store size={16} /> Créer ma boutique</>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <Store size={36} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Boutique créée ! 🎉</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Votre boutique <strong className="text-gray-700">"{form.shop_name}"</strong> a été soumise. Elle sera activée dans les 24h après validation.
                </p>
                <div className="mt-5 bg-green-50 border border-green-100 rounded-2xl p-4 text-left space-y-2">
                  {['Boutique créée avec succès', 'En attente de validation (24h)', 'Vous pouvez déjà préparer vos produits'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-green-800">
                      <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" /> {t}
                    </div>
                  ))}
                </div>
                <button onClick={onClose} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-green-200">
                  Gérer ma boutique
                </button>
              </div>
            )}
          </div>
        </div>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
};

/* ─── Stat card ───────────────────────────────────── */
const StatCard = ({ icon, value, label, color }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center hover:border-green-200 hover:shadow-md transition-all">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-2`}>{icon}</div>
    <p className="text-2xl font-extrabold text-gray-900">{value}</p>
    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
  </div>
);

/* ─── Main page ───────────────────────────────────── */
const UserProfile = () => {
  const [user, setUser] = useState(USER);
  const [user2, setUser2] = useState({});
  const [shop, setShop] = useState({});
  const [modal, setModal] = useState(null); // 'verify' | 'shop' | null
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  
  const [currentpassword, setCurrentPassword] = useState("")
  const [password, setPassword] = useState("")
  const [comparepassword, setComparePassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { currentUser, logout } = useAuth();
  
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
  };

  const handleLogout = () => { 
    logout(); 
    navigate('/');
   };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('market_token');
        const res = await fetch(`http://localhost:5050/api/market/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }});
        if (!res.ok) throw new Error('Failed to fetch profile');
        const result = await res.json();
        setUser2(result);
      } catch (error) {
        console.error('Profile fetch failed:', error);
        setUser2(null)
      }
    };
    fetchProfile();
  }, [])

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const token = localStorage.getItem('market_token');
        const res = await fetch(`http://localhost:5050/api/market/myshop`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }});
        if (!res.ok) throw new Error('Failed to fetch shop');
        const result = await res.json();
        setShop(result);
      } catch (error) {
        console.error('Shop fetch failed:', error);
        setShop(null);
      }
    };
    fetchShop();
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('market_token');
      const res = await fetch(`http://localhost:5050/api/market/updateuser/${user2.user_id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(user2),
      });
      if (!res.ok) throw new Error('Failed to submit update');
      showToast('Update complete !!!');
      setEditMode(false);
    } catch (err) {
      showToast('Could not submit update.', 'error');
    } finally {
      console.log('Update submission complete');
    }
  };

 const handleUpdatePassword = async (e) => {
  e.preventDefault();

  if (!currentpassword || !password || !comparepassword) {
    return showToast("All fields are required", "error");
  }

  if (password !== comparepassword) {
    return showToast("Mot de passe pas compatible", "error");
  }

  try {
    const token = localStorage.getItem('market_token');

    const res = await fetch(
      `http://localhost:5050/api/market/updatepassword`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: currentpassword,
          newPassword: password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to update password');
    }

    showToast('Password updated successfully!');

    setCurrentPassword('');
    setPassword('');
    setComparePassword('');

    setEditMode(false);

  } catch (err) {
    showToast(err.message, 'error');
  }
};

  const TABS = [
    { key: 'profile', label: 'Profil', icon: <User size={15} /> },
    { key: 'security', label: 'Sécurité', icon: <Lock size={15} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Profile hero ── */}
      <section className="bg-gradient-to-br pt-16 from-green-800 via-green-700 to-emerald-600 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-white/20 flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-black text-white">{user2?.username?.charAt(0)}</span>
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md hover:bg-green-50 transition-colors" aria-label="Changer la photo">
                <Camera size={14} className="text-green-700" />
              </button>
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{user2?.username}</h1>
                {user2?.status
                  ? <span className="flex items-center gap-1 bg-green-500/30 border border-green-400/40 text-green-200 text-xs font-semibold px-3 py-1 rounded-full"><BadgeCheck size={12} /> Vérifié</span>
                  : <span className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold px-3 py-1 rounded-full"><AlertCircle size={12} /> Non vérifié</span>
                }
              </div>
              <p className="text-green-200 text-sm flex items-center gap-1.5"><Mail size={12} /> {user2?.email}</p>
              <p className="text-green-300 text-sm mt-1 flex items-center gap-1"><PhoneCall size={12} />  {user2?.phone}</p>
            </div>

            {/* actions */}
            <div className="flex flex-col gap-2.5 flex-shrink-0">
              {user2?.review === "null" && (
                <button
                  onClick={() => setModal('verify')}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  <Shield size={15} /> Vérifier mon compte
                </button>
              )}
              {
                shop?.shop_id ? (
                  <Link to={`/my-shop/${shop?.shop_id}`}>
                    <button
                      className="flex items-center gap-2 bg-white hover:bg-green-50 text-green-800 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all"
                    >
                      <Store size={15} /> Ma Boutique
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => setModal('shop')}
                    className="flex items-center gap-2 bg-white hover:bg-green-50 text-green-800 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    <Store size={15} /> Créer une boutique
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Package size={18} className="text-green-700" />} label="Produits" color="bg-green-100" />
          <StatCard icon={<Heart size={18} className="text-rose-500" />} label="Boutique" color="bg-rose-100" />
          <StatCard icon={<Star size={18} className="text-amber-500" />} label="Clients" color="bg-amber-100" />
        </div>
      </div>

      {/* ── CTA banners ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Verify banner */}
        {user2?.review !== "approved" && user2?.review !== "review" && (
          <button
            onClick={() => setModal('verify')}
            className="group w-full flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 rounded-2xl p-5 text-left transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Shield size={22} className="text-amber-600" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">Vérifiez votre compte</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Gagnez la confiance des vendeurs et débloquez toutes les fonctionnalités.
              </p>
            </div>

            <ChevronRight
              size={18}
              className="text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0"
            />
          </button>
        )}

        {/* Create shop banner */}
        {
            !shop?.shop_id && (
          <button
            disabled={user2?.review !== "approved"}
            onClick={() => setModal('shop')}
            className="group w-full flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-500 rounded-2xl p-5 text-left transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Building2 size={22} className="text-green-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">Ouvrir une boutique</p>
              <p className="text-xs text-gray-500 mt-0.5">Vendez vos produits et services à des milliers d'acheteurs.</p>
            </div>
            <ChevronRight size={18} className="text-green-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>
            )
        }
      </div>

      {/* ── Tabs + content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16">
        <div className="flex gap-0 border-b border-gray-200 mb-8">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === t.key ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Profile tab ── */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* form */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Informations personnelles</h3>
                <button
                  onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${editMode ? 'bg-green-600 text-white shadow-md' : 'border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'}`}
                >
                  {editMode ? <><CheckCircle2 size={14} /> Sauvegarder</> : <><Edit3 size={14} /> Modifier</>}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><User /></span>
                      <input
                        value={user2?.username}
                        onChange={e => setUser2({...user2, username: e.target.value})}
                        disabled={!editMode}
                        placeholder="Jean Roe"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all ${editMode ? 'bg-white border-gray-200 focus:border-green-500 text-gray-800' : 'bg-gray-50 border-transparent text-gray-700 cursor-default'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Mail /></span>
                      <input
                        value={user2?.email}
                        onChange={e => setUser2({...user2, email: e.target.value})}
                        disabled={!editMode}
                        placeholder="votre@email.com"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all ${editMode ? 'bg-white border-gray-200 focus:border-green-500 text-gray-800' : 'bg-gray-50 border-transparent text-gray-700 cursor-default'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Téléphone</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Phone /></span>
                      <input
                        value={user2?.phone}
                        onChange={e => setUser2({...user2, phone: e.target.value})}
                        disabled={!editMode}
                        placeholder="+237 6XX XXX"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all ${editMode ? 'bg-white border-gray-200 focus:border-green-500 text-gray-800' : 'bg-gray-50 border-transparent text-gray-700 cursor-default'}`}
                      />
                    </div>
                  </div>
              </div>

              {editMode && (
                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                  <button onClick={() => setEditMode(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all">
                    Annuler
                  </button>
                  <button onClick={handleUpdate} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-lg shadow-green-200">
                    Sauvegarder les modifications
                  </button>
                </div>
              )}
            </div>

            {/* sidebar */}
            <div className="space-y-2">
              {/* verification status */}
              <div className={`border-2 rounded-2xl p-5 ${user2?.status ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  {( user2?.status && user2?.review === "approved")
                    ? <BadgeCheck size={20} className="text-green-600" />
                    : <AlertCircle size={20} className="text-amber-500" />
                  }
                  <p className="font-bold text-gray-900 text-sm">
                    {user2?.status ? 'Compte vérifié ✓' : 'Compte non vérifié'}
                  </p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {(!user2?.status && user2?.review === "approved")
                    ? 'Votre identité a été vérifiée. Vous avez accès à toutes les fonctionnalités.'
                    : 'Vérifiez votre compte pour accéder à toutes les fonctionnalités et inspirer confiance.'
                  }
                </p>
                {!user2?.status && (
                  <button onClick={() => setModal('verify')} className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5">
                    <Shield size={13} /> Vérifier maintenant
                  </button>
                )}
              </div>

              {/* quick links */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h4 className="font-bold text-gray-900 text-sm mb-3">Accès rapide</h4>
                <div className="space-y-1">
                  {[
                    { icon: <Store size={15} />, label: shop?.shop_id ? 'Gérer ma boutique' : 'Créer une boutique', action: shop?.shop_id ? () => navigate(`/my-shop/${shop?.shop_id}`) : () => setModal('shop'), color: 'text-green-600' },
                    { icon: <Package size={15} />, label: 'Mes Produits', action: () => {}, color: 'text-blue-500' },
                    { icon: <LogOut size={15} />, label: 'Se déconnecter', action: handleLogout, color: 'text-red-500' },
                  ].map(item => (
                    <button key={item.label} onClick={item.action} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                      <span className={item.color}>{item.icon}</span>
                      <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 flex-1">{item.label}</span>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Security tab ── */}
        {activeTab === 'security' && (
          <div className="max-w-xl space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-5">Changer le mot de passe</h3>
              <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mot de Passe Actuel</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                     type={showCurrent ? "text" : "password"}
                      name="currentpassword"
                      value={currentpassword}
                      placeholder="••••••••"
                      onChange={(e) =>setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all" />
                  <button onClick={() => setShowCurrent(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nouveau Mot de Passe</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showNew ? "text" : "password"}
                        name="password"
                        value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all" />
                      <button onClick={() => setShowNew(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Confirmer Mot de Passe</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showConfirm ? "text" : "password"}
                        name="comparepassword"
                        value={comparepassword}
                        placeholder="••••••••"
                        onChange={(e) => setComparePassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all" />
                      <button onClick={() => setShowConfirm(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                      {comparepassword && (
                        <p
                          className={`text-xs mt-1 ${
                            comparepassword === password
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {comparepassword === password
                            ? "Passwords match"
                            : "Passwords do not match"}
                        </p>
                      )}
                    </div>
                <button onClick={handleUpdatePassword} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-green-200 mt-2">
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-1">Authentification à deux facteurs</h3>
              <p className="text-sm text-gray-400 mb-4">Ajoutez une couche de sécurité supplémentaire.</p>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">SMS 2FA</p>
                    <p className="text-xs text-gray-400">{user.phone}</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
                  Activer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Notifications tab ── */}
        {activeTab === 'notifications' && (
          <div className="max-w-xl space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-5">Préférences de notifications</h3>
              <div className="space-y-1">
                {[
                  { label: 'Mises à jour de commandes', desc: 'Statut de vos commandes', checked: true },
                  { label: 'Nouveaux produits', desc: 'Dans vos catégories favorites', checked: false },
                  { label: 'Newsletter YamoMarket', desc: 'Actualités et tendances', checked: false },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                    </div>
                    <label className="relative cursor-pointer">
                      <input type="checkbox" defaultChecked={n.checked} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 peer-checked:bg-green-500 rounded-full transition-all relative">
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-5" />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
            <Toast toast={toast} onClose={() => setToast(false)} />
      </div>

      {/* ── Modals ── */}
      {modal === 'verify' && <VerifyModal onClose={() => setModal(null)} />}
      {modal === 'shop'   && <CreateShopModal onClose={() => setModal(null)} isVerified={user2.status} verifyModal={() => setModal('verify')} />}
    </div>
  );
};

export default UserProfile;