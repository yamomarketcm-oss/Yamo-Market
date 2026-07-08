import React, { useEffect, useRef, useState } from "react";
import { Shield, ChevronRight, Mail, ArrowUp, CheckCircle, Scale, Users, CreditCard, Fingerprint, AlertTriangle, FileText, Globe, RefreshCw, Phone, Star, BookOpen, Zap } from "lucide-react";

const SECTIONS = [
  {
    id: "acceptance",
    label: "Acceptation des conditions",
    num: "01",
    icon: <CheckCircle size={18} />,
    color: "from-emerald-500 to-green-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "En créant un compte, en référençant une activité ou en naviguant sur Yamo Market, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation (« CGU »). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.",
      "Yamo Market est une marketplace digitale qui met en relation des entreprises camerounaises vérifiées et des consommateurs. Ces CGU s'appliquent à tous les visiteurs, marchands inscrits et acheteurs, collectivement désignés par le terme « utilisateurs »."
    ],
  },
  {
    id: "definitions",
    label: "Définitions",
    num: "02",
    icon: <BookOpen size={18} />,
    color: "from-green-500 to-teal-600",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    definitions: [
      ["Marchand", "Une entreprise ou un particulier inscrit pour vendre des produits ou services sur Yamo Market."],
      ["Consommateur", "Un utilisateur qui parcourt, compare ou contacte des marchands via la plateforme."],
      ["Annonce", "Tout produit, service ou profil d'entreprise publié par un marchand."],
      ["Vérification", "Le contrôle d'identité et de légitimité commerciale effectué avant qu'un marchand soit marqué « Vérifié »."],
    ],
  },
  {
    id: "eligibility",
    label: "Conditions d'éligibilité",
    num: "03",
    icon: <Users size={18} />,
    color: "from-teal-500 to-emerald-600",
    lightColor: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    body: [
      "Vous devez avoir au moins 18 ans, ou l'âge de la majorité dans votre juridiction, pour créer un compte. Les entreprises doivent être légalement constituées et opérer au Cameroun pour s'inscrire en tant que marchand.",
      "Yamo Market se réserve le droit de refuser l'inscription ou de suspendre les comptes ne répondant pas à ces exigences ou ayant fourni de fausses informations."
    ],
  },
  {
    id: "accounts",
    label: "Création de compte",
    num: "04",
    icon: <Fingerprint size={18} />,
    color: "from-emerald-600 to-green-700",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités effectuées depuis votre compte. Signalez-nous immédiatement toute utilisation non autorisée.",
      "Les informations fournies lors de l'inscription doivent être exactes et tenues à jour. L'usurpation d'identité d'une autre entreprise ou d'un autre particulier est strictement interdite."
    ],
  },
  {
    id: "verification",
    label: "Vérification des entreprises",
    num: "05",
    icon: <Shield size={18} />,
    color: "from-green-600 to-emerald-700",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    body: [
      "Les marchands peuvent demander une vérification en soumettant une preuve d'immatriculation, des pièces d'identité et une adresse physique d'exploitation au Cameroun. La vérification ne constitue pas une garantie de qualité ni un cautionnement de la part de Yamo Market.",
      "Nous pouvons révoquer le statut vérifié d'un marchand à tout moment si les informations soumises s'avèrent fausses, expirées ou si le marchand enfreint les présentes CGU."
    ],
  },
  {
    id: "conduct",
    label: "Comportement des utilisateurs",
    num: "06",
    icon: <AlertTriangle size={18} />,
    color: "from-amber-500 to-orange-600",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    intro: "Les utilisateurs s'engagent à ne pas :",
    bullets: [
      "Publier des produits ou services contrefaits, illégaux ou faussement présentés",
      "Poster de faux avis ou manipuler les notes",
      "Harceler, escroquer ou induire en erreur d'autres utilisateurs",
      "Utiliser la plateforme pour collecter des données personnelles à des fins non liées",
      "Contourner le processus de vérification ou de modération",
    ],
    outro: "Tout manquement peut entraîner la suppression d'annonces, la suspension du compte ou un bannissement définitif."
  },
  {
    id: "listings",
    label: "Produits & annonces",
    num: "07",
    icon: <FileText size={18} />,
    color: "from-emerald-500 to-green-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "Les marchands sont seuls responsables de l'exactitude de leurs annonces, notamment les prix, la disponibilité et les descriptions de produits. Yamo Market ne fabrique, ne stocke ni n'expédie aucun article pour le compte des marchands.",
      "Les transactions, modalités de livraison et le service après-vente s'effectuent directement entre le marchand et le consommateur, sauf mention contraire sur la plateforme."
    ],
  },
  {
    id: "payments",
    label: "Paiements & frais",
    num: "08",
    icon: <CreditCard size={18} />,
    color: "from-green-500 to-emerald-600",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    body: [
      "Les comptes marchands de base sont gratuits. Les abonnements premium, les annonces mises en avant et les services de vérification sont facturés selon les tarifs publiés sur la plateforme au moment de l'achat.",
      "Les frais ne sont pas remboursables, sauf obligation légale ou mention expresse dans une offre spécifique. Yamo Market peut modifier ses tarifs avec un préavis adressé aux marchands concernés."
    ],
  },
  {
    id: "ip",
    label: "Propriété intellectuelle",
    num: "09",
    icon: <Star size={18} />,
    color: "from-teal-500 to-green-600",
    lightColor: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    body: [
      "Le nom, le logo et la conception visuelle de Yamo Market sont la propriété exclusive de Yamo Market. Les marchands conservent la propriété du contenu qu'ils publient, mais accordent à Yamo Market une licence non exclusive pour l'afficher sur la plateforme et dans les supports promotionnels associés."
    ],
  },
  {
    id: "liability",
    label: "Limitation de responsabilité",
    num: "10",
    icon: <Scale size={18} />,
    color: "from-emerald-600 to-teal-700",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "Yamo Market met la plateforme à disposition « en l'état » et décline toute responsabilité pour les litiges, dommages ou pertes résultant de transactions entre marchands et consommateurs. Notre rôle se limite à faciliter la mise en relation entre entreprises vérifiées et acheteurs."
    ],
  },
  {
    id: "termination",
    label: "Résiliation",
    num: "11",
    icon: <AlertTriangle size={18} />,
    color: "from-red-500 to-rose-600",
    lightColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    body: [
      "Nous pouvons suspendre ou résilier tout compte enfreignant les présentes CGU, se livrant à des activités frauduleuses ou représentant un risque pour les autres utilisateurs. Les utilisateurs peuvent clôturer leur compte à tout moment en contactant notre support."
    ],
  },
  {
    id: "law",
    label: "Droit applicable",
    num: "12",
    icon: <Globe size={18} />,
    color: "from-green-600 to-emerald-700",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    body: [
      "Les présentes CGU sont régies par les lois de la République du Cameroun. Tout litige découlant de l'utilisation de la plateforme relèvera de la compétence exclusive des juridictions camerounaises."
    ],
  },
  {
    id: "changes",
    label: "Modifications des CGU",
    num: "13",
    icon: <RefreshCw size={18} />,
    color: "from-emerald-500 to-green-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "Nous pouvons mettre à jour les présentes CGU à tout moment. Les modifications importantes seront communiquées aux utilisateurs inscrits par e-mail ou notification in-app au moins 14 jours avant leur entrée en vigueur. La poursuite de l'utilisation de la plateforme après cette date vaut acceptation des nouvelles conditions."
    ],
  },
  {
    id: "contact",
    label: "Nous contacter",
    num: "14",
    icon: <Mail size={18} />,
    color: "from-green-700 to-emerald-800",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    contact: true,
  },
];

