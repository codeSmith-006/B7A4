import { UserRole } from "../../../generated/prisma/enums";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  avatar?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
