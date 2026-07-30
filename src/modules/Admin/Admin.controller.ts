
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AdminService } from "./Admin.service";
import { UserStatus } from "../../../generated/prisma/client";


const getAllUsers = async (req:Request, res:Response) => {
   
    try{

        const result = await AdminService.getAllUsersIntoDb();
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Users fetched successfully",
            data: result
        })
        
    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to fetch users",
            error: err instanceof Error ? err.message : "Internal Server Error",
        })
    }
}

const updateUserStatus = async (req:Request, res:Response) => {
     try{

        const userId = req.params?.userId as string;
        const  status = req.body?.status as UserStatus;
        const result = await AdminService.updateUserStatusIntoDb(userId, status);
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "User status updated successfully",
            data: result
        })
        
    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to Update users status",
            error: err instanceof Error ? err.message : "Internal Server Error",
        })
    }
}

const getAllBookings = async (req:Request, res:Response) => {
     try{

        const { bookings, totalBookings, CompletedBookings, ConfirmedBookings, InProgressBookings } = await AdminService.getAllBookingsIntoDb();
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Bookings fetched successfully",
            data: {
                bookings,
                metadata:{
                    totalBookings,
                    CompletedBookings,
                    ConfirmedBookings,
                    InProgressBookings
                },
                
            },
            
        })
        
    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to fetch bookings",
            error: err instanceof Error ? err.message : "Internal Server Error",
        })
    }
}

const getAllCategories = async (req:Request, res:Response) => {
     try{
        const categories = await AdminService.getAllCategoriesIntoDb();
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Categories fetched successfully",
            data: categories
        })
        
    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to fetch categories",
            error: err instanceof Error ? err.message : "Internal Server Error",
        })
    }
}

const createCategory = async (req:Request, res:Response) => {
     try{
        
        const categoryName = req.body?.name as string;
        const result = await AdminService.createCategoryIntoDb(categoryName);
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Category created successfully",
            data: result
        })

    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to create category",
            error: err instanceof Error ? err.message : "Internal Server Error",
        })
    }
}

export const AdminController = {
    getAllUsers,
    getAllBookings,
    getAllCategories,
    createCategory,
    updateUserStatus
}