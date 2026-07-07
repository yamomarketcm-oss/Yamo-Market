import { Menu, X, ShoppingBag, Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone, AlertCircle, CheckCircle2, ChevronDown, LogOut, Settings, Store, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Toast } from "./Toastcomponent";
import logo from '../img/logo_yamo_market_circle.png';

const links = [
  { label: "Boutiques", link: "/boutiques" },
  { label: "Produits", link: "/products" },
  { label: "Trend", link: "/banner" },
  { label: "About", link: "/about" },
  { label: "Terms", link: "/terms" },
];

/* ─── Backdrop ───────────────────────────────────── */
const Backdrop = ({ onClick }) => (
  <div onClick={onClick} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
);

/* ─── Login Modal ────────────────────────────────── */
const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const { setCurrentUser } = useAuth();

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://yamo-market-server.vercel.app/api/market/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('market_token', data.token);
      setCurrentUser(data.user);
      showToast('Connexion réussie !', 'success');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600" />
          <div className="p-8">
            <div className="flex items-start justify-between mb-7">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center">
                    <img src={logo} className="w-6 h-6" alt="YamoMarket Logo" />
                  </div>
                  <span className="font-bold text-gray-900">Yamo<span className="text-green-600">Market</span></span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-3">Bon retour 👋</h2>
                <p className="text-sm text-gray-400 mt-1">Connectez-vous à votre compte</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="vous@exemple.cm"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Mot de passe</label>
                  <button className="text-xs text-green-600 hover:underline font-medium">Mot de passe oublié ?</button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" />
                  <button onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button disabled={loading} onClick={handleLogin}
                className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-70 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 mt-2">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Connexion…</>
                  : <><span>Se connecter</span> <ArrowRight size={16} /></>}
              </button>

              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">ou continuer avec</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium text-gray-600 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium text-gray-600 transition-all">
                  <Phone size={15} className="text-green-600" /> Téléphone
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Pas encore de compte ?{' '}
              <button onClick={onSwitchToRegister} className="text-green-600 font-semibold hover:underline">S'inscrire gratuitement</button>
            </p>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
};

