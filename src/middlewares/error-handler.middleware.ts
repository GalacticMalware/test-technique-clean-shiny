import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction)  =>{
  const msg = err instanceof Error ? err.message : "Internal Server Error";
  logger.error("Unhandled error", { err });
  res.status(500).json({ error: msg });
}
