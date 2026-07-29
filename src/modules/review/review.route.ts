import {Router} from "express";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/client";
import { ReviewController } from "./review.controller";

const router = Router();

router.post("/",isAuthinticated(UserRole.CUSTOMER,UserRole.ADMIN),ReviewController.createReview);

export default router;