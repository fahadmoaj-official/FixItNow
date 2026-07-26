
import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./Auth.service";


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

        const result = await AuthService.loginUser(req.body);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User logged in successfully",
            data: result
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

        
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile fetched successfully",
        data: req.user
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