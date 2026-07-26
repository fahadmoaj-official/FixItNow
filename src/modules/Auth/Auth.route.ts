import {Router} from 'express';
import { AuthController } from './Auth.controller';
import isAuthinticated from '../../middleware/isAuthinticated';
import { UserRole } from '../../../generated/prisma/client';
const router = Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.get('/me', isAuthinticated(UserRole.CUSTOMER,UserRole.TECHNICIAN,UserRole.ADMIN), AuthController.getMe);


export default router;