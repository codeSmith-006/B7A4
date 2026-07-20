import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import config from "./index.js";

const swaggerApiFiles = [
  path.join(process.cwd(), "src/modules/**/*.ts"),
  path.join(process.cwd(), "src/payment/**/*.ts"),
  path.join(process.cwd(), "dist/src/modules/**/*.js"),
  path.join(process.cwd(), "dist/src/payment/**/*.js"),
];

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
        url: config.apiUrl,
        description: config.nodeEnv === "production" ? "Production server" : "Local development server",
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
      {
        name: "Rental",
        description: "Rental request endpoints",
      },
      {
        name: "Property",
        description: "Property listing endpoints",
      },
      {
        name: "Review",
        description: "Review endpoints",
      },
      {
        name: "Payment",
        description: "Stripe payment endpoints",
      },
      {
        name: "Admin",
        description: "Admin endpoints",
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
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            total: { type: "integer", example: 42 },
          },
        },
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
            meta: {
              $ref: "#/components/schemas/PaginationMeta",
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
        RentalRequestPayload: {
          type: "object",
          required: ["propertyId", "moveInDate", "durationMonths"],
          properties: {
            propertyId: { type: "string", example: "property_uuid" },
            moveInDate: { type: "string", format: "date-time", example: "2026-08-01T00:00:00.000Z" },
            durationMonths: { type: "integer", example: 12 },
            message: {
              type: "string",
              example: "I would like to schedule a visit before moving in.",
            },
          },
        },
        RentalStatusPayload: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["APPROVED", "REJECTED"],
              example: "APPROVED",
            },
          },
        },
        RentalUserSummary: {
          type: "object",
          properties: {
            id: { type: "string", example: "user_uuid" },
            name: { type: "string", example: "Ryan Rehan" },
            email: { type: "string", format: "email", example: "ryan@example.com" },
            phone: { type: "string", example: "+8801700000000", nullable: true },
          },
        },
        RentalProperty: {
          type: "object",
          properties: {
            id: { type: "string", example: "property_uuid" },
            title: { type: "string", example: "Modern city apartment" },
            description: { type: "string", example: "A bright apartment near public transport." },
            address: { type: "string", example: "123 Lake Road" },
            city: { type: "string", example: "Dhaka" },
            area: { type: "string", example: "Gulshan", nullable: true },
            rent: { type: "string", example: "1200.00" },
            bedrooms: { type: "integer", example: 2 },
            bathrooms: { type: "integer", example: 2 },
            size: { type: "integer", example: 950, nullable: true },
            amenities: {
              type: "array",
              items: { type: "string" },
              example: ["WiFi", "Parking", "Elevator"],
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: ["https://example.com/property.jpg"],
            },
            status: {
              type: "string",
              enum: ["AVAILABLE", "UNAVAILABLE"],
              example: "AVAILABLE",
            },
            landlordId: { type: "string", example: "landlord_uuid" },
            categoryId: { type: "string", example: "category_uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            category: {
              $ref: "#/components/schemas/Category",
            },
            landlord: {
              $ref: "#/components/schemas/RentalUserSummary",
            },
          },
        },
        RentalPayment: {
          type: "object",
          nullable: true,
          properties: {
            id: { type: "string", example: "payment_uuid" },
            rentalRequestId: { type: "string", example: "rental_uuid" },
            userId: { type: "string", example: "tenant_uuid" },
            amount: { type: "string", example: "1200.00" },
            provider: { type: "string", enum: ["STRIPE"], example: "STRIPE" },
            status: { type: "string", enum: ["PENDING", "SUCCEEDED", "FAILED"], example: "PENDING" },
            currency: { type: "string", example: "usd" },
            transactionId: { type: "string", example: "txn_123", nullable: true },
            paymentIntentId: { type: "string", example: "pi_123", nullable: true },
            checkoutSessionId: { type: "string", example: "cs_test_123", nullable: true },
            clientSecret: { type: "string", example: "pi_123_secret_456", nullable: true },
            paidAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PaymentIntentPayload: {
          type: "object",
          required: ["rentalRequestId"],
          properties: {
            rentalRequestId: { type: "string", example: "rental_uuid" },
          },
        },
        ConfirmPaymentPayload: {
          type: "object",
          required: ["paymentIntentId"],
          properties: {
            paymentIntentId: { type: "string", example: "pi_123" },
          },
        },
        Payment: {
          allOf: [
            {
              $ref: "#/components/schemas/RentalPayment",
            },
            {
              type: "object",
              properties: {
                rentalRequest: {
                  allOf: [
                    {
                      $ref: "#/components/schemas/RentalRequest",
                    },
                    {
                      type: "object",
                      properties: {
                        property: {
                          $ref: "#/components/schemas/RentalProperty",
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        PaymentIntentResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 201 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Checkout session created successfully" },
            data: {
              allOf: [
                {
                  $ref: "#/components/schemas/Payment",
                },
                {
                  type: "object",
                  properties: {
                    checkoutUrl: { type: "string", example: "https://checkout.stripe.com/c/pay/cs_test_123" },
                  },
                },
              ],
            },
          },
        },
        PaymentResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Payment retrieved successfully" },
            data: {
              $ref: "#/components/schemas/Payment",
            },
          },
        },
        PaymentsResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Payments retrieved successfully" },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Payment",
              },
            },
          },
        },
        RentalReview: {
          type: "object",
          nullable: true,
          properties: {
            id: { type: "string", example: "review_uuid" },
            rating: { type: "integer", example: 5 },
            comment: { type: "string", example: "Great property and responsive landlord." },
            propertyId: { type: "string", example: "property_uuid" },
            tenantId: { type: "string", example: "tenant_uuid" },
            rentalRequestId: { type: "string", example: "rental_uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ReviewPayload: {
          type: "object",
          required: ["rentalRequestId", "rating", "comment"],
          properties: {
            rentalRequestId: { type: "string", example: "rental_uuid" },
            rating: { type: "integer", example: 5 },
            comment: { type: "string", example: "Great property and responsive landlord." },
          },
        },
        Review: {
          type: "object",
          properties: {
            id: { type: "string", example: "review_uuid" },
            rating: { type: "integer", example: 5 },
            comment: { type: "string", example: "Great property and responsive landlord." },
            propertyId: { type: "string", example: "property_uuid" },
            tenantId: { type: "string", example: "tenant_uuid" },
            rentalRequestId: { type: "string", example: "rental_uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            tenant: {
              type: "object",
              properties: {
                id: { type: "string", example: "tenant_uuid" },
                name: { type: "string", example: "Ryan Rehan" },
              },
            },
          },
        },
        RentalRequest: {
          type: "object",
          properties: {
            id: { type: "string", example: "rental_uuid" },
            moveInDate: { type: "string", format: "date-time" },
            durationMonths: { type: "integer", example: 12 },
            message: {
              type: "string",
              example: "I would like to schedule a visit before moving in.",
              nullable: true,
            },
            monthlyRent: { type: "string", example: "1200.00" },
            status: {
              type: "string",
              enum: ["PENDING", "APPROVED", "REJECTED", "PAID", "ACTIVE"],
              example: "PENDING",
            },
            createdAt: { type: "string", format: "date-time" },
            property: {
              $ref: "#/components/schemas/RentalProperty",
            },
            tenant: {
              $ref: "#/components/schemas/RentalUserSummary",
            },
            payment: {
              $ref: "#/components/schemas/RentalPayment",
            },
            review: {
              $ref: "#/components/schemas/RentalReview",
            },
          },
        },
        RentalRequestResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Rental request retrieved successfully" },
            data: {
              $ref: "#/components/schemas/RentalRequest",
            },
          },
        },
        RentalRequestsResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Rental requests retrieved successfully" },
            meta: {
              $ref: "#/components/schemas/PaginationMeta",
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/RentalRequest",
              },
            },
          },
        },
        PropertyPayload: {
          type: "object",
          required: ["title", "description", "address", "city", "rent", "bedrooms", "bathrooms", "categoryId"],
          properties: {
            title: { type: "string", example: "Modern city apartment" },
            description: { type: "string", example: "A bright apartment near public transport." },
            address: { type: "string", example: "123 Lake Road" },
            city: { type: "string", example: "Dhaka" },
            area: { type: "string", example: "Gulshan" },
            rent: { type: "number", example: 1200 },
            bedrooms: { type: "integer", example: 2 },
            bathrooms: { type: "integer", example: 2 },
            size: { type: "integer", example: 950 },
            amenities: {
              type: "array",
              items: { type: "string" },
              example: ["WiFi", "Parking", "Elevator"],
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: ["https://example.com/property.jpg"],
            },
            status: {
              type: "string",
              enum: ["AVAILABLE", "UNAVAILABLE"],
              example: "AVAILABLE",
            },
            categoryId: { type: "string", example: "category_uuid" },
          },
        },
        PropertyUpdatePayload: {
          type: "object",
          properties: {
            title: { type: "string", example: "Updated city apartment" },
            description: { type: "string", example: "Updated property description." },
            address: { type: "string", example: "123 Lake Road" },
            city: { type: "string", example: "Dhaka" },
            area: { type: "string", example: "Gulshan" },
            rent: { type: "number", example: 1300 },
            bedrooms: { type: "integer", example: 2 },
            bathrooms: { type: "integer", example: 2 },
            size: { type: "integer", example: 950 },
            amenities: {
              type: "array",
              items: { type: "string" },
              example: ["WiFi", "Parking", "Elevator"],
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: ["https://example.com/property.jpg"],
            },
            status: {
              type: "string",
              enum: ["AVAILABLE", "UNAVAILABLE"],
              example: "AVAILABLE",
            },
            categoryId: { type: "string", example: "category_uuid" },
          },
        },
        PropertyReview: {
          type: "object",
          properties: {
            id: { type: "string", example: "review_uuid" },
            rating: { type: "integer", example: 5 },
            comment: { type: "string", example: "Clean property and great location." },
            propertyId: { type: "string", example: "property_uuid" },
            tenantId: { type: "string", example: "tenant_uuid" },
            rentalRequestId: { type: "string", example: "rental_uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            tenant: {
              type: "object",
              properties: {
                id: { type: "string", example: "tenant_uuid" },
                name: { type: "string", example: "Ryan Rehan" },
              },
            },
          },
        },
        Property: {
          type: "object",
          properties: {
            id: { type: "string", example: "property_uuid" },
            title: { type: "string", example: "Modern city apartment" },
            description: { type: "string", example: "A bright apartment near public transport." },
            address: { type: "string", example: "123 Lake Road" },
            city: { type: "string", example: "Dhaka" },
            area: { type: "string", example: "Gulshan", nullable: true },
            rent: { type: "string", example: "1200.00" },
            bedrooms: { type: "integer", example: 2 },
            bathrooms: { type: "integer", example: 2 },
            size: { type: "integer", example: 950, nullable: true },
            amenities: {
              type: "array",
              items: { type: "string" },
              example: ["WiFi", "Parking", "Elevator"],
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: ["https://example.com/property.jpg"],
            },
            status: {
              type: "string",
              enum: ["AVAILABLE", "UNAVAILABLE"],
              example: "AVAILABLE",
            },
            createdAt: { type: "string", format: "date-time" },
            category: {
              $ref: "#/components/schemas/Category",
            },
            landlord: {
              $ref: "#/components/schemas/RentalUserSummary",
            },
            _count: {
              type: "object",
              properties: {
                reviews: { type: "integer", example: 3 },
              },
            },
          },
        },
        PropertyDetails: {
          allOf: [
            {
              $ref: "#/components/schemas/Property",
            },
            {
              type: "object",
              properties: {
                reviews: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/PropertyReview",
                  },
                },
              },
            },
          ],
        },
        PropertyResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Property retrieved successfully" },
            data: {
              $ref: "#/components/schemas/Property",
            },
          },
        },
        PropertyDetailsResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Property retrieved successfully" },
            data: {
              $ref: "#/components/schemas/PropertyDetails",
            },
          },
        },
        PropertiesResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Properties retrieved successfully" },
            meta: {
              type: "object",
              properties: {
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                total: { type: "integer", example: 42 },
              },
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Property",
              },
            },
          },
        },
        PropertyDeleteResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Property deleted successfully" },
          },
        },
        AdminUser: {
          type: "object",
          properties: {
            id: { type: "string", example: "user_uuid" },
            name: { type: "string", example: "Ryan Rehan" },
            email: { type: "string", format: "email", example: "ryan@example.com" },
            phone: { type: "string", example: "+8801700000000", nullable: true },
            role: { type: "string", enum: ["ADMIN", "LANDLORD", "TENANT"], example: "TENANT" },
            status: { type: "string", enum: ["ACTIVE", "BLOCKED"], example: "ACTIVE" },
            createdAt: { type: "string", format: "date-time" },
            _count: {
              type: "object",
              properties: {
                properties: { type: "integer", example: 2 },
                rentalRequests: { type: "integer", example: 3 },
                reviews: { type: "integer", example: 1 },
              },
            },
          },
        },
        AdminUsersResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Users retrieved successfully" },
            meta: {
              $ref: "#/components/schemas/PaginationMeta",
            },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/AdminUser" },
            },
          },
        },
        UpdateUserStatusPayload: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["ACTIVE", "BLOCKED"],
              example: "BLOCKED",
            },
          },
        },
        AdminUpdatedUser: {
          type: "object",
          properties: {
            id: { type: "string", example: "user_uuid" },
            name: { type: "string", example: "Ryan Rehan" },
            email: { type: "string", format: "email", example: "ryan@example.com" },
            role: { type: "string", example: "TENANT" },
            status: { type: "string", example: "BLOCKED" },
          },
        },
        AdminUpdateUserStatusResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "User status updated successfully" },
            data: { $ref: "#/components/schemas/AdminUpdatedUser" },
          },
        },
        AdminProperty: {
          type: "object",
          properties: {
            id: { type: "string", example: "property_uuid" },
            title: { type: "string", example: "Modern city apartment" },
            description: { type: "string", example: "A bright apartment near public transport." },
            address: { type: "string", example: "123 Lake Road" },
            city: { type: "string", example: "Dhaka" },
            area: { type: "string", example: "Gulshan", nullable: true },
            rent: { type: "string", example: "1200.00" },
            bedrooms: { type: "integer", example: 2 },
            bathrooms: { type: "integer", example: 2 },
            size: { type: "integer", example: 950, nullable: true },
            amenities: { type: "array", items: { type: "string" }, example: ["WiFi", "Parking", "Elevator"] },
            images: { type: "array", items: { type: "string" }, example: ["https://example.com/property.jpg"] },
            status: { type: "string", enum: ["AVAILABLE", "UNAVAILABLE"], example: "AVAILABLE" },
            landlordId: { type: "string", example: "landlord_uuid" },
            categoryId: { type: "string", example: "category_uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            landlord: {
              type: "object",
              properties: {
                id: { type: "string", example: "landlord_uuid" },
                name: { type: "string", example: "John Doe" },
                email: { type: "string", format: "email", example: "john@example.com" },
              },
            },
            category: { $ref: "#/components/schemas/Category" },
            _count: {
              type: "object",
              properties: {
                rentalRequests: { type: "integer", example: 5 },
                reviews: { type: "integer", example: 3 },
              },
            },
          },
        },
        AdminPropertiesResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Properties retrieved successfully" },
            meta: {
              $ref: "#/components/schemas/PaginationMeta",
            },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/AdminProperty" },
            },
          },
        },
        AdminRental: {
          type: "object",
          properties: {
            id: { type: "string", example: "rental_uuid" },
            moveInDate: { type: "string", format: "date-time" },
            durationMonths: { type: "integer", example: 12 },
            message: { type: "string", example: "I would like to schedule a visit.", nullable: true },
            monthlyRent: { type: "string", example: "1200.00" },
            status: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED", "PAID", "ACTIVE"], example: "ACTIVE" },
            reviewedAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            property: { $ref: "#/components/schemas/RentalProperty" },
            tenant: {
              type: "object",
              properties: {
                id: { type: "string", example: "tenant_uuid" },
                name: { type: "string", example: "Ryan Rehan" },
                email: { type: "string", format: "email", example: "ryan@example.com" },
              },
            },
            payment: { $ref: "#/components/schemas/RentalPayment", nullable: true },
          },
        },
        AdminRentalsResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Rentals retrieved successfully" },
            meta: {
              $ref: "#/components/schemas/PaginationMeta",
            },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/AdminRental" },
            },
          },
        },
      },
    },
  },
  apis: swaggerApiFiles,
};

export const swaggerSpec = swaggerJSDoc(options);
