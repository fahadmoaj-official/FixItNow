import {Router} from "express";
import { AdminController } from "./Admin.controller";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();


router.get("/users",isAuthinticated(UserRole.ADMIN), AdminController.getAllUsers)
router.patch("/users/:userId", isAuthinticated(UserRole.ADMIN), AdminController.updateUserStatus)

router.get("/bookings", isAuthinticated(UserRole.ADMIN), AdminController.getAllBookings)

router.get("/categories", isAuthinticated(UserRole.ADMIN), AdminController.getAllCategories)
router.post("/categories", isAuthinticated(UserRole.ADMIN), AdminController.createCategory)

export default router;  