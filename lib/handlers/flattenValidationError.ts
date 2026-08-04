import type { ZodSafeParseResult } from "zod";
import { ZodError, type z } from "zod";

export function flatten<T>(
	validatedData: ZodSafeParseResult<T> | ZodError<T>,
): Record<string, string[]> {
	const fieldErrors: Record<string, string[]> = {};
	let issues: z.core.$ZodIssue[] | undefined;

	if (validatedData instanceof ZodError) {
		issues = validatedData.issues;
	} else {
		issues = validatedData.error?.issues;
	}

	issues?.forEach((issue) => {
		const path = issue.path.join(".");
		if (!fieldErrors[path]) {
			fieldErrors[path] = [];
		}
		fieldErrors[path].push(issue.message);
	});

	return fieldErrors;
}
