import httpStatus from "http-status";
import { Prisma, RentalRequestStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { RentalRequestPayload, RentalStatusPayload } from "./interface";

const rentalSelection = {
  id: true,
  moveInDate: true,
  durationMonths: true,
  message: true,
  monthlyRent: true,
  status: true,
  createdAt: true,
  property: {
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  },
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  payment: true,
  review: true,
} satisfies Prisma.RentalRequestSelect;

const createRentalRequest = async (tenantId: string, payload: RentalRequestPayload) => {
  const property = await prisma.property.findUnique({ where: { id: payload.propertyId } });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.status !== "AVAILABLE") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Property is not available");
  }

  if (property.landlordId === tenantId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You cannot request your own property");
  }

  return prisma.rentalRequest.create({
    data: {
      propertyId: payload.propertyId,
      tenantId,
      moveInDate: new Date(payload.moveInDate),
      durationMonths: payload.durationMonths,
      message: payload.message,
      monthlyRent: property.rent,
    },
    select: rentalSelection,
  });
};

const getMyRentalRequests = async (userId: string, role: string) => {
  if (role === "LANDLORD") {
    return prisma.rentalRequest.findMany({
      where: {
        property: {
          landlordId: userId,
        },
      },
      orderBy: { createdAt: "desc" },
      select: rentalSelection,
    });
  }

  return prisma.rentalRequest.findMany({
    where: { tenantId: userId },
    orderBy: { createdAt: "desc" },
    select: rentalSelection,
  });
};

const getRentalRequestById = async (userId: string, role: string, id: string) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id },
    select: rentalSelection,
  });

  if (!rentalRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  const isAllowed =
    role === "ADMIN" ||
    rentalRequest.tenant.id === userId ||
    rentalRequest.property.landlord.id === userId;

  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, "Access denied");
  }

  return rentalRequest;
};

const updateRentalStatus = async (landlordId: string, rentalRequestId: string, payload: RentalStatusPayload) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true },
  });

  if (!rentalRequest || rentalRequest.property.landlordId !== landlordId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rentalRequest.status !== RentalRequestStatus.PENDING) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Only pending requests can be updated");
  }

  return prisma.rentalRequest.update({
    where: { id: rentalRequestId },
    data: { status: payload.status as RentalRequestStatus },
    select: rentalSelection,
  });
};

export const rentalService = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
  updateRentalStatus,
};
