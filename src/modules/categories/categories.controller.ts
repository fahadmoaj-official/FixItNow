import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { CategoriesService } from "./categories.service";



const CreateACategory = async (req: Request, res: Response) => {
  try {
    const result = await CategoriesService.CreateACategoryIntoDb(req.body.name);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to while creating category",
      error: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

const GetAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await CategoriesService.GetAllCategoriesIntoDb();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Categories fetched successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to get all Categories",
      error: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};


export const CategoriesController = {
    CreateACategory,
    GetAllCategories,
};
