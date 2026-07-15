import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../https-errors";
import { ZodError } from "zod";
import logger from "@/lib/logger";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | []
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api" ? NextResponse.json(responseContent, { status }) : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    logger.error({ err: error }, `${responseType.toUpperCase()} Error: ${error.message}`);

    return formatResponse(responseType, error.statusCode, error.message, error.errors);
  }

  if (error instanceof Error) {
    logger.error(error.message);
    return formatResponse(responseType, 500, error.message);
  }

  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(issue.message);
    });
    const validationError = new ValidationError(fieldErrors);
    logger.error({ err: error }, `validationError: ${validationError.message}`);
    return formatResponse(responseType, validationError.statusCode, validationError.message, validationError.errors);
  }

  logger.error({ err: error }, "An unexpected error occured");
  return formatResponse(responseType, 500, "An unexpected error occured");
};

export default handleError;