/* ─── Register Modal ─────────────────────────────── */
const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '' });

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://yamo-market-server.vercel.app/api/market/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      showToast('Compte créé avec succès !', 'success');
      setTimeout(() => onSwitchToLogin(), 2500);
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500" />
          <div className="p-8">
            <div className="flex items-start justify-between mb-7">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center">
                    <img src={logo} className="w-6 h-6" alt="YamoMarket Logo" />
                  </div>
                  <span className="font-bold text-gray-900">Yamo<span className="text-green-600">Market</span></span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-3">Créer un compte ✨</h2>
                <p className="text-sm text-gray-400 mt-1">Rejoignez des milliers d'acheteurs</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nom complet</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                      placeholder="Jean Dupont" required
                      className="w-full pl-9 pr-3 py-3 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Téléphone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+237 6XX XXX"
                      className="w-full pl-9 pr-3 py-3 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="vous@exemple.cm"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Mot de passe</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 8 caractères"
                    className="w-full pl-10 pr-11 py-3 text-sm bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" />
                  <button onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${form.password.length >= i * 2 ? (form.password.length >= 8 ? 'bg-green-500' : 'bg-amber-400') : 'bg-gray-200'}`} />
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center">
                En vous inscrivant, vous acceptez nos{' '}
                <span className="text-green-600 font-medium cursor-pointer hover:underline">Conditions d'utilisation</span>
                {' '}et notre{' '}
                <span className="text-green-600 font-medium cursor-pointer hover:underline">Politique de confidentialité</span>.
              </p>

              <button disabled={loading} onClick={handleRegister}
                className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-70 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Création…</>
                  : <><span>Créer mon compte</span> <ArrowRight size={16} /></>}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              Déjà un compte ?{' '}
              <button onClick={onSwitchToLogin} className="text-green-600 font-semibold hover:underline">Se connecter</button>
            </p>
          </div>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
};

/* ─── Profile Dropdown ───────────────────────────── */
const ProfileDropdown = ({ user, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  const [myshop, setMyShop] = useState({});

  useEffect(() => {
      const fetchShop = async () => {
        try {
          const token = localStorage.getItem('market_token');
          const res = await fetch(`https://yamo-market-server.vercel.app/api/market/myshop`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }});
          if (!res.ok) throw new Error('Failed to fetch shop');
          const result = await res.json();
          setMyShop(result);
        } catch (error) {
          console.error('Shop fetch failed:', error);
          setMyShop(null);
        }
      };
      fetchShop();
    }, [])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.username ? user.username[0].toUpperCase() : '?';

  const menuItems = [
    { icon: <User size={15} />, label: 'Mon profil', to: '/user' },
    { icon: <Store size={15} />, label: 'Ma boutique', to:`/my-shop/${myshop?.shop_id}` },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden z-50"
    >
      {/* user info header */}
      <div className="px-4 py-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-md shadow-green-200">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{user?.username || 'Utilisateur'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
            {user?.status ? (
              <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full mt-1">
                <CheckCircle2 size={9} /> Vérifié
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-600 font-semibold px-2 py-0.5 rounded-full mt-1">
                <AlertCircle size={9} /> Non vérifié
              </span>
            )}
          </div>
        </div>
      </div>

      {/* menu items */}
      <div className="p-2">
        {menuItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group"
          >
            <span className="text-gray-400 group-hover:text-green-600 transition-colors">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* divider + logout */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
        >
          <LogOut size={15} />
          <span className="font-semibold">Se déconnecter</span>
        </button>
      </div>
    </div>
  );
};

/* ─── Navbar ─────────────────────────────────────── */
const Navbar = () => {
  const [open, setOpen]               = useState(false);
  const [modal, setModal]             = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [myshop, setMyShop] = useState({});

  const openLogin    = () => { setModal('login');    setOpen(false); };
  const openRegister = () => { setModal('register'); setOpen(false); };
  const closeModal   = () => setModal(null);

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleMobileLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  useEffect(() => {
      const fetchShop = async () => {
        try {
          const token = localStorage.getItem('market_token');
          const res = await fetch(`https://yamo-market-server.vercel.app/api/market/myshop`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }});
          if (!res.ok) throw new Error('Failed to fetch shop');
          const result = await res.json();
          setMyShop(result);
        } catch (error) {
          console.error('Shop fetch failed:', error);
          setMyShop(null);
        }
      };
      fetchShop();
    }, [])

  const initials = currentUser?.username ? currentUser.username[0].toUpperCase() : '?';

  return (
    <>
      <header className="fixed top-3 sm:top-4 inset-x-2 sm:inset-x-4 z-50 max-w-6xl mx-auto">
        <nav className="rounded-2xl backdrop-blur-xl bg-green-900/80 border border-white/10 shadow-xl shadow-black/20 px-3 sm:px-5 md:px-6 flex h-14 items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center shadow-md shadow-green-700/40">
              <img src={logo} className="w-6 h-6" alt="YamoMarket Logo" />
            </div>
            <span className="font-extrabold text-base tracking-tight flex">
              <span className="text-green-400">Yamo</span>
              <span className="text-white">Market</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6 text-sm">
            {links.map(l => (
              <li key={l.link}>
                <Link to={l.link} className="text-white/70 hover:text-white transition-colors font-medium relative group">
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-green-400 rounded-full group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2.5">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 px-3 py-1.5 rounded-xl transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {initials}
                  </div>
                  <span className="text-white text-sm font-semibold max-w-[100px] truncate">
                    {currentUser.username}
                  </span>
                  <ChevronDown size={14} className={`text-white/70 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <ProfileDropdown user={currentUser} onClose={() => setDropdownOpen(false)} />
                )}
              </div>
            ) : (
              <>
                <button onClick={openLogin} className="text-white/80 hover:text-white text-sm font-semibold px-4 py-1.5 rounded-xl hover:bg-white/10 transition-all">
                  Connexion
                </button>
                <button onClick={openRegister} className="bg-green-500 hover:bg-green-400 active:scale-[0.97] text-white text-sm font-bold px-5 py-1.5 rounded-xl shadow-md shadow-green-900/40 transition-all">
                  S'inscrire
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            className="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 rounded-2xl backdrop-blur-xl bg-green-900/90 border border-white/10 shadow-xl shadow-black/20 px-4 py-4 space-y-1">
            {links.map(l => (
              <Link key={l.link} to={l.link}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-xl transition-all font-medium"
                onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}

            {currentUser ? (
              <div className="pt-3 mt-2 border-t border-white/10 space-y-1">
                {/* mobile user card */}
                <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">{currentUser.username}</p>
                    <p className="text-white/50 text-xs truncate">{currentUser.email}</p>
                  </div>
                </div>

                {[
                  { icon: <User size={15} />, label: 'Mon profil', to: '/user' },
                  { icon: <Store size={15} />, label: 'Ma boutique', to: `/my-shop/${myshop?.shop_id}` },
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all">
                    <span className="text-green-400">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                <button
                  onClick={handleMobileLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all mt-1"
                >
                  <LogOut size={15} />
                  <span className="font-semibold">Se déconnecter</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 mt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                <button onClick={openLogin} className="text-white/80 hover:text-white text-sm font-semibold py-2.5 rounded-xl border border-white/20 hover:bg-white/10 transition-all">
                  Connexion
                </button>
                <button onClick={openRegister} className="bg-green-500 hover:bg-green-400 text-white text-sm font-bold py-2.5 rounded-xl shadow-md transition-all">
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {modal === 'login'    && <LoginModal    onClose={closeModal} onSwitchToRegister={openRegister} />}
      {modal === 'register' && <RegisterModal onClose={closeModal} onSwitchToLogin={openLogin} />}
    </>
  );
};

export default Navbar;