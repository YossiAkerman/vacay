import { Router } from "express";
import { getConnection } from "../config/db";
import { verifyToken, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/analytics/dashboard
router.get("/dashboard", verifyToken, requireAdmin, async (req, res) => {
  try {
    const conn = await getConnection();

    // ✅ Total vacations count
    const [totalRows] = await conn.query("SELECT COUNT(*) AS total FROM vacations");
    const total = (totalRows as any[])[0]?.total || 0;

    // ✅ Top 5 followed destinations
    const [followers] = await conn.query(`
      SELECT v.destination, COUNT(f.user_id) AS followers
      FROM vacations v
      LEFT JOIN followers f ON v.vacation_id = f.vacation_id
      GROUP BY v.destination
      ORDER BY followers DESC
      LIMIT 5
    `);

    // ✅ Price statistics
    const [priceStatsRows] = await conn.query(`
      SELECT MIN(price) AS min, MAX(price) AS max, AVG(price) AS avg FROM vacations
    `);
    const priceStats = (priceStatsRows as any[])[0] || { min: 0, max: 0, avg: 0 };

    // ✅ Recently added vacations
    const [recent] = await conn.query(`
      SELECT destination, start_date
      FROM vacations
      ORDER BY start_date DESC
      LIMIT 5
    `);

    conn.release();

    const response = {
      totalVacations: total,
      mostFollowed: followers,
      priceStats,
      recentVacations: recent
    };

    console.log("✅ Sending analytics data:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ Dashboard analytics error:", error);
    res.status(500).json({ message: "Failed to load analytics", error });
  }
});

export default router;
