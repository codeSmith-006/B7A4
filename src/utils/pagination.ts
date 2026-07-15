const toPositiveInteger = (value: unknown, fallback: number) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const getPagination = (query: Record<string, unknown>) => {
  const page = toPositiveInteger(query.page, 1);
  const limit = toPositiveInteger(query.limit, 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
