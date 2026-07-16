import httpStatus from "http-status";
import { RentalRequestStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { ReviewPayload } from "./interface";

const createReview = async (tenantId: string, payload: ReviewPayload) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: {
      payment: true,
      review: true,
    },
  });

  if (!rentalRequest || rentalRequest.tenantId !== tenantId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rentalRequest.status !== RentalRequestStatus.PAID && rentalRequest.status !== RentalRequestStatus.ACTIVE) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Review is only allowed after payment completion");
  }

  if (!rentalRequest.payment || rentalRequest.payment.status !== "SUCCEEDED") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment is not completed yet");
  }

  if (rentalRequest.review) {
    throw new ApiError(httpStatus.CONFLICT, "Review already submitted");
  }

  return prisma.$transaction(async (transaction) => {
    const review = await transaction.review.create({
      data: {
        rentalRequestId: rentalRequest.id,
        propertyId: rentalRequest.propertyId,
        tenantId,
        rating: payload.rating,
        comment: payload.comment,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await transaction.rentalRequest.update({
      where: { id: rentalRequest.id },
      data: {
        reviewedAt: new Date(),
        status: RentalRequestStatus.ACTIVE,
      },
    });

    return review;
  });
};

export const reviewService = {
  createReview,
};
