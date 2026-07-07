import React, { useEffect, useRef, useState } from "react";
import { Shield, ChevronRight, Mail, ArrowUp, CheckCircle, Scale, Users, CreditCard, Fingerprint, AlertTriangle, FileText, Globe, RefreshCw, Phone, Star, BookOpen, Zap } from "lucide-react";

const SECTIONS = [
  {
    id: "acceptance",
    label: "Acceptance of Terms",
    num: "01",
    icon: <CheckCircle size={18} />,
    color: "from-emerald-500 to-green-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "By creating an account, listing a business, or browsing Yamo Market, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the platform.",
      "Yamo Market is a digital marketplace connecting verified Cameroonian businesses with consumers. These Terms apply to all visitors, registered merchants, and shoppers, collectively referred to as \"users.\""
    ],
  },
  {
    id: "definitions",
    label: "Definitions",
    num: "02",
    icon: <BookOpen size={18} />,
    color: "from-green-500 to-teal-600",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    definitions: [
      ["Merchant", "A business or individual registered to sell products or services on Yamo Market."],
      ["Consumer", "A user who browses, compares, or contacts merchants through the platform."],
      ["Listing", "Any product, service, or business profile published by a merchant."],
      ["Verification", "The identity and business-legitimacy check performed before a merchant is marked \"Verified.\""],
    ],
  },
  {
    id: "eligibility",
    label: "Eligibility",
    num: "03",
    icon: <Users size={18} />,
    color: "from-teal-500 to-emerald-600",
    lightColor: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    body: [
      "You must be at least 18 years old, or the age of majority in your jurisdiction, to register an account. Businesses must be legally established and operating within Cameroon to register as a merchant.",
      "Yamo Market reserves the right to refuse registration or suspend accounts that fail to meet these requirements or provide false information."
    ],
  },
  {
    id: "accounts",
    label: "Account Registration",
    num: "04",
    icon: <Fingerprint size={18} />,
    color: "from-emerald-600 to-green-700",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.",
      "Information provided during registration must be accurate and kept up to date. Impersonating another business or individual is strictly prohibited."
    ],
  },
  {
    id: "verification",
    label: "Business Verification",
    num: "05",
    icon: <Shield size={18} />,
    color: "from-green-600 to-emerald-700",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    body: [
      "Merchants may apply for verification by submitting proof of business registration, identity documents, and a physical operating address within Cameroon. Verification is not a guarantee of quality and does not constitute an endorsement by Yamo Market.",
      "We may revoke a merchant's verified status at any time if submitted information is found to be false, expired, or if the merchant violates these Terms."
    ],
  },
  {
    id: "conduct",
    label: "User Conduct",
    num: "06",
    icon: <AlertTriangle size={18} />,
    color: "from-amber-500 to-orange-600",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    intro: "Users agree not to:",
    bullets: [
      "List counterfeit, illegal, or misrepresented products or services",
      "Post false reviews or manipulate ratings",
      "Harass, defraud, or mislead other users",
      "Use the platform to collect user data for unrelated purposes",
      "Circumvent the verification or moderation process",
    ],
    outro: "Violations may result in listing removal, account suspension, or permanent ban."
  },
  {
    id: "listings",
    label: "Products & Listings",
    num: "07",
    icon: <FileText size={18} />,
    color: "from-emerald-500 to-green-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "Merchants are solely responsible for the accuracy of their listings, including pricing, availability, and product descriptions. Yamo Market does not manufacture, hold, or ship inventory on behalf of merchants.",
      "Transactions, delivery arrangements, and after-sales support occur directly between merchant and consumer unless otherwise stated on the platform."
    ],
  },
  {
    id: "payments",
    label: "Payments & Fees",
    num: "08",
    icon: <CreditCard size={18} />,
    color: "from-green-500 to-emerald-600",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    body: [
      "Basic merchant accounts are free. Premium subscriptions, featured listings, and verification services are billed according to the pricing published on the platform at the time of purchase.",
      "Fees are non-refundable except where required by law or expressly stated in a specific offer. Yamo Market may change pricing with prior notice to affected merchants."
    ],
  },
  {
    id: "ip",
    label: "Intellectual Property",
    num: "09",
    icon: <Star size={18} />,
    color: "from-teal-500 to-green-600",
    lightColor: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    body: [
      "The Yamo Market name, logo, and platform design are the property of Yamo Market. Merchants retain ownership of the content they upload but grant Yamo Market a non-exclusive license to display it on the platform and in related promotional materials."
    ],
  },
  {
    id: "liability",
    label: "Limitation of Liability",
    num: "10",
    icon: <Scale size={18} />,
    color: "from-emerald-600 to-teal-700",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "Yamo Market provides the platform \"as is\" and is not liable for disputes, damages, or losses arising from transactions between merchants and consumers. Our role is limited to facilitating discovery and connection between verified businesses and shoppers."
    ],
  },
  {
    id: "termination",
    label: "Termination",
    num: "11",
    icon: <AlertTriangle size={18} />,
    color: "from-red-500 to-rose-600",
    lightColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    body: [
      "We may suspend or terminate any account that violates these Terms, engages in fraudulent activity, or poses a risk to other users. Users may close their account at any time by contacting support."
    ],
  },
  {
    id: "law",
    label: "Governing Law",
    num: "12",
    icon: <Globe size={18} />,
    color: "from-green-600 to-emerald-700",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    body: [
      "These Terms are governed by the laws of the Republic of Cameroon. Any disputes arising from use of the platform will be subject to the exclusive jurisdiction of Cameroonian courts."
    ],
  },
  {
    id: "changes",
    label: "Changes to Terms",
    num: "13",
    icon: <RefreshCw size={18} />,
    color: "from-emerald-500 to-green-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    body: [
      "We may update these Terms from time to time. Material changes will be communicated to registered users by email or in-app notice at least 14 days before taking effect. Continued use of the platform after changes take effect constitutes acceptance."
    ],
  },
  {
    id: "contact",
    label: "Contact Us",
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
                <p className="text-xs text-green-200">Email légal</p>
                <p className="font-semibold text-sm">yamomarketcm@gmail.com</p>
              </div>
            </a>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Globe size={15} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Adresse</p>
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

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br pt-8 from-green-800 via-green-700 to-emerald-600 overflow-hidden">
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
