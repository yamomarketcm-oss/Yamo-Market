import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import pkg from 'pg'
import userRoute from './Routes/user_route.js'
import ShopRoute from './Routes/shop_route.js'
import ProductRoute from './Routes/product_route.js'
import AdRoute from './Routes/ads_route.js'

const { Pool } = pkg

 dotenv.config()

const app = express()

const pool = new Pool({
   user: process.env.DB_USER || 'postgres',
   password: process.env.DB_PASSWORD || 'tweet',
   host: process.env.DB_HOST || 'localhost',
   port: process.env.DB_PORT || 5432,
   database: process.env.DB_NAME || 'Transit'
 });

 async function testConnection() {
   try {
     const client = await pool.connect();
     client.release();
   } catch (err) {
     console.error('Error connecting to the database:', err.stack);
   }
 }
 
 testConnection();

   app.use(express.json())
   app.use(cookieParser())
   app.use(cors())

   app.get('/', (req, res) => {
      res.send('server running....!!!');
    });

app.listen(5050, () => {
    console.log("Server is on run......!!!")
})

app.use('/api/market', userRoute, ProductRoute, ShopRoute, AdRoute)