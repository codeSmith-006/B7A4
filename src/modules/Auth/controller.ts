import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsnyc";
import { authService } from "./services";


// register a user
const register = catchAsync(async (req: Request, res: Response) => {
    const registerUserResult = await authService.registerUserIntoDB(req.body)
})