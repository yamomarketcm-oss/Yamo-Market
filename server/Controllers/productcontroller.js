import db from '../db.js';  // Assuming you are using a db module for your PostgreSQL queries
import { v4 as uuidv4 } from 'uuid';

export const createProduct = async (req, res) => {

  try {
    const { product_name, desc, price, shop, m_img, img, tag, category, status  } = req.body;

    // Check if player_id exists in the Player table (i.e., foreign key validation)
    const shopCheck = await db.query('SELECT shop_id FROM "Shop" WHERE shop_id = $1', [shop]);
    
    if (shopCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Shop not found' });
    }

    const productCheck = await db.query(
    'SELECT product_name FROM "Product" WHERE product_name = $1',
     [product_name]
    );

    if (productCheck.rowCount > 0) {
      return res.status(400).json({ error: 'Product Already Exist' });
    }

    const created_at = new Date();

    // Insert the new player into the Player table
    const result = await db.query(
      'INSERT INTO "Product" (product_name, "desc", price, shop, m_img, img, tag, category, status, created_at ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [product_name, desc, price, shop, m_img, img, tag, category, status, created_at]
    );
    
    const newProduct = result.rows[0];  // Assuming `result.rows` contains the inserted product

    res.status(201).json(newProduct);  // Respond with the newly created product
  } catch (error) {
    console.error(error)
  }
};

export const getsProductId = async (req, res) => {

  const { product_id } = req.params;

  try {
    // 1. Query the database to get the scorer with team details
    const result = await db.query(`
    SELECT p.product_id, p.product_name, p."desc", p.price, p.shop, p.m_img, p.img, p.tag, p.category AS product_category, p.created_at, p.status,
      s.shop_name, s.b_email, s.b_phone, s.bio, s.category AS shop_category, s.profile, s.town, s.region, s.address
      FROM "Product" p
      LEFT JOIN "Shop" s ON p.shop = s.shop_id 
      WHERE product_id = $1
    `, [product_id]);

    // 2. If no scorer is found, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 3. Respond with the scorer data along with the player details
    res.json(result.rows[0]);
  } catch (error) {
    // Error handling
    console.error('Error retrieving product:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const getsProductShopId = async (req, res) => {

  const { shop_id } = req.params;

  try {
    // 1. Query the database to get the scorer with team details
    const result = await db.query(`
      SELECT product_id, product_name, "desc", price, shop, m_img, img, tag, category, created_at, status
      FROM "Product" 
      WHERE shop = $1
    `, [shop_id]);

    const sum = await db.query('SELECT COUNT(*) FROM "Product"');
    const total = sum.rows[0].count;

    // 2. Check if any products are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No Products found' });
    }

    const data = result.rows;

    res.json({ total, data });
  } catch (error) {
    // Error handling
    console.error('Error retrieving product:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const getAllProducts = async (req, res) => {
  try {
    // 1. Query the database to get all products
    const result = await db.query(`
      SELECT p.product_id, p.product_name, p."desc", p.price, p.shop, p.m_img, p.img, p.tag, p.category AS product_category, p.created_at, p.status,
      s.shop_name, s.b_email, s.b_phone, s.bio, s.category AS shop_category, s.profile, s.town, s.region, s.address
      FROM "Product" p
      LEFT JOIN "Shop" s ON p.shop = s.shop_id
      ORDER BY p.product_id DESC
    `);

    const sum = await db.query('SELECT COUNT(*) FROM "Product"');
    const total = sum.rows[0].count;

    // 2. Check if any products are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No Products found' });
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


export const updateProduct = async (req, res) => {

  const { product_id } = req.params;

  const { product_name, desc, price, shop, m_img, img, tag, category, status } = req.body;

  try {
    // 1. First, check if the product_id exists in the product table
    const productResult = await db.query('SELECT * FROM "Product" WHERE product_id = $1', [product_id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const shopResult = await db.query(`SELECT * FROM "Shop" WHERE shop_id = $1`, [shop])
    
    if (shopResult.rows.length === 0) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // 3. Update the product details
    const updateQuery = `
      UPDATE "Product"
      SET product_name = $2, "desc" = $3, price = $4, shop = $5, m_img = $6, img = $7, tag = $8, category = $9, status = $10
      WHERE product_id = $1
      RETURNING *;
    `;
    const updatedProduct = await db.query(updateQuery, [
      product_id,
      product_name,
      desc,
      price,
      shop,
      m_img,
      img,
      tag,
      category,
      status
    ]);

    // 4. Respond with the updated product data
    res.json(updatedProduct.rows[0]);
  } catch (error) {
    // Error handling
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const deleteProduct = async (req, res) => {
  
  const { shop_id } = req.params;
  const { product_id } = req.params;

  try {
    // Check if the product exists
    const productResult = await db.query('SELECT * FROM "Product" WHERE product_id = $1', [product_id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult.rows[0]

    const shopCheck = await db.query(`SELECT * FROM "Shop" WHERE shop_id = $1`, [product.shop])
    if (!shopCheck) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const shopResult = await db.query('SELECT * FROM "Product" WHERE shop = $1', [shop_id]);
    if (shopResult.rows.length === 0) {
      return res.status(404).json({ message: 'Shop not authorize' });
    }

    // Delete the product from the database
    const deleteResult = await db.query('DELETE FROM "Product" WHERE product_id = $1 RETURNING *', [product_id]);

    // Check if the deletion was successful (returning deleted product)
    if (deleteResult.rows.length === 0) {
      return res.status(500).json({ message: 'Failed to delete product' });
    }

    // Respond with a success message
    res.json({ message: 'Product deleted successfully', product: product_id });
  } catch (error) {
    // Error handling
    console.error('Error deleting product:', error.message);
    res.status(500).json({ error: error.message });
  }
}  // Assuming you are using a db module for your PostgreSQL queries