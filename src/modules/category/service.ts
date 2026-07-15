import { prisma } from "../../lib/prisma";
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

const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

export const categoryService = {
  createCategory,
  getCategories,
};
