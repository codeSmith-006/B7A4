import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { getPagination } from "../../utils/pagination";
import {
  buildPropertyFilters,
  buildPropertyOrderBy,
  buildRentalFilters,
  buildRentalOrderBy,
  buildUserFilters,
  buildUserOrderBy,
} from "../../utils/queryBuilder";
import { UpdateUserStatusPayload } from "./interface";

const userSelection = {
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
};

const adminPropertyInclude = {
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
};

const adminRentalInclude = {
  property: true,
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  payment: true,
};

const getUsers = async (query: Record<string, unknown>) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildUserFilters(query);
  const orderBy = buildUserOrderBy(query);

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: userSelection,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
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

const getProperties = async (query: Record<string, unknown>) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildPropertyFilters(query);
  const orderBy = buildPropertyOrderBy(query);

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: adminPropertyInclude,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
};

const getRentals = async (query: Record<string, unknown>) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildRentalFilters(query);
  const orderBy = buildRentalOrderBy(query);

  const [data, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: adminRentalInclude,
    }),
    prisma.rentalRequest.count({ where }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
};

export const adminService = {
  getUsers,
  updateUserStatus,
  getProperties,
  getRentals,
};
