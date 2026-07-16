import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./service";
import { catchAsync } from "../../utils/catchAsnyc";

const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const result = await adminService.getUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.updateUserStatus(String(req.params.id), req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const getProperties = catchAsync(async (_req: Request, res: Response) => {
  const result = await adminService.getProperties();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getRentals = catchAsync(async (_req: Request, res: Response) => {
  const result = await adminService.getRentals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rentals retrieved successfully",
    data: result,
  });
});

export const adminController = {
  getUsers,
  updateUserStatus,
  getProperties,
  getRentals,
};
