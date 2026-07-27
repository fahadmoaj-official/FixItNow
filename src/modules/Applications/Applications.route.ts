import { Router } from "express";
import { ApplicationsController } from "./Applications.controller";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";



const router = Router();
 
// Technician applies to a service (job posting)
router.post("/",isAuthinticated(UserRole.TECHNICIAN), ApplicationsController.applyToService);
 
// Customer views all applicants for one of their services
router.get("/service/:serviceId", isAuthinticated(UserRole.CUSTOMER,UserRole.ADMIN), ApplicationsController.getApplicationsForService);
 

// Technician views their own applications
router.get("/me", isAuthinticated(UserRole.TECHNICIAN), ApplicationsController.getApplicationsForTechnician);
 

 
export default router;