import {
  Prisma,
  PropertyStatus,
  RentalRequestStatus,
  UserRole,
  UserStatus,
} from "../../generated/prisma/client";

const categorySearchableFields = ["name", "description"] as const;
const categorySortableFields = ["name", "createdAt", "updatedAt"] as const;
const propertySearchableFields = ["title", "description"] as const;
const propertySortableFields = ["createdAt", "updatedAt", "rent", "bedrooms", "bathrooms", "title"] as const;
const rentalSearchableFields = ["message"] as const;
const rentalSortableFields = ["createdAt", "updatedAt", "moveInDate", "durationMonths", "monthlyRent", "status"] as const;
const userSearchableFields = ["name", "email", "phone"] as const;
const userSortableFields = ["createdAt", "updatedAt", "name", "email", "role", "status"] as const;

const toNumber = (value: unknown) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const toString = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

export const buildCategoryFilters = (query: Record<string, unknown>): Prisma.CategoryWhereInput => {
  const andConditions: Prisma.CategoryWhereInput[] = [];
  const searchTerm = toString(query.searchTerm);
  const name = toString(query.name);
  const slug = toString(query.slug);

  if (searchTerm) {
    andConditions.push({
      OR: categorySearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (name) andConditions.push({ name });
  if (slug) andConditions.push({ slug });

  return andConditions.length ? { AND: andConditions } : {};
};

export const buildCategoryOrderBy = (query: Record<string, unknown>): Prisma.CategoryOrderByWithRelationInput => {
  const sortBy = toString(query.sortBy);
  const sortOrder = query.sortOrder === "desc" ? "desc" : "asc";

  if (!sortBy || !categorySortableFields.includes(sortBy as (typeof categorySortableFields)[number])) {
    return { name: "asc" };
  }

  return { [sortBy]: sortOrder };
};

export const buildPropertyFilters = (query: Record<string, unknown>): Prisma.PropertyWhereInput => {
  const andConditions: Prisma.PropertyWhereInput[] = [];
  const searchTerm = toString(query.searchTerm);
  const title = toString(query.title);
  const description = toString(query.description);
  const city = toString(query.city);
  const area = toString(query.area);
  const categoryId = toString(query.categoryId);
  const status = toString(query.status);
  const minRent = toNumber(query.minRent);
  const maxRent = toNumber(query.maxRent);
  const bedrooms = toNumber(query.bedrooms);
  const bathrooms = toNumber(query.bathrooms);

  if (searchTerm) {
    andConditions.push({
      OR: propertySearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (title) andConditions.push({ title });
  if (description) andConditions.push({ description });
  if (city) andConditions.push({ city });
  if (area) andConditions.push({ area });
  if (categoryId) andConditions.push({ categoryId });
  if (status && Object.values(PropertyStatus).includes(status as PropertyStatus)) {
    andConditions.push({ status: status as PropertyStatus });
  }
  if (minRent !== undefined || maxRent !== undefined) {
    andConditions.push({
      rent: {
        ...(minRent !== undefined ? { gte: new Prisma.Decimal(minRent) } : {}),
        ...(maxRent !== undefined ? { lte: new Prisma.Decimal(maxRent) } : {}),
      },
    });
  }
  if (bedrooms !== undefined) andConditions.push({ bedrooms });
  if (bathrooms !== undefined) andConditions.push({ bathrooms });

  return andConditions.length ? { AND: andConditions } : {};
};

export const buildPropertyOrderBy = (query: Record<string, unknown>): Prisma.PropertyOrderByWithRelationInput => {
  const sortBy = toString(query.sortBy);
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  if (!sortBy || !propertySortableFields.includes(sortBy as (typeof propertySortableFields)[number])) {
    return { createdAt: "desc" };
  }

  return { [sortBy]: sortOrder };
};

export const buildRentalFilters = (query: Record<string, unknown>): Prisma.RentalRequestWhereInput => {
  const andConditions: Prisma.RentalRequestWhereInput[] = [];
  const searchTerm = toString(query.searchTerm);
  const status = toString(query.status);
  const propertyId = toString(query.propertyId);
  const tenantId = toString(query.tenantId);
  const minMonthlyRent = toNumber(query.minMonthlyRent);
  const maxMonthlyRent = toNumber(query.maxMonthlyRent);
  const durationMonths = toNumber(query.durationMonths);

  if (searchTerm) {
    andConditions.push({
      OR: rentalSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (status && Object.values(RentalRequestStatus).includes(status as RentalRequestStatus)) {
    andConditions.push({ status: status as RentalRequestStatus });
  }
  if (propertyId) andConditions.push({ propertyId });
  if (tenantId) andConditions.push({ tenantId });
  if (minMonthlyRent !== undefined || maxMonthlyRent !== undefined) {
    andConditions.push({
      monthlyRent: {
        ...(minMonthlyRent !== undefined ? { gte: new Prisma.Decimal(minMonthlyRent) } : {}),
        ...(maxMonthlyRent !== undefined ? { lte: new Prisma.Decimal(maxMonthlyRent) } : {}),
      },
    });
  }
  if (durationMonths !== undefined) andConditions.push({ durationMonths });

  return andConditions.length ? { AND: andConditions } : {};
};

export const buildRentalOrderBy = (query: Record<string, unknown>): Prisma.RentalRequestOrderByWithRelationInput => {
  const sortBy = toString(query.sortBy);
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  if (!sortBy || !rentalSortableFields.includes(sortBy as (typeof rentalSortableFields)[number])) {
    return { createdAt: "desc" };
  }

  return { [sortBy]: sortOrder };
};

export const buildUserFilters = (query: Record<string, unknown>): Prisma.UserWhereInput => {
  const andConditions: Prisma.UserWhereInput[] = [];
  const searchTerm = toString(query.searchTerm);
  const name = toString(query.name);
  const email = toString(query.email);
  const phone = toString(query.phone);
  const role = toString(query.role);
  const status = toString(query.status);

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (name) andConditions.push({ name });
  if (email) andConditions.push({ email });
  if (phone) andConditions.push({ phone });
  if (role && Object.values(UserRole).includes(role as UserRole)) {
    andConditions.push({ role: role as UserRole });
  }
  if (status && Object.values(UserStatus).includes(status as UserStatus)) {
    andConditions.push({ status: status as UserStatus });
  }

  return andConditions.length ? { AND: andConditions } : {};
};

export const buildUserOrderBy = (query: Record<string, unknown>): Prisma.UserOrderByWithRelationInput => {
  const sortBy = toString(query.sortBy);
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  if (!sortBy || !userSortableFields.includes(sortBy as (typeof userSortableFields)[number])) {
    return { createdAt: "desc" };
  }

  return { [sortBy]: sortOrder };
};
