import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const appUrl = process.env.APP_URL ?? "*";
const defaultCheckoutBaseUrl = appUrl !== "*" ? appUrl : "http://localhost:3000";
const port = Number(process.env.PORT ?? 5000);
const apiUrl = process.env.API_URL ?? `http://localhost:${port}`;
const frontendSuccessUrl = process.env.STRIPE_SUCCESS_URL ?? `${defaultCheckoutBaseUrl}/payment/success`;

const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port,
  databaseUrl: process.env.DATABASE_URL ?? "",
  appUrl,
  apiUrl,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "super-secret-access-key",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "7d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripeCheckoutSuccessUrl:
    process.env.STRIPE_CHECKOUT_SUCCESS_URL ??
    `${apiUrl}/api/v1/payments/success?session_id={CHECKOUT_SESSION_ID}`,
  stripeFrontendSuccessUrl: frontendSuccessUrl,
  stripeCancelUrl: process.env.STRIPE_CANCEL_URL ?? `${defaultCheckoutBaseUrl}/payment/cancel`,
};

export default config;
