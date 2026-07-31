import { Request, Response } from "express";
import BookingsService from "./bookings.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { get } from "node:http";

const CreateBooking = async (req: Request, res: Response) => {
    try{
        const CustomerId = req.user?.id as string;
        const result = await BookingsService.createBooking(req.body,CustomerId);


        sendResponse(res,{
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Booking created successfully",
            data: result
        });

    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to while creating booking",
            error: err instanceof Error ? err.message : "Internal Server Error",
        });
    }
}



const GetBookingDetailsById = async (req: Request, res: Response) => {
     try{
        const UserId = req.user?.id as string;
        const role = req.user?.role as string;
        const bookingId = req.params.bookingId as string;

    const result = await BookingsService.getBookingById( bookingId , UserId,role );
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking details fetched successfully",
            data: result
        });
    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to fetch booking details",
            error: err instanceof Error ? err.message : "Internal Server Error",
        });
    }
}


const UpdateBookingStatusToAccept = async (req: Request, res: Response) => {
    try{

        const bookingId = req.params.bookingId as string;
        const result = await BookingsService.updateBookingStatusToAccept( bookingId );
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking status updated to accept successfully",
            data: result
        });

    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update booking status",
            error: err instanceof Error ? err.message : "Internal Server Error",
        });
    }
}

const UpdateBookingStatusToStarted = async (req: Request, res: Response) => {
    try{
        const bookingId = req.params.bookingId as string;
        const result = await BookingsService.updateBookingStatusToStarted( bookingId );
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking status updated to started successfully",
            data: result
        });

    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update booking status",
            error: err instanceof Error ? err.message : "Internal Server Error",
        });
    }
}

const UpdateBookingStatusToCanceled = async (req: Request, res: Response) => {
    try{
        const bookingId = req.params.bookingId as string;
        const result = await BookingsService.updateBookingStatusToCanceled( bookingId );
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking status updated to canceled successfully",
            data: result
        });

    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update booking status",
            error: err instanceof Error ? err.message : "Internal Server Error",
        });
    }
}

const UpdateBookingStatusToCompleted = async (req: Request, res: Response) => {
    try{

        const bookingId = req.params.bookingId as string;
        const result = await BookingsService.updateBookingStatusToCompleted( bookingId );
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking status updated to completed successfully",
            data: result
        });

    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update booking status to completed",
            error: err instanceof Error ? err.message : "Internal Server Error",
        });
    }
}

const GetMyBookings = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id as string;
        const result = await BookingsService.getMyBookingsintoDb(userId);
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "My bookings fetched successfully",
            data: result
        });
    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to fetch my bookings",
            error: err instanceof Error ? err.message : "Internal Server Error",
        });
    }
}
const GetMyBookingDetailsById = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id as string;
        const bookingId = req.params.bookingId as string;
        const result = await BookingsService.GetMybookingDetailsById(userId,bookingId);
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "My booking details fetched successfully",
            data: result
        });
    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to fetch my bookings details",
            error: err instanceof Error ? err.message : "Internal Server Error",
        });
    }
}




export const BookingsController = {
    CreateBooking,
    GetBookingDetailsById,
    UpdateBookingStatusToAccept,
    UpdateBookingStatusToStarted,
    UpdateBookingStatusToCanceled,
    UpdateBookingStatusToCompleted,
    GetMyBookings,
    GetMyBookingDetailsById
}