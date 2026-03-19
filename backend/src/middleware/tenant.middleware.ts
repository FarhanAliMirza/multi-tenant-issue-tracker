import type { RequestHandler } from "express";

export const tenantMiddleware: RequestHandler = (req, _res, next) => {
  if (!req.user?.tenantId) {
    const error = new Error("Tenant context is missing");
    (error as Error & { statusCode: number }).statusCode = 401;
    next(error);
    return;
  }

  next();
};
