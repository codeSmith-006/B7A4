import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsnyc.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { authService } from "./services.js";


// register a user
const register = catchAsync(async (req: Request, res: Response) => {
  const registerUserResult = await authService.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: registerUserResult,
  });
});

export const authController = {
  register,
};
