import cookieParser from "cookie-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import env from "./config/env";
import AdminRoute from "./modules/Admin/Admin.route";
import AuthRoute from "./modules/Auth/Auth.route";
import ServiceRoute from "./modules/Services/Services.route";
import BookingsRoute from "./modules/bookings/bookings.route";
import CategoriesRoute from "./modules/categories/categories.route";
import PaymentRoute from "./modules/payment/payment.route";
import ReviewRoute from "./modules/review/review.route";
import TechniciansRoute from "./modules/technicians/technicians.route";

const app = express();

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: env.APP_URL,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/auth", AuthRoute);
app.use("/api/services", ServiceRoute);
app.use("/api/categories", CategoriesRoute);
app.use("/api/technicians", TechniciansRoute);
app.use("/api/reviews", ReviewRoute);
app.use("/api/bookings", BookingsRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/payments", PaymentRoute);

export default app;
