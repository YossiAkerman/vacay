import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, updateUserToken } from "../models/user.model";
import { getConnection } from "../config/db";
import { User } from "../models/user.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(first_name, last_name, email, hashedPassword);

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error during registration." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const tokenExpire = new Date();
    tokenExpire.setMinutes(tokenExpire.getMinutes() + 1);

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1hr" }
    );

    try {
      await updateUserToken(email, token, tokenExpire);
    } catch (dbError) {
      console.error("Failed to store token:", dbError);
    }

    return res.json({ 
      token, 
      user: { 
        id: user.user_id, 
        name: user.first_name, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
};

export const tokenValidate = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { user_id: number, role: string, email: string };
    } catch (jwtError) {
      try {
        const conn = await getConnection();
        const [rows] = await conn.query<User[]>(
          "SELECT * FROM users WHERE token = ?",
          [token]
        );
        if (rows.length > 0) {
          await conn.query(
            `UPDATE users 
             SET token = NULL, token_expire = NULL
             WHERE token = ?`,
            [token]
          );
        }
      } catch (dbError) {
        console.error("Failed to clear expired token:", dbError);
      }
      return res.status(401).json({ message: "Token has expired" });
    }

    const conn = await getConnection();
    const [rows] = await conn.query<User[]>(
      "SELECT * FROM users WHERE user_id = ?",
      [decoded.user_id]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.token || !user.token_expire) {
      return res.status(401).json({ message: "Token not found or expired" });
    }

    const currentTime = new Date();
    const tokenExpireTime = new Date(user.token_expire);

    if (currentTime > tokenExpireTime) {
      try {
        await conn.query(
          `UPDATE users 
           SET token = NULL, token_expire = NULL
           WHERE email = ?`,
          [user.email]
        );
      } catch (dbError) {
        console.error("Failed to clear expired token:", dbError);
      }
      return res.status(401).json({ message: "Token has expired" });
    }

    const newTokenExpire = new Date();
    newTokenExpire.setMinutes(newTokenExpire.getMinutes() + 1);

    try {
      await conn.query(
        `UPDATE users 
         SET token = ?, token_expire = ?
         WHERE email = ?`,
        [token, newTokenExpire, user.email]
      );
    } catch (dbError) {
      console.error("Failed to update token expiration:", dbError);
    }

    return res.json({ 
      isValid: true, 
      user: { 
        id: user.user_id, 
        name: user.first_name, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error("Token validation error:", err);
    return res.status(500).json({ message: "Server error during token validation" });
  }
};