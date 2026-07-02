import pkg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pkg

dotenv.config()

const db = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oISRkA7H0sKu@ep-steep-hall-ai96tbv5-pooler.c-4.us-east-1.aws.neon.tech/Yamo%20Market?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});
 
  async function testConnection() {
    try {
      const client = await db.connect();
      console.log('Connected to Neon PostgreSQL Successfully !!!');
      client.release();
    } catch (err) {
      console.error('Error connecting to the database:', err.stack);
    }
  }
  
  testConnection();

export default db;
