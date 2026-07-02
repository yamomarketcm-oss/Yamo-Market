import db from '../db.js';  // Assuming you are using a db module for your PostgreSQL queries
import { v4 as uuidv4 } from 'uuid';

export const createAds = async (req, res) => {

  try {
    const { product, title, slogan, chancing } = req.body;

    // Check if player_id exists in the Player table (i.e., foreign key validation)
    const productCheck = await db.query('SELECT product_id FROM "Product" WHERE product_id = $1', [product]);
    
    if (productCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Shop not found' });
    }

    const created_at = new Date();

    // Insert the new player into the Player table
    const result = await db.query(
      'INSERT INTO "Ads" (product, title, slogan, chancing, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [product, title, slogan, chancing, created_at]
    );
    
    const newAds = result.rows[0];  // Assuming `result.rows` contains the inserted product

    res.status(201).json(newAds);  // Respond with the newly created product
  } catch (error) {
    console.error(error)
  }
};

export const getsAdsId = async (req, res) => {

  const { ads_id } = req.params;

  try {
    // 1. Query the database to get the scorer with team details
    const result = await db.query(`
    SELECT a.ads_id, a.product, a.title, a.slogan, a.chancing, a.created_at, p.product_slug, p.product_name, p."desc", p.price, p.shop, p.m_img, p.img, p.tag, p.category AS product_category, p.status,
      s.shop_name, s.b_email, s.b_phone, s.bio, s.category AS shop_category, s.profile, s.town, s.region, s.address
      FROM "Ads" a
      LEFT JOIN "Product" p ON a.product = p.product_id
      LEFT JOIN "Shop" s ON p.shop = s.shop_id 
      WHERE product_id = $1
    `, [product_id]);

    // 2. If no scorer is found, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // 3. Respond with the scorer data along with the player details
    res.json(result.rows[0]);
  } catch (error) {
    // Error handling
    console.error('Error retrieving product:', error.message);
    res.status(500).json({ error: error.message });
  }
}


export const getAllAds = async (req, res) => {
  try {
    // 1. Query the database to get all products
    const result = await db.query(`
      SELECT a.ads_id, a.product, a.title, a.slogan, a.chancing, a.created_at, p.product_slug, p.product_name, p."desc", p.price, p.shop, p.m_img, p.img, p.tag, p.category AS product_category, p.status,
      s.shop_name, s.b_email, s.b_phone, s.bio, s.category AS shop_category, s.profile, s.town, s.region, s.address
      FROM "Ads" a
      LEFT JOIN "Product" p ON a.product = p.product_id
      LEFT JOIN "Shop" s ON p.shop = s.shop_id
      ORDER BY a.chancing DESC
    `);

    const sum = await db.query('SELECT COUNT(*) FROM "Ads"');
    const total = sum.rows[0].count;

    // 2. Check if any products are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No Ads found' });
    }

    const data = result.rows;

    // 3. Respond with all products
    res.json({ total, data });
  } catch (error) {
    // Error handling
    console.error('Error retrieving products:', error.message);
    res.status(500).json({ error: error.message });
  }
}


export const updateAds = async (req, res) => {

  const { ads_id } = req.params;

  const { product, title, slogan, chancing } = req.body;

  try {
    // 1. First, check if the product_id exists in the product table
    const productResult = await db.query('SELECT * FROM "Product" WHERE product_id = $1', [product]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const AdsResult = await db.query(`SELECT * FROM "Ads" WHERE ads_id = $1`, [ads_id])
    
    if (AdsResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ads not found' });
    }

    // 3. Update the product details
    const updateQuery = `
      UPDATE "Ads"
      SET product = $2, title = $3, slogan = $4, chancing = $5
      WHERE ads_id = $1
      RETURNING *;
    `;
    const updatedAds = await db.query(updateQuery, [
      ads_id,
      product,
      title,
      slogan,
      chancing
    ]);

    // 4. Respond with the updated product data
    res.json(updatedAds.rows[0]);
  } catch (error) {
    // Error handling
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const deleteAds = async (req, res) => {
  
  const { ads_id } = req.params;

  try {
    // Check if the product exists
    const AdsResult = await db.query('SELECT * FROM "Ads" WHERE ads_id = $1', [ads_id]);
    if (AdsResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Delete the product from the database
    const deleteResult = await db.query('DELETE FROM "Ads" WHERE ads_id = $1 RETURNING *', [ads_id]);

    // Check if the deletion was successful (returning deleted product)
    if (deleteResult.rows.length === 0) {
      return res.status(500).json({ message: 'Failed to delete product' });
    }

    // Respond with a success message
    res.json({ message: 'Ad deleted successfully', Ad: ads_id });
  } catch (error) {
    // Error handling
    console.error('Error deleting Ad:', error.message);
    res.status(500).json({ error: error.message });
  }
}  // Assuming you are using a db module for your PostgreSQL queries