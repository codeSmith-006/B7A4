import { Prisma, PropertyStatus } from "../../generated/prisma/client";

const toNumber = (value: unknown) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const toString = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

export const buildPropertyFilters = (query: Record<string, unknown>): Prisma.PropertyWhereInput => {
  const searchTerm = toString(query.searchTerm);
  const city = toString(query.city);
  const categoryId = toString(query.categoryId);
  const status = toString(query.status);
  const minRent = toNumber(query.minRent);
  const maxRent = toNumber(query.maxRent);
  const bedrooms = toNumber(query.bedrooms);
  const bathrooms = toNumber(query.bathrooms);

  return {
    ...(searchTerm
      ? {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { address: { contains: searchTerm, mode: "insensitive" } },
            { city: { contains: searchTerm, mode: "insensitive" } },
            { area: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(status && Object.values(PropertyStatus).includes(status as PropertyStatus)
      ? { status: status as PropertyStatus }
      : {}),
    ...(minRent !== undefined || maxRent !== undefined
      ? {
          rent: {
            ...(minRent !== undefined ? { gte: new Prisma.Decimal(minRent) } : {}),
            ...(maxRent !== undefined ? { lte: new Prisma.Decimal(maxRent) } : {}),
          },
        }
      : {}),
    ...(bedrooms !== undefined ? { bedrooms } : {}),
    ...(bathrooms !== undefined ? { bathrooms } : {}),
  };
};
