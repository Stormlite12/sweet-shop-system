import { Router} from "express";
import { registration } from "../controllers/authController.js";


const router = Router();

router.post('/register',registration);


export default router;