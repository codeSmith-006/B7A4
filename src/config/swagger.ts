import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RentNest API",
      version: "1.0.0",
      description: "API documentation for the RentNest backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Category",
        description: "Category endpoints",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterPayload: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string", example: "Ryan Rehan" },
            email: { type: "string", format: "email", example: "ryan@example.com" },
            password: { type: "string", format: "password", example: "strongPassword123" },
            role: {
              type: "string",
              enum: ["ADMIN", "LANDLORD", "TENANT"],
              example: "TENANT",
            },
            phone: { type: "string", example: "+8801700000000" },
            bio: { type: "string", example: "Looking for a city apartment." },
            avatar: { type: "string", example: "https://example.com/avatar.jpg" },
          },
        },
        RegisterResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 201 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "User registered successfully" },
            data: {
              type: "object",
              properties: {
                id: { type: "string", example: "cuid_or_uuid" },
                name: { type: "string", example: "Ryan Rehan" },
                email: { type: "string", format: "email", example: "ryan@example.com" },
                role: { type: "string", example: "TENANT" },
                phone: { type: "string", example: "+8801700000000" },
                status: { type: "string", example: "ACTIVE" },
                createdAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
        LoginPayload: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "ryan@example.com" },
            password: { type: "string", format: "password", example: "strongPassword123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            data: {
              type: "object",
              properties: {
                accessToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token",
                },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "cuid_or_uuid" },
                    name: { type: "string", example: "Ryan Rehan" },
                    email: { type: "string", format: "email", example: "ryan@example.com" },
                    role: {
                      type: "string",
                      enum: ["ADMIN", "LANDLORD", "TENANT"],
                      example: "TENANT",
                    },
                    status: { type: "string", example: "ACTIVE" },
                  },
                },
              },
            },
          },
        },
        MeResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Profile retrieved successfully" },
            data: {
              type: "object",
              properties: {
                id: { type: "string", example: "cuid_or_uuid" },
                name: { type: "string", example: "Ryan Rehan" },
                email: { type: "string", format: "email", example: "ryan@example.com" },
                phone: { type: "string", example: "+8801700000000", nullable: true },
                bio: { type: "string", example: "Looking for a city apartment.", nullable: true },
                avatar: {
                  type: "string",
                  example: "https://example.com/avatar.jpg",
                  nullable: true,
                },
                role: {
                  type: "string",
                  enum: ["ADMIN", "LANDLORD", "TENANT"],
                  example: "TENANT",
                },
                status: { type: "string", example: "ACTIVE" },
                createdAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
        CategoryPayload: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Apartment" },
            description: {
              type: "string",
              example: "Residential apartment listings",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", example: "cuid_or_uuid" },
            name: { type: "string", example: "Apartment" },
            slug: { type: "string", example: "apartment" },
            description: {
              type: "string",
              example: "Residential apartment listings",
              nullable: true,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CategoryResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 201 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Category created successfully" },
            data: {
              $ref: "#/components/schemas/Category",
            },
          },
        },
        CategoriesResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Categories retrieved successfully" },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
