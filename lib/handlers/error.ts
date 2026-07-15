import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../https-errors";
import { ZodError } from "zod";

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
    return formatResponse(responseType, error.statusCode, error.message, error.errors);
  }

  if (error instanceof Error) {
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

    return formatResponse(responseType, validationError.statusCode, validationError.message, validationError.errors);
  }

  return formatResponse(responseType, 500, "An unexpected error occured");
};

export default handleError;
