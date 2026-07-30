import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";

const createPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "bookingId is required",
        data: null,
      });
      return;
    }

    const result = await paymentService.createPaymentIntoDb(bookingId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Stripe checkout session created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to create Stripe payment",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "sessionId is required",
        data: null,
      });
      return;
    }

    const result = await paymentService.confirmPaymentIntoDb(sessionId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment confirmed successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to confirm payment",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.getAllPaymentsFromDb();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch payments",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const getPaymentById = async (req: Request, res: Response) => {
  try {
    const paymentId = Array.isArray(req.params.paymentId)
      ? req.params.paymentId[0]
      : req.params.paymentId;

    if (!paymentId) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "paymentId is required",
        data: null,
      });
      return;
    }

    const payment = await paymentService.getPaymentByIdFromDb(paymentId);

    if (!payment) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Payment not found",
        data: null,
      });
      return;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment fetched successfully",
      data: payment,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch payment",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    await paymentService.handleStripeWebhookServices(event, signature);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Webhook received successfully",
      data: null,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to handle Stripe webhook",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const paymentController = {
  createPayment,
  confirmPayment,
  getPayments,
  getPaymentById,
  handleStripeWebhook,
};
