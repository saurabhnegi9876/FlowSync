import { Router } from "express";
import {register, logging} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", register);
router.post("/login", logging);
export default router;