import { Router } from 'express';
import {
  logClick,
  getShopClicks,
  getProductClicks,
  getAdsClicks,
  getAdminClicks,
} from '../Controllers/clickLogController.js';
import { requireAdmin, requireAuth } from "../middleware.js"

const router = Router();

/* ── PUBLIC ── */
router.post('/click-log',                    logClick);

/* ── SELLER ── */
router.get('/click/shop/:shop_id',           requireAuth, getShopClicks);
router.get('/click/product/:product_id',     requireAuth, getProductClicks);
router.get('/click/ads/:ads_id',             requireAuth, getAdsClicks);

/* ── ADMIN ── */
router.get('/click/admin',                   requireAuth, getAdminClicks);

export default router;