import pool from '../db.js';

/* ═══════════════════════════════════════════════════════════════
   TABLE: click_logs
     shoplead_ip  INTEGER  → id of the thing clicked (product_id / shop_id / ads_id)
     vendor       INTEGER  → vendor user_id (optional)
     shop         INTEGER  → shop_id (for scoping seller queries)
     clict_type   VARCHAR  → 'shop' | 'product' | 'ads'
     ip_address   VARCHAR  → client IP string
     clicked_at   TIMESTAMPTZ DEFAULT NOW()

   Run once:
   ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS
     clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
   CREATE INDEX IF NOT EXISTS idx_cl_time   ON click_logs (clicked_at);
   CREATE INDEX IF NOT EXISTS idx_cl_shop   ON click_logs (shop);
   CREATE INDEX IF NOT EXISTS idx_cl_target ON click_logs (shoplead_ip, clict_type);
═══════════════════════════════════════════════════════════════ */

const ALLOWED_TYPES = ['shop', 'product', 'ads'];
const DEDUP_SECONDS = 60;

const getIP = (req) => {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || req.ip || '0.0.0.0';
};


/* ═══════════════════════════════════════════════════════════════
   POST /api/market/clicks/log
   Body: { clict_type: 'shop'|'product'|'ads', shoplead_ip, shop, vendor }
   Public — no auth.
═══════════════════════════════════════════════════════════════ */
export const logClick = async (req, res) => {
  const { clict_type, shoplead_ip, shop, vendor } = req.body;

  if (!clict_type || !shoplead_ip) {
    return res.status(400).json({
      success: false,
      message: 'clict_type and shoplead_ip are required.',
    });
  }
  if (!ALLOWED_TYPES.includes(clict_type)) {
    return res.status(400).json({
      success: false,
      message: `clict_type must be one of: ${ALLOWED_TYPES.join(', ')}`,
    });
  }

  const ip = getIP(req);

  try {
    /* dedup: same IP + same target within DEDUP_SECONDS → skip */
    const dup = await pool.query(
      `SELECT shoplead_ip FROM "click_logs"
       WHERE clict_type  = $1
         AND shoplead_ip = $2
         AND ip_address  = $3
         AND clicked_at  > NOW() - ($4 || ' seconds')::INTERVAL
       LIMIT 1`,
      [clict_type, parseInt(shoplead_ip), ip, DEDUP_SECONDS]
    );

    if (dup.rows.length > 0) {
      return res.status(200).json({ success: true, counted: false });
    }

    await pool.query(
      `INSERT INTO "click_logs" (shoplead_ip, vendor, shop, clict_type, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        parseInt(shoplead_ip),
        vendor ? parseInt(vendor) : null,
        shop   ? parseInt(shop)   : null,
        clict_type,
        ip,
      ]
    );

    return res.status(201).json({ success: true, counted: true });

  } catch (err) {
    console.error('[logClick]', err.message);
    return res.status(500).json({ success: false, message: 'Server error logging click.' });
  }
};


/* ═══════════════════════════════════════════════════════════════
   GET /api/market/clicks/shop/:shop_id
   Full monthly feedback for a shop owner.
   Returns:
     - shop page clicks this month       (clict_type = 'shop')
     - per-product clicks this month     (clict_type = 'product')
     - per-ad clicks this month          (clict_type = 'ads')
     - combined monthly trend
     - % change vs last month
   Query param: months (default 6, max 24)
═══════════════════════════════════════════════════════════════ */
export const getShopClicks = async (req, res) => {
  const { shop_id } = req.params;
  const { months = 6 } = req.query;

  if (!shop_id) {
    return res.status(400).json({ success: false, message: 'shop_id is required.' });
  }

  const shopId    = parseInt(shop_id);
  const monthsInt = Math.min(parseInt(months) || 6, 24);

  try {
    /* 1. Shop page clicks this month (clict_type = 'shop') */
    const shopThisMonth = await pool.query(
      `SELECT
         COUNT(*)                   AS total_clicks,
         COUNT(DISTINCT ip_address) AS unique_ips
       FROM "click_logs"
       WHERE shop       = $1
         AND clict_type = 'shop'
         AND clicked_at >= DATE_TRUNC('month', NOW())`,
      [shopId]
    );

    /* 2. Per-product clicks this month with product details */
    const productClicks = await pool.query(
      `SELECT
         cl.shoplead_ip              AS product_id,
         COUNT(*)                    AS total_clicks,
         COUNT(DISTINCT cl.ip_address) AS unique_ips,
         p.product_name,
         p.price,
         p.m_img,
         p.tag
       FROM "click_logs" cl
       LEFT JOIN "Product" p ON p.product_id = cl.shoplead_ip
       WHERE cl.shop       = $1
         AND cl.clict_type = 'product'
         AND cl.clicked_at >= DATE_TRUNC('month', NOW())
       GROUP BY cl.shoplead_ip, p.product_name, p.price, p.m_img, p.tag
       ORDER BY total_clicks DESC`,
      [shopId]
    );

    /* 3. Per-ad clicks this month with ad + product details */
    const adClicks = await pool.query(
      `SELECT
         cl.shoplead_ip              AS ads_id,
         COUNT(*)                    AS total_clicks,
         COUNT(DISTINCT cl.ip_address) AS unique_ips,
         a.title,
         a.slogan,
         p.product_name,
         p.m_img
       FROM "click_logs" cl
       LEFT JOIN "Ads"      a ON a.product     = cl.shoplead_ip
       LEFT JOIN "Product" p ON p.product_id = a.product
       WHERE cl.shop  = $1
         AND cl.clict_type = 'ads'
         AND cl.clicked_at >= DATE_TRUNC('month', NOW())
       GROUP BY cl.shoplead_ip, a.title, a.slogan, p.product_name, p.m_img
       ORDER BY total_clicks DESC`,
      [shopId]
    );

    /* 4. Combined monthly totals (all clict_types) over N months */
    const monthlyTotals = await pool.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', clicked_at), 'YYYY-MM') AS month,
         COUNT(*)                                              AS total_clicks,
         COUNT(DISTINCT ip_address)                           AS unique_ips
       FROM "click_logs"
       WHERE shop      = $1
         AND clicked_at >= DATE_TRUNC('month', NOW()) - ($2 - 1) * INTERVAL '1 month'
       GROUP BY DATE_TRUNC('month', clicked_at)
       ORDER BY DATE_TRUNC('month', clicked_at) ASC`,
      [shopId, monthsInt]
    );

    /* 5. % change vs last month */
    const cur  = monthlyTotals.rows.at(-1);
    const prev = monthlyTotals.rows.at(-2);
    let change_pct = null;
    if (cur && prev && parseInt(prev.total_clicks) > 0) {
      change_pct = parseFloat(
        (((parseInt(cur.total_clicks) - parseInt(prev.total_clicks))
          / parseInt(prev.total_clicks)) * 100).toFixed(1)
      );
    }

    return res.status(200).json({
      success:       true,
      shop_id:       shopId,
      current_month: new Date().toISOString().slice(0, 7),

      /* shop page visits */
      shop_clicks: {
        total_clicks: parseInt(shopThisMonth.rows[0]?.total_clicks ?? 0),
        unique_ips:   parseInt(shopThisMonth.rows[0]?.unique_ips   ?? 0),
      },

      /* per-product breakdown with details */
      product_clicks: productClicks.rows.map(r => ({
        product_id:   parseInt(r.product_id),
        total_clicks: parseInt(r.total_clicks),
        unique_ips:   parseInt(r.unique_ips),
        product_name: r.product_name ?? null,
        price:        r.price        ?? null,
        m_img:        r.m_img        ?? null,
        tag:          r.tag          ?? null,
      })),
      top_product_this_month: productClicks.rows[0] ? {
        product_id:   parseInt(productClicks.rows[0].product_id),
        total_clicks: parseInt(productClicks.rows[0].total_clicks),
        unique_ips:   parseInt(productClicks.rows[0].unique_ips),
        product_name: productClicks.rows[0].product_name ?? null,
        price:        productClicks.rows[0].price        ?? null,
        m_img:        productClicks.rows[0].m_img        ?? null,
      } : null,

      /* per-ad breakdown with details */
      ad_clicks: adClicks.rows.map(r => ({
        ads_id:       parseInt(r.ads_id),
        total_clicks: parseInt(r.total_clicks),
        unique_ips:   parseInt(r.unique_ips),
        title:        r.title        ?? null,
        slogan:       r.slogan       ?? null,
        product_name: r.product_name ?? null,
        m_img:        r.m_img        ?? null,
      })),
      top_ad_this_month: adClicks.rows[0] ? {
        ads_id:       parseInt(adClicks.rows[0].ads_id),
        total_clicks: parseInt(adClicks.rows[0].total_clicks),
        unique_ips:   parseInt(adClicks.rows[0].unique_ips),
        title:        adClicks.rows[0].title        ?? null,
        product_name: adClicks.rows[0].product_name ?? null,
        m_img:        adClicks.rows[0].m_img        ?? null,
      } : null,

      /* monthly trend chart data */
      monthly_totals: monthlyTotals.rows.map(r => ({
        month:        r.month,
        total_clicks: parseInt(r.total_clicks),
        unique_ips:   parseInt(r.unique_ips),
      })),
      vs_last_month: { change_pct },
    });

  } catch (err) {
    console.error('[getShopClicks]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};


/* ═══════════════════════════════════════════════════════════════
   GET /api/market/clicks/product/:product_id
   Month-by-month breakdown for one specific product.
   Query param: months (default 6)
═══════════════════════════════════════════════════════════════ */
export const getProductClicks = async (req, res) => {
  const { product_id } = req.params;
  const { months = 6 } = req.query;

  if (!product_id) {
    return res.status(400).json({ success: false, message: 'product_id is required.' });
  }

  const monthsInt = Math.min(parseInt(months) || 6, 24);

  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', clicked_at), 'YYYY-MM') AS month,
         COUNT(*)                                              AS total_clicks,
         COUNT(DISTINCT ip_address)                           AS unique_ips
       FROM "click_logs"
       WHERE clict_type  = 'product'
         AND shoplead_ip = $1
         AND clicked_at >= DATE_TRUNC('month', NOW()) - ($2 - 1) * INTERVAL '1 month'
       GROUP BY DATE_TRUNC('month', clicked_at)
       ORDER BY DATE_TRUNC('month', clicked_at) ASC`,
      [parseInt(product_id), monthsInt]
    );

    const current = result.rows.at(-1) ?? null;

    return res.status(200).json({
      success:       true,
      product_id:    parseInt(product_id),
      months:        monthsInt,
      current_month: new Date().toISOString().slice(0, 7),
      this_month: {
        total_clicks: current ? parseInt(current.total_clicks) : 0,
        unique_ips:   current ? parseInt(current.unique_ips)   : 0,
      },
      monthly: result.rows.map(r => ({
        month:        r.month,
        total_clicks: parseInt(r.total_clicks),
        unique_ips:   parseInt(r.unique_ips),
      })),
    });

  } catch (err) {
    console.error('[getProductClicks]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};


/* ═══════════════════════════════════════════════════════════════
   GET /api/market/clicks/ads/:ads_id
   Month-by-month breakdown for one specific ad.
   Query param: months (default 6)
═══════════════════════════════════════════════════════════════ */
export const getAdsClicks = async (req, res) => {
  const { ads_id } = req.params;
  const { months = 6 } = req.query;

  if (!ads_id) {
    return res.status(400).json({ success: false, message: 'ads_id is required.' });
  }

  const monthsInt = Math.min(parseInt(months) || 6, 24);

  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', clicked_at), 'YYYY-MM') AS month,
         COUNT(*)                                              AS total_clicks,
         COUNT(DISTINCT ip_address)                           AS unique_ips
       FROM "click_logs"
       WHERE clict_type  = 'ads'
         AND shoplead_ip = $1
         AND clicked_at >= DATE_TRUNC('month', NOW()) - ($2 - 1) * INTERVAL '1 month'
       GROUP BY DATE_TRUNC('month', clicked_at)
       ORDER BY DATE_TRUNC('month', clicked_at) ASC`,
      [parseInt(ads_id), monthsInt]
    );

    const current = result.rows.at(-1) ?? null;

    return res.status(200).json({
      success:       true,
      ads_id:        parseInt(ads_id),
      months:        monthsInt,
      current_month: new Date().toISOString().slice(0, 7),
      this_month: {
        total_clicks: current ? parseInt(current.total_clicks) : 0,
        unique_ips:   current ? parseInt(current.unique_ips)   : 0,
      },
      monthly: result.rows.map(r => ({
        month:        r.month,
        total_clicks: parseInt(r.total_clicks),
        unique_ips:   parseInt(r.unique_ips),
      })),
    });

  } catch (err) {
    console.error('[getAdsClicks]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};



/* ═══════════════════════════════════════════════════════════════
   GET /api/market/clicks/admin?clict_type=shop|product|ads
   Platform-wide current-month totals with full details joined.

   clict_type=shop    → joins shops table for shop_name, region, town, category
   clict_type=product → joins products + shops for product_name, price, shop_name, m_img
   clict_type=ads     → joins ads + products for title, slogan, product_name, m_img
═══════════════════════════════════════════════════════════════ */
export const getAdminClicks = async (req, res) => {
  const { clict_type } = req.query;

  if (!clict_type || !ALLOWED_TYPES.includes(clict_type)) {
    return res.status(400).json({
      success: false,
      message: `clict_type must be one of: ${ALLOWED_TYPES.join(', ')}`,
    });
  }

  try {
    let rows;

    if (clict_type === 'shop') {
      /* ── join shops table ── */
      const result = await pool.query(
        `SELECT
           cl.shoplead_ip,
           cl.shop,
           COUNT(*)                   AS total_clicks,
           COUNT(DISTINCT cl.ip_address) AS unique_ips,
           s.shop_name,
           s.region,
           s.town,
           s.category,
           s.profile                  AS shop_image
         FROM "click_logs" cl
         LEFT JOIN "Shop" s ON s.shop_id = cl.shoplead_ip
         WHERE cl.clict_type = 'shop'
           AND cl.clicked_at >= DATE_TRUNC('month', NOW())
         GROUP BY cl.shoplead_ip, cl.shop, s.shop_name, s.region, s.town,
                  s.category, s.profile
         ORDER BY total_clicks DESC`
      );
      rows = result.rows.map(r => ({
        shoplead_ip:  r.shoplead_ip,
        shop:         r.shop,
        total_clicks: r.total_clicks,
        unique_ips:   r.unique_ips,
        shop_name:    r.shop_name   ?? null,
        region:       r.region      ?? null,
        town:         r.town        ?? null,
        category:     r.category    ?? null,
        shop_status:  r.shop_status ?? null,
        shop_image:   r.shop_image  ?? null,
      }));

    } else if (clict_type === 'product') {
      /* ── join products + shops tables ── */
      const result = await pool.query(
        `SELECT
           cl.shoplead_ip,
           cl.shop,
           COUNT(*)                      AS total_clicks,
           COUNT(DISTINCT cl.ip_address) AS unique_ips,
           p.product_name,
           p.price,
           p.tag,
           p.m_img,
           s.shop_name,
           s.region,
           s.town
         FROM "click_logs" cl
         LEFT JOIN "Product" p ON p.product_id = cl.shoplead_ip
         LEFT JOIN "Shop"   s ON s.shop_id    = cl.shop
         WHERE cl.clict_type = 'product'
           AND cl.clicked_at >= DATE_TRUNC('month', NOW())
         GROUP BY cl.shoplead_ip, cl.shop, p.product_name, p.price, p.tag,
                  p.m_img, s.shop_name, s.region, s.town
         ORDER BY total_clicks DESC`
      );
      rows = result.rows.map(r => ({
        shoplead_ip:    r.shoplead_ip,
        shop:           r.shop,
        total_clicks:   r.total_clicks,
        unique_ips:     r.unique_ips,
        product_name:   r.product_name   ?? null,
        price:          r.price          ?? null,
        tag:            r.tag            ?? null,
        m_img:          r.m_img          ?? null,
        product_status: r.product_status ?? null,
        shop_name:      r.shop_name      ?? null,
        region:         r.region         ?? null,
        town:           r.town           ?? null,
      }));

    } else {
      /* ── clict_type = 'ads': join ads + products ── */
      const result = await pool.query(
        `SELECT
           cl.shoplead_ip,
           cl.shop,
           COUNT(*)                      AS total_clicks,
           COUNT(DISTINCT cl.ip_address) AS unique_ips,
           a.title,
           a.slogan,
           a.chancing,
           p.product_name,
           p.price,
           p.m_img,
           s.shop_name
         FROM "click_logs" cl
         LEFT JOIN "Ads"     a ON a.product     = cl.shoplead_ip
         LEFT JOIN "Product" p ON p.product_id = a.product
         LEFT JOIN "Shop"    s ON s.shop_id    = cl.shop
         WHERE cl.clict_type = 'ads'
           AND cl.clicked_at >= DATE_TRUNC('month', NOW())
         GROUP BY cl.shoplead_ip, cl.shop, a.title, a.slogan, a.chancing,
                  p.product_name, p.price, p.m_img, s.shop_name
         ORDER BY total_clicks DESC`
      );
      rows = result.rows.map(r => ({
        shoplead_ip:  r.shoplead_ip,
        shop:         r.shop,
        total_clicks: r.total_clicks,
        unique_ips:   r.unique_ips,
        title:        r.title        ?? null,
        slogan:       r.slogan       ?? null,
        chancing:     r.chancing     ?? null,
        ads_status:   r.ads_status   ?? null,
        product_name: r.product_name ?? null,
        price:        r.price        ?? null,
        m_img:        r.m_img        ?? null,
        shop_name:    r.shop_name    ?? null,
      }));
    }

    return res.status(200).json({
      success:    true,
      clict_type,
      month:      new Date().toISOString().slice(0, 7),
      data:       rows,
    });

  } catch (err) {
    console.error('[getAdminClicks]', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};