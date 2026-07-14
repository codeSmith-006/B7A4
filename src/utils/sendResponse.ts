import { Response } from "express";

type TMeta = {
  page?: number;
  limit?: number;
  total?: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: TMeta;
};

export const sendResponse = <T>(res: Response, payload: TResponse<T>) => {
  const { statusCode, ...rest } = payload;
  res.status(statusCode).json(rest);
};
