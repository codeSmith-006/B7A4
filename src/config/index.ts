import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  appUrl: process.env.APP_URL ?? "*",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "super-secret-access-key",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "7d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
};

export default config;
