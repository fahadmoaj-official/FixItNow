import {Router} from "express";
import { techniciansController } from "./technicians.controller";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();


router.patch("/profile",isAuthinticated(UserRole.TECHNICIAN), techniciansController.UpdateTechnicianProfile)

router.get("/",techniciansController.GetAllTechnicians)


// router.get("/:id", techniciansController.GetTechnicianById)
router.put("/availability",isAuthinticated(UserRole.TECHNICIAN), techniciansController.UpdateTechnicianAvailability)

router.get("/bookings",isAuthinticated(UserRole.TECHNICIAN), techniciansController.GetTechnicianBookings)

router.patch("/bookings/:bookingId",isAuthinticated(UserRole.TECHNICIAN), techniciansController.UpdateTechnicianBookingStatus)

export default router;