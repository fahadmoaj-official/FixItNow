import {Router} from "express";
import { paymentController } from "./payment.controller";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();

router.post("/create/",isAuthinticated(UserRole.CUSTOMER) ,paymentController.createPayment);
router.post("/webhook", paymentController.handleStripeWebhook);
router.post("/confirm", isAuthinticated(UserRole.CUSTOMER), paymentController.confirmPayment);
router.get("/", isAuthinticated(UserRole.CUSTOMER), paymentController.getPayments);
router.get("/:paymentId", isAuthinticated(UserRole.CUSTOMER), paymentController.getPaymentById);


export default router;