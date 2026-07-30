import {Router} from "express";
import { techniciansController } from "./technicians.controller";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();


router.patch("/profile",isAuthinticated(UserRole.TECHNICIAN), techniciansController.UpdateTechnicianProfile)

router.get("/",techniciansController.GetAllTechnicians)


router.put("/availability",isAuthinticated(UserRole.TECHNICIAN), techniciansController.UpdateTechnicianAvailability)

// get all pending bookings for current technician
router.get("/bookings",isAuthinticated(UserRole.TECHNICIAN),techniciansController.GetAllBookingsforTechnician);


router.get("/:id", techniciansController.GetTechnicianById)

export default router;