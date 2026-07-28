import type{ Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { techniciansService } from "./technicians.service";


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




const CreateTechnicianProfile = async (req:Request, res:Response) => {
    try{
        const userid = req.user?.id as string;
        const result = await techniciansService.createTechnicianProfileIntoDb(userid, req.body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Technician profile created successfully",
            data: result,
          });
    } catch (error) {
        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to create technician profile",
            error: error instanceof Error ? error.message : "Internal Server Error",
          });
    }
}

export const techniciansController = {
    GetAllTechnicians,
    GetTechnicianById,
    CreateTechnicianProfile

}