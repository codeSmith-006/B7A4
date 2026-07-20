import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsnyc";
import { sendResponse } from "../utils/sendResponse";
import { paymentService } from "./service";
import config from "../config/index";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.createPaymentIntent(req.user!.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Checkout session created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.confirmPayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment verified successfully",
    data: result,
  });
});

const handleCheckoutSuccess = catchAsync(async (req: Request, res: Response) => {
  const sessionId = String(req.query.session_id ?? "");

  if (!sessionId) {
    res.redirect(config.stripeFrontendSuccessUrl);
    return;
  }

  await paymentService.confirmCheckoutSession(sessionId);

  const redirectUrl = new URL(config.stripeFrontendSuccessUrl);
  redirectUrl.searchParams.set("session_id", sessionId);

  res.redirect(redirectUrl.toString());
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getPayments(req.user!.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getPaymentById(req.user!.userId, String(req.params.id));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.handleStripeWebhook(req.body, req.headers["stripe-signature"]);

  res.status(httpStatus.OK).json(result);
});

export const paymentController = {
  createPaymentIntent,
  confirmPayment,
  handleCheckoutSuccess,
  handleStripeWebhook,
  getPayments,
  getPaymentById,
};
