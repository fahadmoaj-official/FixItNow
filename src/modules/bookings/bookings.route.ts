import {Router} from "express";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/client";
import { BookingsController } from "./bookings.controller";
const router = Router();


router.post("/",isAuthinticated(UserRole.CUSTOMER,UserRole.ADMIN),BookingsController.CreateBooking);

router.get("/",isAuthinticated(UserRole.CUSTOMER,UserRole.ADMIN),BookingsController.GetAllBookings);

router.get("/:id",isAuthinticated(UserRole.CUSTOMER,UserRole.ADMIN),BookingsController.GetBookingDetailsById);



export default router;