import type{ Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { techniciansService } from "./technicians.service";
import { BookingStatus } from "../../../generated/prisma/client";


const GetAllTechnicians = async (req:Request, res:Response) => {
    try{

     const result = await techniciansService.getAllTechniciansIntoDb();
     sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technicians retrieved successfully",
        data: result,
      });
        
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to get technicians",
        error: error instanceof Error ? error.message : "Internal Server Error",
      });
    }
}


const GetTechnicianById = async (req:Request, res:Response) => {
    try{
        const id = req.params?.id as string;
        const result = await techniciansService.getTechnicianByIdIntoDb(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Technician retrieved successfully",
            data: result,
          });
    } catch (error) {
        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to get technician",
            error: error instanceof Error ? error.message : "Internal Server Error",
          });
    }
}




const UpdateTechnicianProfile = async (req:Request, res:Response) => {
    try{
        const userid = req.user?.id as string;
        const result = await techniciansService.updateTechnicianProfileIntoDb(userid, req.body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Technician profile updated successfully",
            data: result,
          });
    } catch (error) {
        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update technician profile",
            error: error instanceof Error ? error.message : "Internal Server Error",
          });
    }
}
const UpdateTechnicianAvailability = async (req:Request, res:Response) => {
    try{
        const userId = req.user?.id as string;
       

        const result = await techniciansService.updateTechnicianAvailabilityIntoDb(userId, req.body.isAvailable);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Technician profile availability updated successfully",
            data: result,
          });
    } catch (error) {
        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update technician profile availability",
            error: error instanceof Error ? error.message : "Internal Server Error",
          });
    }
}


const GetTechnicianBookings = async (req:Request, res:Response) => {
     try{
        const userId = req.user?.id as string;
        
        const result = await techniciansService.GetTechnicianBookingsintoDb(userId);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Technician profile bookings retrive successfully",
            data: result,
          });
    } catch (error) {
        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to get technician bookigs",
            error: error instanceof Error ? error.message : "Internal Server Error",
          });
    }
}

const UpdateTechnicianBookingStatus = async (req:Request, res:Response) => {
    try{
        const userId = req.user?.id as string;
        const bookingId = req.params?.bookingId as string;
        const status = req.body.status as BookingStatus; 
        
        const result = await techniciansService.UpdateTechnicianBookingStatusIntoDb(userId, bookingId, status);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Technician profile booking status updated successfully",
            data: result,
          });

    }catch (error) {
        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update technician booking status",
            error: error instanceof Error ? error.message : "Internal Server Error",
          });
    }
}

export const techniciansController = {
    GetAllTechnicians,
    GetTechnicianById,
    UpdateTechnicianProfile,
    UpdateTechnicianAvailability,
    GetTechnicianBookings,
    UpdateTechnicianBookingStatus

}