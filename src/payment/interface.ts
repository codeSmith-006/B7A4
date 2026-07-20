export type PaymentIntentPayload = {
  rentalRequestId: string;
};

export type ConfirmPaymentPayload = {
  paymentIntentId: string;
};
