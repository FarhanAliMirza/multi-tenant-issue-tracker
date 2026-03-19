import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

type ErrorWithStatusCode = Error & {
  statusCode?: number;
  code?: string;
};

const getStatusCode = (error: ErrorWithStatusCode): number => {
  if (error instanceof ZodError) {
    return 400;
  }

  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    return 401;
  }

  if (error.statusCode) {
    return error.statusCode;
  }

  if (typeof error.code === "string" && error.code.startsWith("P")) {
    return 400;
  }

  return 500;
};

const getErrorMessage = (error: ErrorWithStatusCode): string => {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Validation failed";
  }

  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    return "Invalid or expired authentication token";
  }

  if (error.message) {
    return error.message;
  }

  return "Internal server error";
};

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const handledError = error as ErrorWithStatusCode;
  const statusCode = getStatusCode(handledError);
  const message = getErrorMessage(handledError);

  if (statusCode >= 500) {
    console.error("Unhandled server error:", handledError);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
