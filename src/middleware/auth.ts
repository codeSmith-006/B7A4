import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import  httpStatus  from "http-status";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";


export type AuthUser = {
  userId: string;
  role: UserRole;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const auth = (...roles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.accessToken;

    if (!token) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, "Authentication required"));
    }

    const decoded = verifyToken<AuthUser>(token, config.jwtAccessSecret);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, "User not found"));
    }

    if (user.status === UserStatus.BLOCKED) {
      return next(new ApiError(httpStatus.FORBIDDEN, "User is blocked"));
    }

    if (roles.length && !roles.includes(user.role)) {
      return next(new ApiError(httpStatus.FORBIDDEN, "Access denied"));
    }

    req.user = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };

    next();
  };
};