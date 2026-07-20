import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import config from "./config/index.js";
import { swaggerSpec } from "./config/swagger.js";
import router from "./modules/route.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

const app: Application = express();

app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", router);
app.get("/api-docs", (_req: Request, res: Response) => {
  res.redirect(301, "/api-docs/");
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(globalErrorHandler)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

export default app;
