import type { RequestHandler } from "express";

import { verifyToken } from "../utils/jwt";

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      const error = new Error("Authentication token is required");
      (error as Error & { statusCode: number }).statusCode = 401;
      throw error;
    }

    const payload = await verifyToken(token);

    req.user = {
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
