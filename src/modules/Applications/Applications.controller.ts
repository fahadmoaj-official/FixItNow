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


const getApplicationsForService = async (req: Request, res: Response) => {
    try {
        
        const serviceId = req.params?.serviceId as string;
        const userRole = req.user?.role as string; // IsAuthenticated middleware
        const customerId = req.user?.id as string; // IsAuthenticated middleware
        const result = await ApplicationsService.getApplicationsForServiceFromDb(serviceId, userRole, customerId);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Applications for service retrieved successfully",
            data: result,
        });
        
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to get applications for service",
            error: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}


const getApplicationsForTechnician = async (req: Request, res: Response) => {

    try {

        const technicianId = req.user?.id as string; 

        const result = await ApplicationsService.getApplicationsForTechnicianFromDb(technicianId);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Applications for technician retrieved successfully",
            data: result,
        });
        
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to get applications for technician",
            error: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}



export const ApplicationsController = {
    applyToService,
    getApplicationsForService,
    getApplicationsForTechnician,
}