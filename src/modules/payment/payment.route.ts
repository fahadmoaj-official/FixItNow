import {Router} from "express";
import { paymentController } from "./payment.controller";
const router = Router();

router.post("/create/", paymentController.createPayment);
router.post("/webhook", paymentController.handleStripeWebhook);
router.post("/confirm", paymentController.confirmPayment);
router.get("/", paymentController.getPayments);
router.get("/:paymentId", paymentController.getPaymentById);


export default router;