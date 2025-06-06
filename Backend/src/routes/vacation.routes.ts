import { Router } from "express";
import { verifyToken, requireAdmin } from "../middlewares/auth.middleware";
import { getConnection } from "../config/db";
import { RowDataPacket } from "mysql2";

const router = Router();

// GET /api/vacations - fetch vacations + follow state
router.get("/", verifyToken, async (req: any, res) => {
  const userId = req.user.id;

  try {
    const conn = await getConnection();
    const [rows] = await conn.query(
      `
      SELECT v.*, 
        EXISTS (
          SELECT 1 FROM followers f 
          WHERE f.vacation_id = v.vacation_id AND f.user_id = ?
        ) AS isFollowed
      FROM vacations v
      ORDER BY v.start_date ASC
      `,
      [userId]
    );
    conn.release();

    if (!Array.isArray(rows)) {
      console.error("❌ rows is not an array:", rows);
      return res.status(500).json({ message: "Invalid data from database." });
    }

    const mappedRows = rows.map((vacation: any) => ({
      ...vacation,
      isFollowed: Boolean(vacation.isFollowed),
    }));

    res.json(mappedRows);
  } catch (error) {
    console.error("❌ Error fetching vacations:", error);
    res.status(500).json({ message: "Failed to fetch vacations." });
  }
});

// POST /api/vacations/add - admin only
router.post("/add", verifyToken, requireAdmin, async (req, res) => {
  const { destination, description, start_date, end_date, price, image } = req.body;

  if (!destination || !description || !start_date || !end_date || !price || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const conn = await getConnection();
    const [result] = await conn.query(
      `INSERT INTO vacations (destination, description, start_date, end_date, price, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [destination, description, start_date, end_date, price, image]
    );
    conn.release();
    res.status(201).json({
      message: "Vacation added successfully!",
      vacation_id: (result as any).insertId
    });
  } catch (error) {
    console.error("❌ Error adding vacation:", error);
    res.status(500).json({ message: "Failed to add vacation." });
  }
});

// DELETE /api/vacations/:id - admin only
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  const vacationId = req.params.id;
  try {
    const conn = await getConnection();
    await conn.query("DELETE FROM vacations WHERE vacation_id = ?", [vacationId]);
    conn.release();
    res.json({ message: "Vacation deleted" });
  } catch (error) {
    console.error("❌ Delete failed:", error);
    res.status(500).json({ message: "Failed to delete vacation" });
  }
});

// PUT /api/vacations/:id - admin only (Edit vacation)
router.put("/:id", verifyToken, requireAdmin, async (req, res) => {
  const vacationId = req.params.id;
  const { destination, description, start_date, end_date, price, image } = req.body;

  if (!destination || !description || !start_date || !end_date || !price || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const conn = await getConnection();
    await conn.query(
      `UPDATE vacations SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image = ? 
       WHERE vacation_id = ?`,
      [destination, description, start_date, end_date, price, image, vacationId]
    );
    conn.release();
    res.json({ message: "Vacation updated successfully!" });
  } catch (error) {
    console.error("❌ Update failed:", error);
    res.status(500).json({ message: "Failed to update vacation" });
  }
});

// POST /api/vacations/:id/follow
router.post("/:id/follow", verifyToken, async (req: any, res) => {
  const vacationId = parseInt(req.params.id, 10);
  const userId = req.user?.id;

  if (!userId || !vacationId) {
    return res.status(400).json({ message: "Missing user or vacation" });
  }

  try {
    const conn = await getConnection();

    // Check if vacation exists
    const [vacationCheck] = await conn.query(
      "SELECT vacation_id FROM vacations WHERE vacation_id = ?",
      [vacationId]
    );

    if ((vacationCheck as any[]).length === 0) {
      conn.release();
      return res.status(404).json({ message: "Vacation not found" });
    }

    await conn.query(
      "INSERT IGNORE INTO followers (user_id, vacation_id) VALUES (?, ?)",
      [userId, vacationId]
    );
    conn.release();

    res.json({ followed: true, vacationId });
  } catch (error) {
    console.error("❌ Follow failed:", error);
    res.status(500).json({ message: "Failed to follow vacation" });
  }
});

// DELETE /api/vacations/:id/follow
router.delete("/:id/follow", verifyToken, async (req: any, res) => {
  const vacationId = parseInt(req.params.id, 10);
  const userId = req.user?.id;

  if (!userId || !vacationId) {
    return res.status(400).json({ message: "Missing user or vacation" });
  }

  try {
    const conn = await getConnection();
    await conn.query(
      "DELETE FROM followers WHERE user_id = ? AND vacation_id = ?",
      [userId, vacationId]
    );
    conn.release();
    res.json({ unfollowed: true, vacationId });
  } catch (error) {
    console.error("❌ Unfollow failed:", error);
    res.status(500).json({ message: "Failed to unfollow vacation" });
  }
});


// GET /api/vacations/stats - Admin only
router.get("/stats", verifyToken, requireAdmin, async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT destination, COUNT(f.user_id) AS followerCount
      FROM vacations v
      LEFT JOIN followers f ON v.vacation_id = f.vacation_id
      GROUP BY v.destination
    `);
    conn.release();

    res.json(rows);
  } catch (error) {
    console.error("❌ Failed to fetch dashboard stats:", error);
    res.status(500).json({ message: "Failed to load dashboard stats." });
  }
});

// GET /api/vacations/:id/stats - Get vacation statistics
router.get("/:id/stats", verifyToken, requireAdmin, async (req, res) => {
  const vacationId = req.params.id;
  try {
    const conn = await getConnection();
    
    // Get follower count
    const [followerResult] = await conn.query<RowDataPacket[]>(
      "SELECT COUNT(*) as followerCount FROM followers WHERE vacation_id = ?",
      [vacationId]
    );
    
    // Get total bookings
    const [bookingResult] = await conn.query<RowDataPacket[]>(
      "SELECT COUNT(*) as totalBookings FROM bookings WHERE vacation_id = ?",
      [vacationId]
    );
    
    // Get average rating
    const [ratingResult] = await conn.query<RowDataPacket[]>(
      "SELECT AVG(rating) as averageRating FROM ratings WHERE vacation_id = ?",
      [vacationId]
    );
    
    // Get monthly followers data
    const [monthlyFollowers] = await conn.query<RowDataPacket[]>(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM followers 
      WHERE vacation_id = ?
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC`,
      [vacationId]
    );

    conn.release();

    res.json({
      followerCount: Number(followerResult[0].followerCount),
      totalBookings: Number(bookingResult[0].totalBookings),
      averageRating: Number(ratingResult[0].averageRating) || 0,
      monthlyFollowers: monthlyFollowers
    });
  } catch (error) {
    console.error("❌ Failed to get vacation stats:", error);
    res.status(500).json({ message: "Failed to get vacation statistics" });
  }
});

export default router;
