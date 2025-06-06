import { Router } from "express";
import { register, login, tokenValidate } from "../controllers/user.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/token-validate", tokenValidate);

export default router;
