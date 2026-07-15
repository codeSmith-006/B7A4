export type RentalRequestPayload = {
  propertyId: string;
  moveInDate: string;
  durationMonths: number;
  message?: string;
};

export type RentalStatusPayload = {
  status: "APPROVED" | "REJECTED";
};
