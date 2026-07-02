import pkg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pkg

dotenv.config()

const db = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'tweet',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'Market'
  });
 
  async function testConnection() {
    try {
      const client = await db.connect();
      console.log('Connected to PostgreSQL API database successfully !!!');
      client.release();
    } catch (err) {
      console.error('Error connecting to the database:', err.stack);
    }
  }
  
  testConnection();

export default db;