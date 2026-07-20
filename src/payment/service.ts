import httpStatus from "http-status";
import { PaymentStatus, Prisma, RentalRequestStatus } from "../../../generated/prisma/client";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { ConfirmPaymentPayload, PaymentIntentPayload } from "./interface";

const paymentSelection = {
  id: true,
  amount: true,
  currency: true,
  provider: true,
  status: true,
  transactionId: true,
  paymentIntentId: true,
  paidAt: true,
  createdAt: true,
  rentalRequest: {
    include: {
      property: true,
    },
  },
} satisfies Prisma.PaymentSelect;

const createPaymentIntent = async (userId: string, payload: PaymentIntentPayload) => {
  if (!stripe) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Stripe is not configured");
  }

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: { payment: true, property: true },
  });

  if (!rentalRequest || rentalRequest.tenantId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Approved rental request not found");
  }

  if (rentalRequest.status !== RentalRequestStatus.APPROVED) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment is only allowed for approved rental requests");
  }

  const amount = Number(rentalRequest.monthlyRent);

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      rentalRequestId: rentalRequest.id,
      tenantId: userId,
      propertyId: rentalRequest.propertyId,
    },
  });

  const payment = rentalRequest.payment
    ? await prisma.payment.update({
        where: { id: rentalRequest.payment.id },
        data: {
          amount: rentalRequest.monthlyRent,
          paymentIntentId: intent.id,
          clientSecret: intent.client_secret,
          status: PaymentStatus.PENDING,
        },
        select: paymentSelection,
      })
    : await prisma.payment.create({
        data: {
          rentalRequestId: rentalRequest.id,
          userId,
          amount: rentalRequest.monthlyRent,
          paymentIntentId: intent.id,
          clientSecret: intent.client_secret,
        },
        select: paymentSelection,
      });

  return {
    ...payment,
    clientSecret: intent.client_secret,
  };
};

const confirmPayment = async (payload: ConfirmPaymentPayload) => {
  if (!stripe) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Stripe is not configured");
  }

  const intent = await stripe.paymentIntents.retrieve(payload.paymentIntentId);

  const payment = await prisma.payment.findUnique({
    where: { paymentIntentId: payload.paymentIntentId },
  });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  const isSuccess = intent.status === "succeeded";

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: isSuccess ? PaymentStatus.SUCCEEDED : PaymentStatus.FAILED,
      transactionId: intent.latest_charge ? String(intent.latest_charge) : payment.transactionId,
      paidAt: isSuccess ? new Date() : null,
    },
    select: paymentSelection,
  });

  if (isSuccess) {
    await prisma.rentalRequest.update({
      where: { id: payment.rentalRequestId },
      data: { status: RentalRequestStatus.PAID },
    });
  }

  return updatedPayment;
};

const getPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: paymentSelection,
  });
};

const getPaymentById = async (userId: string, paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: paymentSelection,
  });

  if (!payment || payment.rentalRequest.tenantId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  return payment;
};

export const paymentService = {
  createPaymentIntent,
  confirmPayment,
  getPayments,
  getPaymentById,
};
