import type{ Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";


const createReview = async (req:Request, res:Response) => {
  try {

    const customerId = req.user?.id as string;

    const result = await ReviewService.createReviewIntoDb(req.body,customerId);

    sendResponse(res,{
      statusCode: 200,
      success: true,
      message: "Review created successfully",
      data: result,
    });


  }catch (error) {
     sendResponse(res,{
        statusCode: 500,
        success: false,
        message: "Failed to create review",
        error: error instanceof Error ? error.message : "Internal Server Error",
     });
  }
}

export const ReviewController = {
  createReview,
}