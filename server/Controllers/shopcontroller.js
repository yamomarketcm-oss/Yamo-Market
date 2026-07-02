import db from '../db.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';

export const createShop = async (req, res, next) => {

    try {
        const { shop_name, b_email, license_num, b_phone, bio, category, profile, region, town, address } = req.body;

        const user = req.user.user_id;

        const created_at = new Date();

        const baseSlug = shop_name
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");

            let slug = baseSlug;
            let counter = 1;

            while (true) {
              const { rowCount } = await db.query(
                'SELECT 1 FROM "Shop" WHERE shop_slug = $1',
                [slug]
              );

              if (rowCount === 0) break;

              slug = `${baseSlug}-${counter}`;
              counter++;
        }

            // Validate input
        if (!shop_name || !b_email || !license_num || !b_phone || !bio || !address || !category || !profile || !region || !town || !created_at) {
          return res.status(400).json({ message: 'All fields are required' });
        }

        const userCheck = await db.query(
          'SELECT user_id FROM "User" WHERE user_id = $1',
          [user]
        );

        if (userCheck.rowCount === 0) {
          return res.status(400).json({ error: 'User not found' });
        }

        const user2Check = await db.query(
          'SELECT "user" FROM "Shop" WHERE "user" = $1',
          [user]
        );

        if (user2Check.rowCount > 0) {
          return res.status(400).json({ message: 'User already owns a shop' });
        }
        
        const result = await db.query(
          'INSERT INTO "Shop" (shop_slug, shop_name, b_email, license_num, b_phone, bio, category, profile, "user", region, town, address, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
          [slug, shop_name, b_email, license_num, b_phone, bio, category, profile, user, region, town, address, created_at]
        );
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  };

export const ShopOwn = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT shop_id, shop_name, b_email, license_num, b_phone, bio, category, profile, "user", town, address, created_at FROM "Shop" WHERE "user" = $1',
      [req.user.user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getShop = async ( req, res) => {
  try {
    // 1. Query the database to get all users
    const result = await db.query(`
      SELECT s.shop_id, s.shop_slug, s.shop_name, s.b_email, s.license_num, s.b_phone, s.bio, s.category, s.profile, s."user", s.region, s.town, s.address, s.created_at, s.worth,
      u.username, u.email, u.phone, u.status
      FROM "Shop" s
      LEFT JOIN "User" u ON s."user" = u.user_id
    `);

     const sum = await db.query('SELECT COUNT(*) FROM "Shop"');
     const total = sum.rows[0].count;
  
      // 2. If no player is found, return a 404 response
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Shop not found' });
      }

      const data = result.rows;

      res.json({ data, total });
     // 3. Respond with all users
  } catch (error) {
    // Error handling
    console.error('Error retrieving shops:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const getShopid = async (req, res) => {

  const { shop_id } = req.params;

  try {
    // 1. Query the database to get the player with team details
    const result = await db.query(`
      SELECT s.shop_id, s.shop_slug, s.shop_name, s.b_email, s.license_num, s.b_phone, s.bio, s.category, s.profile, s."user", s.region, s.town, s.address, s.created_at, s.worth,
      u.username, u.email, u.phone, u.status
      FROM "Shop" s
      LEFT JOIN "User" u ON s."user" = u.user_id
      WHERE s.shop_id = $1
    `, [shop_id]);

    // 2. If no player is found, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // 3. Respond with the player data along with the team details
    res.json(result.rows[0]);
  } catch (error) {
    // Error handling
    console.error('Error retrieving Shop:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const getShopSlug = async (req, res) => {

  const { slug } = req.params;

  try {
    // 1. Query the database to get the player with team details
    const result = await db.query(`
      SELECT s.shop_id, s.shop_slug, s.shop_name, s.b_email, s.license_num, s.b_phone, s.bio, s.category, s.profile, s."user", s.region, s.town, s.address, s.created_at, s.worth,
      u.username, u.email, u.phone, u.status
      FROM "Shop" s
      LEFT JOIN "User" u ON s."user" = u.user_id
      WHERE s.shop_slug = $1
    `, [slug]);

    // 2. If no player is found, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // 3. Respond with the player data along with the team details
    res.json(result.rows[0]);
  } catch (error) {
    // Error handling
    console.error('Error retrieving Shop:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const updateShop = async (req, res) => {

  const { shop_id } = req.params;

  const { shop_name, b_email, license_num, b_phone, bio, category, profile, user, town, address, worth } = req.body;

    const baseSlug = shop_name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      let slug = baseSlug;
      let counter = 1;

      while (true) {
        const { rowCount } = await db.query(
          `SELECT 1
          FROM "Shop"
          WHERE shop_slug = $1
            AND shop_id <> $2`,
          [slug, shop_id] // shopId is the shop being updated
        );

        if (rowCount === 0) break;

        slug = `${baseSlug}-${counter}`;
        counter++;
    }

  try {

    // 2. Check if the player exists in the player table
    const shopResult = await db.query('SELECT * FROM "Shop" WHERE shop_id = $1', [shop_id]);
    if (shopResult.rows.length === 0) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    // 3. Update the player details
    const updateQuery = `
      UPDATE "Shop"
      SET shop_name = $2, b_email = $3, license_num = $4, b_phone = $5, bio = $6, category = $7, profile = $8, user = $9, town = $10, address = $11, worth = $12, shop_slug = $13
      WHERE shop_id = $1
      RETURNING *;
    `;
    const updatedShop = await db.query(updateQuery, [
      shop_id,
      shop_name,
      b_email,
      license_num,
      b_phone,
      bio,
      category,
      profile,
      user,
      town,
      address,
      worth,
      slug
    ]);

    // 4. Respond with the updated player data
    res.json(updatedShop.rows[0]);
  } catch (error) {
    // Error handling
    console.error('Error updating Shop:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const deleteShop = async (req, res) => {

  const { shop_id } = req.params;

  try {
    // Check if the player exists
    const shopResult = await db.query('SELECT * FROM "Shop" WHERE shop_id = $1', [shop_id]);
    
    if (shopResult.rows.length === 0) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const deleteResult = await db.query('DELETE FROM "Shop" WHERE shop_id = $1 RETURNING *', [shop_id]);

    // Check if the deletion was successful (returning deleted player)
    if (deleteResult.rowCount === 0) {
      return res.status(500).json({ message: 'Failed to delete shop' });
    }

    // Respond with a success message
    res.json({ message: 'shop deleted successfully', shop: shop_id });
  } catch (error) {
    // Error handling
    console.error('Error deleting shop:', error.message);
    res.status(500).json({ error: error.message });
  }
}