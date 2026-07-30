import { Request, Response } from "express";
import BookingsService from "./bookings.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

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
        const TechnicianId = req.user?.id as string;
        const bookingId = req.params.bookingId as string;

    const result = await BookingsService.getBookingById( bookingId , TechnicianId );
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

const UpdateBookingStatusToRejected = async (req: Request, res: Response) => {
    try{
        const bookingId = req.params.bookingId as string;
        const result = await BookingsService.updateBookingStatusToRejected( bookingId );
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Booking status updated to rejected successfully",
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




export const BookingsController = {
    CreateBooking,
    GetBookingDetailsById,
    UpdateBookingStatusToAccept,
    UpdateBookingStatusToStarted,
    UpdateBookingStatusToRejected,
    UpdateBookingStatusToCompleted
}