
import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./Auth.service";
import env from "../../config/env";


const registerUser = async (req: Request, res: Response) => {
    try {

        const result = await AuthService.registerUserIntoDb(req.body);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "User registered successfully",
            data: result
        });

    }
    catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error while registering user",
        error: error instanceof Error ? error.message : "Something went wrong"
      })
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {

        const { user, accessToken, refreshToken } = await AuthService.loginUserIntoDb(req.body);

        res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "none",
        maxAge:  1 * 24 * 60 * 60 * 1000, // 1 days in milliseconds
       });

       res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "none",
        maxAge:  5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
       });

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                user,
                accessToken,
                refreshToken
            }
        });

    }
    catch (error) {
       sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error while logging in user",
        error: error instanceof Error ? error.message : "Something went wrong"
      })
    }
}


const getMe = async (req: Request, res: Response) => {
    try {

        const user = req.user; // auth middelware
       const result = await AuthService.getMeIntoDb(user?.id as string);
        
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result
      });
    }
    catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error while fetching user profile",
        error: error instanceof Error ? error.message : "Something went wrong"
      });
    }
}


export const AuthController = {
    registerUser,
    loginUser,
    getMe
}