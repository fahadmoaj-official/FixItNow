import prisma from "../../lib/prisma";
import { generateToken } from "../../utils/Token";
import env from "../../config/env";
import { RegisterUserPayload,LoginUserPayload } from "./Auth.interface";
import bcrypt from "bcryptjs";

const registerUserIntoDb = async (payload: RegisterUserPayload) => {

      const { name, email, password, role } = payload;

      const isUserExists = await prisma.user.findUnique({
            where: {
                  email: email
            }
      })

      if (isUserExists) {
            throw new Error("User already exists with this email");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

       if(role !=="CUSTOMER" && role !== "TECHNICIAN") {
            throw new Error("Invalid role. Role must be either 'CUSTOMER' or 'TECHNICIAN'");
      }

      const user = await prisma.user.create({
            data: {
                  name,
                  email,
                  password: hashedPassword,
                  role
            },
            omit: {
                password: true
            }
      })

      return user;

}


const loginUser = async (payload: LoginUserPayload) => {

      const { email, password } = payload;

      const user = await prisma.user.findUnique({
            where: {
                  email: email
            }
      })

      if (!user) {
            throw new Error("User not found with this email");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
            throw new Error("Invalid credentials. Please check your email and password. for development: ( password is incorrect)");
      }

      const jwtPayload = {
      userId: user.id,
      status: user.status,
      email: user.email,
      role: user.role,
      };

      const accessToken = generateToken(
      jwtPayload,
      env.JWT_ACCESS_SECRET,
      env.JWT_ACCESS_EXPIRES_IN
      );

      const refreshToken = generateToken(
      jwtPayload,
      env.JWT_REFRESH_SECRET,
      env.JWT_REFRESH_EXPIRES_IN
      );

      const { password: _, ...userWithoutPassword } = user;


      return {
            user: userWithoutPassword,
            accessToken,
            refreshToken
      };
       
}


export const AuthService = {
    registerUserIntoDb,
    loginUser

}