/* ─── Section Card ─────────────────────────────────── */
const SectionCard = ({ s, sectionRef }) => (
  <section
    id={s.id}
    ref={sectionRef}
    style={{ scrollMarginTop: "6rem" }}
    className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-green-200 hover:shadow-xl hover:shadow-green-100/40 transition-all duration-300"
  >
    {/* Left accent bar */}
    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${s.color}`} />

    <div className="pl-8 pr-6 py-7">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
          {s.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-bold ${s.textColor} bg-gradient-to-r ${s.lightColor} px-2.5 py-0.5 rounded-full border ${s.borderColor}`}>
              ART. {s.num}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1 leading-tight">{s.label}</h2>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
        {s.body?.map((p, i) => <p key={i}>{p}</p>)}

        {s.definitions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {s.definitions.map(([term, def]) => (
              <div key={term} className={`rounded-2xl ${s.lightColor} border ${s.borderColor} p-4`}>
                <p className={`font-bold text-sm ${s.textColor} mb-1`}>{term}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{def}</p>
              </div>
            ))}
          </div>
        )}

        {s.intro && <p className="font-medium text-gray-700">{s.intro}</p>}
        {s.bullets && (
          <ul className="space-y-2">
            {s.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <ChevronRight size={11} className="text-white" />
                </div>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {s.outro && <p className="font-semibold text-gray-700 pt-1">{s.outro}</p>}

        {s.contact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <a
              href="mailto:legal@yamomarket.cm"
              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl px-5 py-3.5 transition-colors group/link"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Mail size={15} />
              </div>
              <div>
                <p className="text-xs text-green-200">Courriel juridique</p>
                <p className="font-semibold text-sm">legal@yamomarket.cm</p>
              </div>
            </a>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Globe size={15} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Siège social</p>
                <p className="font-semibold text-sm text-gray-800">Yamo Market S.A., Douala</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
);

/* ─── MAIN ─────────────────────────────────────────── */
export default function TermsAndConditions() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">Yamo</span>
            <span className="text-xs font-bold text-green-600 tracking-widest uppercase">Market</span>
          </div>

          {/* Pill badge */}
          <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5">
            <Scale size={12} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700">Conditions d'utilisation</span>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors"
          >
            {menuOpen ? "Fermer" : "Sections"}
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/5 rounded-full" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                Document légal officiel
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
                Conditions<br />
                <span className="text-green-300">d'utilisation</span>
              </h1>
              <p className="text-green-100 text-base mt-4 max-w-lg leading-relaxed">
                Lisez attentivement ces conditions avant de créer un compte ou de publier une annonce sur Yamo Market.
              </p>
            </div>
            {/* Meta cards */}
            <div className="flex flex-wrap gap-3 lg:flex-col lg:items-end">
              {[
                { label: "Mis à jour le", value: "8 Juillet 2026" },
                { label: "Articles", value: `${SECTIONS.length} sections` },
                { label: "Juridiction", value: "République du Cameroun" },
              ].map(m => (
                <div key={m.label} className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-right">
                  <p className="text-green-300 text-[10px] font-semibold uppercase tracking-widest">{m.label}</p>
                  <p className="text-white font-bold text-sm">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">

        {/* ── Sidebar ToC ── */}
        <aside className={`${menuOpen ? "block" : "hidden"} lg:block lg:sticky lg:top-24 self-start`}>
          {/* Mobile backdrop */}
          {menuOpen && <div className="fixed inset-0 bg-black/20 z-10 lg:hidden" onClick={() => setMenuOpen(false)} />}

          <div className={`${menuOpen ? "fixed left-4 right-4 top-20 z-20 shadow-2xl" : "relative"} lg:relative lg:shadow-none bg-white rounded-3xl border border-gray-100 overflow-hidden`}>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-4">
              <p className="text-white font-bold text-sm">Table des matières</p>
              <p className="text-green-200 text-xs mt-0.5">{SECTIONS.length} articles</p>
            </div>
            <div className="p-3 max-h-[65vh] overflow-y-auto">
              {SECTIONS.map((s) => {
                const isActive = activeId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 transition-all text-xs font-medium group
                      ${isActive
                        ? "bg-green-600 text-white shadow-md shadow-green-200"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                  >
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0
                      ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-green-100 group-hover:text-green-600"}`}>
                      {s.num}
                    </span>
                    <span className="leading-tight">{s.label}</span>
                    {isActive && <ChevronRight size={12} className="ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="min-w-0">
          {/* Intro banner */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
              <Shield size={22} className="text-green-700" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Bienvenue sur Yamo Market</h2>
              <p className="text-gray-500 text-sm leading-relaxed mt-1">
                Ces Conditions d'utilisation régissent votre accès et votre utilisation de notre site web, de notre application mobile et de nos services connexes. Veuillez les lire attentivement avant de créer un compte ou de lister une activité.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {SECTIONS.map((s) => (
              <SectionCard
                key={s.id}
                s={s}
                sectionRef={(el) => (sectionRefs.current[s.id] = el)}
              />
            ))}
          </div>

          {/* Agreement footer */}
          <div className="mt-8 bg-gradient-to-br from-green-700 to-emerald-700 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white/5 rounded-full" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-green-300" />
                  <span className="text-green-200 text-xs font-bold uppercase tracking-widest">Accord</span>
                </div>
                <h3 className="text-white text-xl font-bold">En utilisant Yamo Market</h3>
                <p className="text-green-100 text-sm mt-1 max-w-md leading-relaxed">
                  Vous confirmez avoir lu, compris et accepté l'intégralité de ces Conditions d'utilisation.
                </p>
              </div>
              <a
                href="mailto:legal@yamomarket.cm"
                className="flex items-center gap-2 bg-white text-green-800 font-semibold text-sm px-6 py-3 rounded-2xl hover:bg-green-50 transition-colors shadow-lg flex-shrink-0"
              >
                <Mail size={15} />
                Nous contacter
              </a>
            </div>
          </div>
        </main>
      </div>

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-green-300/40 transition-all hover:scale-105"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
