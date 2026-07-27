import { Router } from "express";
import { ApplicationsController } from "./Applications.controller";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";



const router = Router();
 
// Technician applies to a service (job posting)
router.post("/",isAuthinticated(UserRole.TECHNICIAN), ApplicationsController.applyToService);
 
// Customer views all applicants own services
router.get("/service/:serviceId", isAuthinticated(UserRole.CUSTOMER,UserRole.ADMIN), ApplicationsController.getApplicationsForService);
 

// Technician views their own applications
router.get("/me", isAuthinticated(UserRole.TECHNICIAN), ApplicationsController.getApplicationsForTechnician);
 
// Customer accepts an applicant -> creates the Booking
router.patch("/accept", isAuthinticated(UserRole.CUSTOMER), ApplicationsController.acceptApplication);
 

// Customer rejects a single applicant
router.patch("/reject", isAuthinticated(UserRole.CUSTOMER), ApplicationsController.rejectApplication);
 

// Technician withdraws their own pending application
router.patch("/withdraw/:serviceId", isAuthinticated(UserRole.TECHNICIAN), ApplicationsController.withdrawApplication);
 
export default router;