import {Router} from "express";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/client";
import { BookingsController } from "./bookings.controller";
const router = Router();


router.post("/",isAuthinticated(UserRole.CUSTOMER),BookingsController.CreateBooking);



router.patch("/:bookingId/accept",isAuthinticated(UserRole.TECHNICIAN),BookingsController.UpdateBookingStatusToAccept);

router.patch("/:bookingId/start",isAuthinticated(UserRole.TECHNICIAN),BookingsController.UpdateBookingStatusToStarted);

router.patch("/:bookingId/cancel",isAuthinticated(UserRole.TECHNICIAN),BookingsController.UpdateBookingStatusToRejected);

router.patch("/:bookingId/complete",isAuthinticated(UserRole.TECHNICIAN),BookingsController.UpdateBookingStatusToCompleted);




router.get("/:bookingId",isAuthinticated(UserRole.TECHNICIAN),BookingsController.GetBookingDetailsById);



export default router;