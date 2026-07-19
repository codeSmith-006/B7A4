import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./service";
import { catchAsync } from "../../utils/catchAsnyc";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getUsers(req.query as Record<string, unknown>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
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

const getProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getProperties(req.query as Record<string, unknown>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getRentals(req.query as Record<string, unknown>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rentals retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const adminController = {
  getUsers,
  updateUserStatus,
  getProperties,
  getRentals,
};
