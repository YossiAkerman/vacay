import { getConnection } from "../config/db";
import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  token: string | null;
  token_expire: Date | null;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const conn = await getConnection();
  const [rows] = await conn.query<User[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const createUser = async (
    first_name: string,
    last_name: string,
    email: string,
    hashedPassword: string,
    role: "user" | "admin" = "user"
  ) => {
    try {
      const conn = await getConnection();
      console.log("Creating user:", { first_name, last_name, email });
  
      const [result] = await conn.query(
        `INSERT INTO users (first_name, last_name, email, password, role)
         VALUES (?, ?, ?, ?, ?)`,
        [first_name, last_name, email, hashedPassword, role]
      );
      return result;
    } catch (error) {
      console.error("❌ Error in createUser:", error);
      throw error;
    }
  };

export const updateUserToken = async (
  email: string,
  token: string | null,
  tokenExpire: Date | null
) => {
  try {
    const conn = await getConnection();
    const [result] = await conn.query(
      `UPDATE users 
       SET token = ?, token_expire = ?
       WHERE email = ?`,
      [token, tokenExpire, email]
    );
    return result;
  } catch (error) {
    console.error("❌ Error in updateUserToken:", error);
    throw error;
  }
};
  