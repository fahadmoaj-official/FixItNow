import type{ Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { ApplicationsService } from "./Applications.service";

const applyToService = async (req: Request, res: Response) => {
    try {

        const { serviceId, } = req.body;
        const technicianId = req.user?.id as string; // IsAuthenticated middleware
        const userRole = req.user?.role as string; // IsAuthenticated middleware

        if (userRole !== "TECHNICIAN") {
            throw new Error("Only technicians can apply to services");
        }

        const result = await ApplicationsService.applyToServiceIntoDb(serviceId, technicianId);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Applied to service successfully",
            data: result,
        });
        
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to apply to service",
            error: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}




export const ApplicationsController = {
    applyToService
}