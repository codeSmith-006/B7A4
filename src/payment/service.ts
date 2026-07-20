import httpStatus from "http-status";
import Stripe from "stripe";
import { PaymentStatus, Prisma, RentalRequestStatus } from "../../generated/prisma/client";
import { stripe } from "../lib/stripe";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import config from "../config/index";
import { ConfirmPaymentPayload, PaymentIntentPayload, StripeWebhookPayload } from "./interface";

const paymentSelection = {
  id: true,
  amount: true,
  currency: true,
  provider: true,
  status: true,
  transactionId: true,
  paymentIntentId: true,
  checkoutSessionId: true,
  paidAt: true,
  createdAt: true,
  rentalRequest: {
    include: {
      property: true,
    },
  },
} satisfies Prisma.PaymentSelect;

const getStripeClient = () => {
  if (!stripe) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Stripe is not configured");
  }

  return stripe;
};

const getPaymentIntentId = (paymentIntent: string | Stripe.PaymentIntent | null) => {
  if (!paymentIntent) return null;

  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
};

const getLatestChargeId = async (stripeClient: Stripe, paymentIntentId: string | null) => {
  if (!paymentIntentId) return null;

  const intent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

  return intent.latest_charge ? String(intent.latest_charge) : null;
};

const markPaymentSucceeded = async (
  paymentId: string,
  paymentIntentId: string | null,
  transactionId: string | null,
  checkoutSessionId?: string,
) => {
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.SUCCEEDED,
      paymentIntentId,
      ...(checkoutSessionId ? { checkoutSessionId } : {}),
      transactionId,
      paidAt: new Date(),
    },
    select: paymentSelection,
  });

  await prisma.rentalRequest.update({
    where: { id: updatedPayment.rentalRequest.id },
    data: { status: RentalRequestStatus.PAID },
  });

  return updatedPayment;
};

const findOrCreatePaymentForSession = async (session: Stripe.Checkout.Session, paymentIntentId: string | null) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      OR: [
        { checkoutSessionId: session.id },
        ...(session.metadata?.rentalRequestId ? [{ rentalRequestId: session.metadata.rentalRequestId }] : []),
      ],
    },
  });

  if (existingPayment) {
    return existingPayment;
  }

  const rentalRequestId = session.metadata?.rentalRequestId;
  const tenantId = session.metadata?.tenantId;

  if (!rentalRequestId || !tenantId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Stripe checkout metadata is missing");
  }

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
  });

  if (!rentalRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  return prisma.payment.create({
    data: {
      rentalRequestId,
      userId: tenantId,
      amount: session.amount_total ? session.amount_total / 100 : rentalRequest.monthlyRent,
      currency: session.currency ?? "usd",
      paymentIntentId,
      checkoutSessionId: session.id,
      clientSecret: null,
      status: PaymentStatus.PENDING,
    },
  });
};

const createPaymentIntent = async (userId: string, payload: PaymentIntentPayload) => {
  const stripeClient = getStripeClient();

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: { payment: true, property: true, tenant: true },
  });

  if (!rentalRequest || rentalRequest.tenantId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Approved rental request not found");
  }

  if (rentalRequest.status !== RentalRequestStatus.APPROVED) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment is only allowed for approved rental requests");
  }

  const amount = Number(rentalRequest.monthlyRent);

  const session = await stripeClient.checkout.sessions.create({
    mode: "payment",
    success_url: config.stripeCheckoutSuccessUrl,
    cancel_url: config.stripeCancelUrl,
    customer_email: rentalRequest.tenant.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: rentalRequest.property.title,
            description: rentalRequest.property.address,
          },
        },
      },
    ],
    metadata: {
      rentalRequestId: rentalRequest.id,
      tenantId: userId,
      propertyId: rentalRequest.propertyId,
    },
    payment_intent_data: {
      metadata: {
        rentalRequestId: rentalRequest.id,
        tenantId: userId,
        propertyId: rentalRequest.propertyId,
      },
    },
  });

  if (!session.url) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Stripe checkout URL could not be created");
  }

  const paymentIntentId = getPaymentIntentId(session.payment_intent);

  const payment = rentalRequest.payment
    ? await prisma.payment.update({
        where: { id: rentalRequest.payment.id },
        data: {
          amount: rentalRequest.monthlyRent,
          paymentIntentId,
          checkoutSessionId: session.id,
          clientSecret: null,
          status: PaymentStatus.PENDING,
        },
        select: paymentSelection,
      })
    : await prisma.payment.create({
        data: {
          rentalRequestId: rentalRequest.id,
          userId,
          amount: rentalRequest.monthlyRent,
          paymentIntentId,
          checkoutSessionId: session.id,
          clientSecret: null,
        },
        select: paymentSelection,
      });

  return {
    ...payment,
    checkoutUrl: session.url,
  };
};

const confirmPayment = async (payload: ConfirmPaymentPayload) => {
  const stripeClient = getStripeClient();

  const intent = await stripeClient.paymentIntents.retrieve(payload.paymentIntentId);

  const payment = await prisma.payment.findUnique({
    where: { paymentIntentId: payload.paymentIntentId },
  });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  const isSuccess = intent.status === "succeeded";
  const transactionId = intent.latest_charge ? String(intent.latest_charge) : payment.transactionId;

  if (isSuccess) {
    return markPaymentSucceeded(payment.id, intent.id, transactionId);
  }

  return prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.FAILED,
      transactionId,
      paidAt: null,
    },
    select: paymentSelection,
  });
};

const confirmCheckoutSession = async (sessionId: string) => {
  const stripeClient = getStripeClient();
  const session = await stripeClient.checkout.sessions.retrieve(sessionId);
  const paymentIntentId = getPaymentIntentId(session.payment_intent);
  const payment = await findOrCreatePaymentForSession(session, paymentIntentId);

  if (session.payment_status === "paid") {
    const transactionId = await getLatestChargeId(stripeClient, paymentIntentId);
    return markPaymentSucceeded(payment.id, paymentIntentId, transactionId, session.id);
  }

  if (session.status === "expired") {
    return prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
        paymentIntentId,
        checkoutSessionId: session.id,
        paidAt: null,
      },
      select: paymentSelection,
    });
  }

  return payment;
};

const handleStripeWebhook = async (payload: StripeWebhookPayload, signatureHeader: string | string[] | undefined) => {
  const stripeClient = getStripeClient();

  if (!config.stripeWebhookSecret) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Stripe webhook secret is not configured");
  }

  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;

  if (!signature) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Stripe signature is missing");
  }

  const event = stripeClient.webhooks.constructEvent(payload, signature, config.stripeWebhookSecret);

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentIntentId = getPaymentIntentId(session.payment_intent);
    if (session.payment_status === "paid") {
      const payment = await findOrCreatePaymentForSession(session, paymentIntentId);
      const transactionId = await getLatestChargeId(stripeClient, paymentIntentId);
      await markPaymentSucceeded(payment.id, paymentIntentId, transactionId, session.id);
    }
  }

  if (event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentIntentId = getPaymentIntentId(session.payment_intent);
    const payment = await prisma.payment.findUnique({
      where: { checkoutSessionId: session.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          paymentIntentId,
          paidAt: null,
        },
      });
    }
  }

  return { received: true };
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
  confirmCheckoutSession,
  handleStripeWebhook,
  getPayments,
  getPaymentById,
};
