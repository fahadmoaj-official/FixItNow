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

const GetAllBookings = async (req: Request, res: Response) => {
    try{

        const customerId = req.user?.id as string;

        const result = await BookingsService.getAllBookings( customerId );
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: "Bookings fetched successfully",
            data: result
        });
    }catch(err){
        sendResponse(res,{
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to fetch bookings",
            error: err instanceof Error ? err.message : "Internal Server Error",
        });
    }
}

const GetBookingDetailsById = async (req: Request, res: Response) => {
     try{

        const bookingId = req.params.bookingId as string;

    const result = await BookingsService.getBookingById( bookingId );
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

export const BookingsController = {
    CreateBooking,
    GetAllBookings,
    GetBookingDetailsById
}