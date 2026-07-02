// ShopClickStats.jsx
import React, { useEffect, useState } from 'react';
import { MousePointerClick, TrendingUp, TrendingDown, Package, Megaphone, Loader2 } from 'lucide-react';

const badgeColor = (b) => ({
  New: 'bg-emerald-500', Sale: 'bg-amber-400', Hot: 'bg-rose-500',
  Local: 'bg-green-700', Promo: 'bg-violet-500',
}[b] || 'bg-gray-400');

const ShopClickStats = ({ shopId }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!shopId) return;
    const fetchClicks = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('market_token');
        const res = await fetch(`https://yamo-market-server.vercel.app/api/market/click/shop/${shopId}?months=6`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Ã‰chec du chargement des statistiques');
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    fetchClicks();
  }, [shopId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center gap-2 text-gray-400">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Chargement des statistiquesâ€¦</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-5 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const { shop_clicks, product_clicks, ad_clicks, monthly_totals, vs_last_month, current_month } = data;
  const maxMonthly = Math.max(1, ...monthly_totals.map(m => m.total_clicks));
  const changePct = vs_last_month?.change_pct;

  return (
    <div className="space-y-4">

      {/* Header + shop click totals */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <MousePointerClick size={16} className="text-green-600" />
              Statistiques de clics
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Mois en cours â€” {current_month}</p>
          </div>
          {changePct !== null && changePct !== undefined && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
              changePct >= 0 ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-600'
            }`}>
              {changePct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {changePct >= 0 ? '+' : ''}{changePct}% vs mois dernier
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-extrabold text-gray-900">{shop_clicks.total_clicks}</p>
            <p className="text-xs text-gray-400">Visites de la boutique</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-extrabold text-gray-900">{shop_clicks.unique_ips}</p>
            <p className="text-xs text-gray-400">Visiteurs uniques</p>
          </div>
        </div>

        {/* Monthly trend bars */}
        {monthly_totals.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tendance sur {monthly_totals.length} mois</p>
            <div className="flex items-end gap-2 h-24">
              {monthly_totals.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-green-500 rounded-t-md transition-all"
                    style={{ height: `${Math.max(4, (m.total_clicks / maxMonthly) * 80)}px` }}
                    title={`${m.total_clicks} clics`}
                  />
                  <span className="text-[9px] text-gray-400">{m.month.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Per-product clicks */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-3">
          <Package size={16} className="text-blue-600" />
          Clics par produit
        </h3>
        {product_clicks.length > 0 ? (
          <div className="space-y-2">
            {product_clicks.map(p => (
              <div key={p.product_id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5">
                <img src={p.m_img || 'https://via.placeholder.com/40'} alt={p.product_name}
                  className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.product_name || `Produit #${p.product_id}`}</p>
                    {p.tag && <span className={`text-[9px] px-1.5 py-0.5 rounded-full text-white font-semibold ${badgeColor(p.tag)}`}>{p.tag}</span>}
                  </div>
                  <p className="text-xs text-gray-400">{p.price ? `${p.price} XAF` : ''}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{p.total_clicks}</p>
                  <p className="text-[10px] text-gray-400">{p.unique_ips} visiteurs</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">Aucun clic sur vos produits ce mois-ci.</p>
        )}
      </div>

      {/* Per-ad clicks */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-3">
          <Megaphone size={16} className="text-amber-600" />
          Clics par publicitÃ©
        </h3>
        {ad_clicks.length > 0 ? (
          <div className="space-y-2">
            {ad_clicks.map(a => (
              <div key={a.ads_id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5">
                <img src={a.m_img || 'https://via.placeholder.com/40'} alt={a.title}
                  className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.title || `PublicitÃ© #${a.ads_id}`}</p>
                  <p className="text-xs text-gray-400 truncate">{a.slogan || a.product_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{a.total_clicks}</p>
                  <p className="text-[10px] text-gray-400">{a.unique_ips} visiteurs</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">Aucun clic sur vos publicitÃ©s ce mois-ci.</p>
        )}
      </div>
    </div>
  );
};

export default ShopClickStats;
