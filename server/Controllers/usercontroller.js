import db from '../db.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const createuser = async (req, res, next) => {

    try {
        const { username, email, phone, password, created_at } = req.body;

            // Validate input
        if (!username || !email || !phone || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        const result = await db.query(
          'INSERT INTO "User" (username, email, phone, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [username, email, phone, hashedPassword, created_at]
        );
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Query the database for the user
    const query = 'SELECT * FROM "User" WHERE email = $1';

    const result = await db.query(query, [email]);
    
    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id,email: user.email, username: user.username, isAdmin: user.isAdmin, phone: user.phone },
       process.env.JWT_SECRET
    );
    
    // Return success with token
    return res.status(200).json({
      message: 'Authentication successful',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        phone: user.phone,
        status: user.status,
        photo: user.photo
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const getuser = async ( req, res) => {
  try {
    // 1. Query the database to get all users
    const result = await db.query(`
      SELECT user_id, username, email, phone, "isAdmin", id_front, id_back, photo, review, status, created_at 
      FROM "User"
    `);

    // 2. Check if any users are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No players found' });
    }

   const sum = await db.query('SELECT COUNT(*) FROM "User"');
    const total = sum.rows[0].count;

    // 2. Check if any products are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No Ads found' });
    }

    const data = result.rows;

    // 3. Respond with all products
    res.json({ total, data });
    // 3. Respond with all users
  } catch (error) {
    // Error handling
    console.error('Error retrieving users:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const getuserid = async (req, res) => {

  const { user_id } = req.params;

  try {
    // 1. Query the database to get the player with team details
    const result = await db.query(`
      SELECT user_id, username, email, phone, "isAdmin", id_num, id_front, id_back, photo,
      review, status, created_at
      WHERE user_id = $1
    `, [user_id]);

    // 2. If no player is found, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Respond with the player data along with the team details
    res.json(result.rows[0]);
  } catch (error) {
    // Error handling
    console.error('Error retrieving User:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const updateuser = async (req, res) => {

  const { user_id } = req.params;
  const { username, email, phone, isAdmin, id_front, id_back, photo, status, review } = req.body;

  try {

    // 2. Check if the player exists in the player table
    const userResult = await db.query('SELECT * FROM "User" WHERE user_id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }


    // 3. Update the player details
    const updateQuery = `
      UPDATE "User"
      SET username = $2, email = $3, phone = $4, id_front = $5, id_back = $6, photo = $7, status = $8, "isAdmin" = $9, review = $10
      WHERE user_id = $1
      RETURNING *;
    `;
    const updatedUser = await db.query(updateQuery, [
      user_id,
      username,
      email,
      phone,
      id_front,
      id_back,
      photo,
      status,
      isAdmin,
      review
    ]);

    // 4. Respond with the updated player data
    res.json(updatedUser.rows[0]);

  } catch (error) {
    // Error handling
    console.error('Error updating player:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const updatePassword = async (req, res) => {

  const { currentPassword, newPassword } = req.body;

  const user_id = req.user.user_id;

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  const result = await db.query(
    `Select password from "User" where user_id = $1`,
    [user_id]
  )

  const user = result.rows[0]

  const comparePassword = await bcryptjs.compare(currentPassword, user.password);

  if(!comparePassword) {
    return res.status(500).json({ message: "Password Doesnot Match" })
  }

  if(newPassword.length < 8 ) {
    return res.status(500).json({ message: "Password Must be 8 or more letters" })
  }

  if(newPassword === currentPassword) {
    return res.status(500).json({ message: "Same Password Please Change New Password" })
  }

  try {
    const updateQuery = `
      UPDATE "User"
      SET password = $2
      WHERE user_id = $1
      RETURNING *;
    `;
    const updatedUser = await db.query(updateQuery, [
      user_id,
      hashedPassword
    ]);

    res.status(200).json({ message: 'Password updated' })
  } catch (error) {
    console.error('Error updating password:', error.message);
    res.status(500).json({ error: error.message });
  }

}

export const deleteuser = async (req, res) => {

  const { user_id } = req.params;

  try {
    // Check if the player exists
    const userResult = await db.query('SELECT * FROM "User" WHERE user_id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'user not found' });
    }

    // Delete the player from the database
    const deleteResult = await db.query('DELETE FROM "User" WHERE user_id = $1 RETURNING *', [user_id]);

    // Check if the deletion was successful (returning deleted player)
    if (deleteResult.rows.length === 0) {
      return res.status(500).json({ message: 'Failed to delete user' });
    }

    // Respond with a success message
    res.json({ message: 'user deleted successfully', user_id: user_id });
  } catch (error) {
    // Error handling
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: error.message });
  }
}


export const profile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT user_id, username, email, phone, status, "isAdmin", review FROM "User" WHERE user_id = $1',
      [req.user.user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
