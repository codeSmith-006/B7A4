import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { UpdateUserStatusPayload } from "./interface";

const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          properties: true,
          rentalRequests: true,
          reviews: true,
        },
      },
    },
  });
};

const updateUserStatus = async (userId: string, payload: UpdateUserStatusPayload) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { status: payload.status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
};

const getProperties = async () => {
  return prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      _count: {
        select: {
          rentalRequests: true,
          reviews: true,
        },
      },
    },
  });
};

const getRentals = async () => {
  return prisma.rentalRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payment: true,
    },
  });
};

export const adminService = {
  getUsers,
  updateUserStatus,
  getProperties,
  getRentals,
};
