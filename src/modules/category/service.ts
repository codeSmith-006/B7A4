import { prisma } from "../../lib/prisma";
import { getPagination } from "../../utils/pagination";
import { buildCategoryFilters, buildCategoryOrderBy } from "../../utils/queryBuilder";
import { CategoryPayload } from "./interface";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

const createCategory = async (payload: CategoryPayload) => {
  return prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description,
      slug: slugify(payload.name),
    },
  });
};

const getCategories = async (query: Record<string, unknown>) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildCategoryFilters(query);
  const orderBy = buildCategoryOrderBy(query);

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    meta: { page, limit, total },
    data,
  };
};

export const categoryService = {
  createCategory,
  getCategories,
};
