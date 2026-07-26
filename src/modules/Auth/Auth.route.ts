import {Router} from 'express';
import { AuthController } from './Auth.controller';
const router = Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.get('/me', AuthController.getMe);


export default router;