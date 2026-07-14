import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { RegisterPayload } from "./interface";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import config from "../../config";

// register user service
const registerUserIntoDB = async (payload: RegisterPayload) => {
  // checks for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  // if the role doesn't have in the user role then error
  if (!Object.values(UserRole).includes(payload.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid role selected");
  }

  // hashing password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    config.bcryptSaltRounds,
  );

  // create and return user
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

export const authService = {
  registerUserIntoDB,
};
