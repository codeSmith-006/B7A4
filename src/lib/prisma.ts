import { PrismaPg } from "@prisma/adapter-pg";

import config from "../config/index.js";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: config.database_url ?? "",
});

const prisma = new PrismaClient({ adapter });

export { prisma };
