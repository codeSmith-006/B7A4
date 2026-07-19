import httpStatus from "http-status";
import { Prisma, PropertyStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { getPagination } from "../../utils/pagination";
import { buildPropertyFilters, buildPropertyOrderBy } from "../../utils/queryBuilder";
import { PropertyPayload } from "./interface";

const propertySelection = {
  id: true,
  title: true,
  description: true,
  address: true,
  city: true,
  area: true,
  rent: true,
  bedrooms: true,
  bathrooms: true,
  size: true,
  amenities: true,
  images: true,
  status: true,
  createdAt: true,
  category: true,
  landlord: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  _count: {
    select: {
      reviews: true,
    },
  },
} satisfies Prisma.PropertySelect;

const createProperty = async (userId: string, payload: PropertyPayload) => {
  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return prisma.property.create({
    data: {
      ...payload,
      rent: new Prisma.Decimal(payload.rent),
      amenities: payload.amenities ?? [],
      images: payload.images ?? [],
      landlordId: userId,
    },
    select: propertySelection,
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
      select: propertySelection,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
};

const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      ...propertySelection,
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  return property;
};

const updateProperty = async (userId: string, propertyId: string, payload: Partial<PropertyPayload>) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });

  if (!property || property.landlordId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  return prisma.property.update({
    where: { id: propertyId },
    data: {
      ...payload,
      ...(payload.rent !== undefined ? { rent: new Prisma.Decimal(payload.rent) } : {}),
      ...(payload.amenities ? { amenities: payload.amenities } : {}),
      ...(payload.images ? { images: payload.images } : {}),
      ...(payload.status ? { status: payload.status as PropertyStatus } : {}),
    },
    select: propertySelection,
  });
};

const deleteProperty = async (userId: string, propertyId: string) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });

  if (!property || property.landlordId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  await prisma.property.delete({ where: { id: propertyId } });
};

export const propertyService = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
