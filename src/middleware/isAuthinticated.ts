import type{ Request, Response, NextFunction } from "express";
import env from "../config/env";
import { verifyToken } from "../utils/Token";
import prisma from "../lib/prisma";
import { UserRole, UserStatus } from "../../generated/prisma/client";


declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: UserRole;
      };
    }
  }
}


const isAuthinticated = (...RequiredRoles: UserRole[]) => 
    async (req: Request, res: Response, next: NextFunction) => {

        try{

            const Token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

            if(!Token){
                return next(new Error("Access token is missing. Please log in."));
            }

            const decoded = verifyToken(Token, env.JWT_ACCESS_SECRET);

            if(!decoded){
                return next(new Error("Invalid access token. Please log in again."));
            }

            
            const { userId, email, role } = decoded;

            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                }
            });

            if(user?.status === UserStatus.BANNED){
                return next(new Error("Your account is BLOCKED. Please contact support."));
            }

            if(!user){
                return next(new Error("User not found. Please log in again."));
            }

            req.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
            next();
        }catch(error){
           return next(new Error("Invalid access token. Please log in again."));
        }
      

    }

export default isAuthinticated;