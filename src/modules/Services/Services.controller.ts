import type { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { ServicesService } from "./Services.service";

const CreateAServices = async (req: Request, res: Response) => {
  try {

    const customerId = req.user?.id;

    const result = await ServicesService.CreateAServicesIntoDb(req.body, customerId as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to create service",
      error: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

const GetAllCategories = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to get all Categories",
      error: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const ServicesController = {
  CreateAServices,
  GetAllCategories,
};
