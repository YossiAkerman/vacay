// src/config/db.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool: mysql.Pool;

export const connectDB = () => {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("✅ Connected to MySQL via Pool");
};

export const getConnection = async () => {
  if (!pool) {
    throw new Error("Database connection not initialized. Call connectDB() first.");
  }
  return pool.getConnection();
};

export default {
  connectDB,
  getConnection
};
