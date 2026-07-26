import { Router } from "express";
import { ServicesController } from "./Services.controller";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();

router.post("/create",isAuthinticated(UserRole.ADMIN,UserRole.CUSTOMER), ServicesController.CreateAServices);


router.get("/", ServicesController.GetAllServices);






export default router;
