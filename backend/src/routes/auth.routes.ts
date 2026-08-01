import { Router } from "express";
import Login from "../controllers/login";
import Register from "../controllers/signup";
const router = Router();

router.post("/signup", Register);
router.post("/login", Login);
export default router;