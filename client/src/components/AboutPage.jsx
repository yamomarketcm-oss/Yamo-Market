import React, { useRef, useEffect, useState } from 'react';
import {
  MapPin, Users, Store, Package, Star, ArrowRight,
  Shield, ChevronDown, Mail, Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── data ─────────────────────────────────────── */
const STATS = [
  { value: '340+', label: 'Produits listés',     icon: <Package size={20} /> },
  { value: '80+',  label: 'Boutiques actives',   icon: <Store   size={20} /> },
  { value: '12K+', label: 'Acheteurs satisfaits',icon: <Users   size={20} /> },
  { value: '4.8',  label: 'Note moyenne ★',      icon: <Star    size={20} /> },
];

const VALUES = [
  { icon: '🌍', title: 'Ancrage local',          desc: "Nous croyons que l'économie africaine se construit par et pour les Africains. Chaque achat soutient directement un entrepreneur local." },
  { icon: '🛡️', title: 'Confiance absolue',      desc: "Toutes nos boutiques passent par un processus de vérification rigoureux. Achetez l'esprit tranquille — chaque vendeur est authentifié." },
  { icon: '⚡', title: 'Rapidité & fluidité',    desc: "Une interface pensée pour vous, accessible sur mobile ou desktop. Trouvez, comparez et achetez en quelques secondes." },
  { icon: '💚', title: 'Impact communautaire',   desc: "Chaque transaction contribue à la croissance des PME camerounaises et au développement d'un écosystème digital fort." },
];

const TEAM = [
  { name: 'Alain Mbarga',     role: 'Co-fondateur & CEO',      city: 'Yaoundé',    emoji: '👨🏾‍💼', color: 'from-green-400 to-emerald-600' },
  { name: 'Fatoumata Diallo', role: 'Directrice Produit',      city: 'Douala',     emoji: '👩🏾‍💻', color: 'from-teal-400 to-green-600'   },
  { name: 'Kevin Nguema',     role: 'Responsable Tech',        city: 'Bafoussam',  emoji: '👨🏾‍🔧', color: 'from-emerald-500 to-green-700' },
  { name: 'Sandra Ateba',     role: 'Chargée des Boutiques',   city: 'Yaoundé',    emoji: '🧑🏾‍🤝‍🧑🏾', color: 'from-green-600 to-teal-500'   },
];

const MILESTONES = [
  { year: '2022', event: 'Fondation de Yamo Market à Yaoundé par une équipe de 3 passionnés du numérique.' },
  { year: '2023', event: 'Lancement officiel avec 20 boutiques partenaires et 150 produits en ligne.' },
  { year: '2024', event: 'Extension à Douala et Bafoussam. Passage à 80+ boutiques vérifiées et 12 000 utilisateurs.' },
  { year: '2025', event: 'Lancement de la livraison express 24h et du programme de fidélité Yamo Plus.' },
];

/* ─── animated count-up ─────────────────────────── */
const AnimatedStat = ({ value, label, icon }) => {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
      const suffix = value.replace(/[0-9.]/g, '');
      if (!numeric) { setDisplay(value); return; }
      let start = 0;
      const duration = 1200;
      const step = numeric / (duration / 16);
      const tick = () => {
        start = Math.min(start + step, numeric);
        setDisplay(parseFloat(start.toFixed(1)) + suffix);
        if (start < numeric) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center group">
      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 text-green-200 group-hover:bg-white/20 transition-colors">
        {icon}
      </div>
      <p className="text-4xl font-black text-white tracking-tight leading-none">{display}</p>
      <p className="text-green-200 text-sm mt-1.5 font-medium">{label}</p>
    </div>
  );
};

/* ─── main ──────────────────────────────────────── */
const AboutPage = () => {
  const floatOrbs = [
    { emoji: '📱', pos: 'absolute -top-4 left-8',   delay: '0s'   },
    { emoji: '👗', pos: 'absolute top-8 -left-6',   delay: '1.2s' },
    { emoji: '🎧', pos: 'absolute bottom-4 -left-2',delay: '0.6s' },
    { emoji: '🪑', pos: 'absolute -top-2 right-4',  delay: '1.8s' },
    { emoji: '✨', pos: 'absolute bottom-8 right-0',delay: '0.9s' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-semibold px-5 py-2 rounded-full mb-8 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Made in Cameroun 🇨🇲
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight tracking-tight mb-6">
            Le marché{' '}
            <span className="text-green-300 italic">digital</span>
            {' '}qui<br />vous ressemble
          </h1>

          <p className="text-green-100/80 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Yamo Market connecte les acheteurs aux meilleurs vendeurs locaux du Cameroun — avec confiance, simplicité et impact réel.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#mission" className="group flex items-center gap-2 bg-white text-green-800 font-semibold text-sm px-6 py-3 rounded-2xl hover:bg-green-50 transition-all shadow-xl shadow-green-900/20">
              Notre histoire <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="flex items-center gap-2 border border-white/30 text-white font-semibold text-sm px-6 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              Nous contacter
            </a>
          </div>

          <div className="mt-16 flex justify-center text-white/30 animate-bounce">
            <ChevronDown size={22} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gray-50"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />
      </section>

      {/* ── STATS ── */}
      <section className="bg-gradient-to-r from-green-700 to-emerald-600 py-14">
        <div className="max-w-4xl mx-auto px-5 grid grid-cols-2 sm:grid-cols-4 gap-10">
          {STATS.map(s => <AnimatedStat key={s.label} {...s} />)}
        </div>
      </section>

      {/* ── MISSION ── */}
      <section id="mission" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* visual */}
          <div className="relative flex justify-center">
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center relative">
              <div className="text-center">
                <div className="text-7xl mb-2">🛒</div>
                <p className="font-bold text-green-800 text-xl">Yamo Market</p>
                <p className="text-green-600 text-sm">Douala · Yaoundé · Bafoussam</p>
              </div>
              {floatOrbs.map((b, i) => (
                <div key={i}
                  className={`${b.pos} w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl`}
                  style={{ animation: `bounce 3s ease-in-out ${b.delay} infinite` }}>
                  {b.emoji}
                </div>
              ))}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-6 py-3 flex items-center gap-3 border border-green-100 whitespace-nowrap">
              <span className="text-2xl">🇨🇲</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">100% camerounais</p>
                <p className="text-xs text-gray-400">Fier de nos racines</p>
              </div>
            </div>
          </div>

          {/* text */}
          <div>
            <span className="inline-block text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider mb-5">Notre mission</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
              Rendre le commerce local{' '}
              <span className="text-green-600 italic">accessible à tous</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Yamo Market est né d'une conviction simple : les meilleurs produits du Cameroun méritent une vitrine digitale à leur hauteur. Trop souvent, des artisans, commerçants et PME brillants restent invisibles faute d'outils adaptés.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Nous avons bâti une plateforme pensée pour l'Afrique — fluide sur mobile, disponible dans toutes les villes, et construite sur la confiance mutuelle entre acheteurs et vendeurs locaux.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Vérification des boutiques', 'Paiement sécurisé', 'Support 7j/7', 'Livraison locale'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 text-xs font-semibold text-green-800 bg-green-100 border border-green-200 px-3 py-1.5 rounded-full">
                  <Shield size={10} /> {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-white py-20 border-t border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">Notre parcours</span>
            <h2 className="text-4xl font-black text-gray-900 mt-4">De l'idée au marché</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-green-100" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <div key={i} className="relative pl-16 group">
                  <div className="absolute left-0 top-1 w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-green-200 group-hover:scale-105 transition-transform">
                    {m.year.slice(2)}
                  </div>
                  <p className="text-xs font-bold text-green-500 mb-1 uppercase tracking-wider">{m.year}</p>
                  <p className="text-gray-700 leading-relaxed">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section id="values" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">Ce qui nous guide</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-4">Nos valeurs fondamentales</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">Chaque décision que nous prenons est alignée sur ces principes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((v, i) => (
              <div key={i} className="group bg-white rounded-3xl border border-gray-100 p-7 hover:border-green-200 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 flex gap-5 items-start">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="team" className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">Les visages derrière Yamo</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-4">Notre équipe</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">Une équipe passionnée, ancrée au Cameroun, qui rêve grand et construit chaque jour.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TEAM.map((t, i) => (
              <div key={i} className="group text-center">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${t.color} mx-auto flex items-center justify-center text-4xl shadow-lg group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-green-200/60 transition-all duration-300 mb-4`}>
                  {t.emoji}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">{t.role}</p>
                <p className="text-xs text-gray-400 flex items-center justify-center gap-0.5 mt-1">
                  <MapPin size={9} /> {t.city}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-10">Et toute une communauté de contributeurs, partenaires et boutiques qui font vivre Yamo chaque jour. 💚</p>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="relative bg-gradient-to-r from-green-800 to-emerald-700 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-20 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <div className="text-5xl mb-5 animate-bounce inline-block">🚀</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Prêt à rejoindre<br />
            <span className="text-green-300">l'aventure Yamo ?</span>
          </h2>
          <p className="text-green-100/80 text-lg mb-8 max-w-lg mx-auto">
            Que vous soyez acheteur ou vendeur, votre place est ici. Rejoignez des milliers de Camerounais qui font confiance à Yamo Market.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="group bg-white text-green-800 font-bold text-sm px-8 py-3.5 rounded-2xl hover:bg-green-50 transition-all shadow-2xl shadow-green-900/30 flex items-center gap-2">
              Explorer les produits <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/user" className="border border-white/30 text-white font-semibold text-sm px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-colors flex items-center gap-2">
              <Store size={15} /> Ouvrir ma boutique
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">Écrivez-nous</span>
            <h2 className="text-4xl font-black text-gray-900 mt-4">Nous contacter</h2>
            <p className="text-gray-500 mt-2">Une question, un partenariat, une idée ? On est là.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { icon: <Mail size={18} />, label: 'Email',     val: 'contact@yamomarket.cm',  color: 'bg-green-100 text-green-700'   },
              { icon: <Phone size={18} />, label: 'Téléphone',val: '+237 6 99 00 11 22',      color: 'bg-emerald-100 text-emerald-700' },
              { icon: <MapPin size={18} />, label: 'Siège',   val: 'Yaoundé, Cameroun 🇨🇲', color: 'bg-teal-100 text-teal-700'      },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:border-green-200 transition-all">
                <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center flex-shrink-0`}>{c.icon}</div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{c.label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{c.val}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input placeholder="Votre nom" className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all" />
              <input placeholder="Votre email" className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all" />
            </div>
            <textarea placeholder="Votre message…" rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all resize-none mb-4" />
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-green-200">
              Envoyer le message <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── 
      <footer className="bg-green-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center text-white font-black text-sm">Y</div>
            <span className="font-semibold text-white text-base">Yamo <span className="text-green-300">Market</span></span>
          </div>
          <p className="text-green-400/70 text-sm text-center">
            © {new Date().getFullYear()} Yamo Market — Fait avec <span className="text-green-300">💚</span> au Cameroun
          </p>
          <div className="flex items-center gap-4 text-sm text-green-400/70">
            <a href="#" className="hover:text-green-200 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-green-200 transition-colors">CGU</a>
            <a href="#" className="hover:text-green-200 transition-colors">Sitemap</a>
          </div>
        </div>
      </footer>
      */}
    </div>
  );
};

export default AboutPage;