import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number; // ✅ renamed from user_id
    role: "user" | "admin";
  };
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      user_id: number;
      role: "user" | "admin";
    };

    // ✅ Normalize key to match expected req.user.id
    req.user = {
      id: decoded.user_id,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only." });
  }
  next();
};
