import dotenv from "dotenv";
dotenv.config();

 const env = {
    APP_URL: process.env.APP_URL!,
    PORT: process.env.PORT!,
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
};

export default env;
