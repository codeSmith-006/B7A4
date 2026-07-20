import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";

import config from "./config/index.js";
import { swaggerSpec } from "./config/swagger.js";
import router from "./modules/route.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

const app: Application = express();
const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RentNest API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.8/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.8/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.8/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      window.ui = SwaggerUIBundle({
        url: "/api-docs/swagger.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;

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
app.get("/api-docs/swagger.json", (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});
app.get(["/api-docs", "/api-docs/"], (_req: Request, res: Response) => {
  res.type("html").send(swaggerHtml);
});
app.use(globalErrorHandler)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

export default app;
