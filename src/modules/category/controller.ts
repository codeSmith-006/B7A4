import { Request, Response } from "express";
import httpStatus from "http-status";

import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./service";
import { catchAsync } from "../../utils/catchAsnyc";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getCategories(req.query as Record<string, unknown>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const categoryController = {
  createCategory,
  getCategories,
};
