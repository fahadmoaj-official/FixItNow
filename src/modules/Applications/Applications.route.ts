import { Router } from "express";
import { ApplicationsController } from "./Applications.controller";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";



const router = Router();
 
// Technician applies to a service (job posting)
router.post("/",isAuthinticated(UserRole.TECHNICIAN), ApplicationsController.applyToService);
 

 
export default router;