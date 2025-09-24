import { Router} from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post('/login', login);
router.post('/register',register);
router.get('/profile',authenticateToken, getProfile);


export default router;