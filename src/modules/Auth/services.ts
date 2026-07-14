import { UserRole } from "../../../generated/prisma/enums";
import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { LoginPayload, RegisterPayload } from "./interface";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { createToken } from "../../utils/jwt";

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

// login user
const loginUserDB = async (payload: LoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(httpStatus.FORBIDDEN, "User is blocked");
  }

  const accessToken = createToken(
    {
      userId: user.id,
      role: user.role,
      email: user.email,
    },
    config.jwtAccessSecret,
    config.jwtAccessExpiresIn as import("jsonwebtoken").SignOptions["expiresIn"],
  );

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

// user profile 
const userProfileService = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
};

export const authService = {
  registerUserIntoDB,
  loginUserDB,
  userProfileService
};
