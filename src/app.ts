import cookieParser from "cookie-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import env from "./config/env";
import AuthRoute from "./modules/Auth/Auth.route";
import ServiceRoute from "./modules/Services/Services.route";
import CategoriesRoute from "./modules/categories/categories.route";
import ApplicationsRoute from "./modules/Applications/Applications.route";
import TechniciansRoute from "./modules/technicians/technicians.route";
import ReviewRoute from "./modules/review/review.route";
const app = express();

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
app.use("/api/applications", ApplicationsRoute);
app.use("/api/technicians", TechniciansRoute);
app.use("/api/reviews", ReviewRoute);


export default app;
