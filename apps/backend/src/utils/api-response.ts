import type { ApiResult } from "@repo/shared";
import { Response } from "express";

export function sendResponse(res: Response, statusCode: number, payload: ApiResult) {
  return res.status(statusCode).json(payload);
}
