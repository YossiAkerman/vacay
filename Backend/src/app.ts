import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import vacationRoutes from "./routes/vacation.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/images', express.static("public/images"));

export default app;
