import express from "express"
import type {Response,Request } from "express" 
import env from "./config/env"
import cors from "cors"
import cookieParser from "cookie-parser"
import AuthRoute from "./modules/Auth/Auth.route"

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use(cors({
    origin: env.APP_URL,
    credentials: true,
}))

app.get("/",(req: Request, res: Response) => {
    res.send("Hello World");
});


app.use("/api/auth", AuthRoute)


export default app;