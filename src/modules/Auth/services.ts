import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { RegisterPayload } from "./interface";
import httpStatus from "http-status"



// register user service
const registerUserIntoDB = async (payload: RegisterPayload) => {
    
  // checks for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }
};

export const authService = {
  registerUserIntoDB,
};
