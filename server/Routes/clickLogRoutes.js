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
router.get('/shop/:shop_id',           requireAuth, getShopClicks);
router.get('/product/:product_id',     requireAuth, getProductClicks);
router.get('/ads/:ads_id',             requireAuth, getAdsClicks);

/* ── ADMIN ── */
router.get('/admin',                   requireAuth, getAdminClicks);

export default router;
