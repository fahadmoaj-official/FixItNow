import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
dotenv.config();

 const env = {
    APP_URL: process.env.APP_URL!,
    PORT: process.env.PORT!,
    DATABASE_URL: process.env.DATABASE_URL!,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN!  as SignOptions["expiresIn"],

    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN! as SignOptions["expiresIn"],

    NODE_ENV: process.env.NODE_ENV!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
};

export default env;
