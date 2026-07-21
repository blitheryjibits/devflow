import { ZodSafeParseResult } from "zod";

export function flatten<T>(validatedData: ZodSafeParseResult<T>): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  validatedData?.error?.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  });

  return fieldErrors;
}
