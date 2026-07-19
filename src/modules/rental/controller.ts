import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./service";
import { catchAsync } from "../../utils/catchAsnyc";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.createRentalRequest(req.user!.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Rental request submitted successfully",
    data: result,
  });
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getMyRentalRequests(
    req.user!.userId,
    req.user!.role,
    req.query as Record<string, unknown>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental requests retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getRentalRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getRentalRequestById(req.user!.userId, req.user!.role, String(req.params.id));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental request retrieved successfully",
    data: result,
  });
});

const updateRentalStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.updateRentalStatus(req.user!.userId, String(req.params.id), req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental request updated successfully",
    data: result,
  });
});

export const rentalController = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
  updateRentalStatus,
};
