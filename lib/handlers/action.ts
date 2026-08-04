"use server";

import type { Session } from "next-auth";
import { ZodError, type ZodType } from "zod";
import { auth } from "@/auth";
import { NotAuthorizedError, ValidationError } from "@/lib/https-errors";
import dbConnect from "@/lib/mongoose";
import { flatten } from "./flattenValidationError";

type ActionOptions<T> = {
	params?: T;
	schema?: ZodType<T>;
	authorize?: boolean;
};

async function action<T>({
	params,
	schema,
	authorize = false,
}: ActionOptions<T>) {
	if (schema && params) {
		try {
			schema.parse(params);
		} catch (error) {
			if (error instanceof ZodError) {
				const fieldErrors = flatten(error);
				return new ValidationError(fieldErrors);
			} else {
				return new Error("Schema Validation Failed");
			}
		}
	}

	let session: Session | null = null;

	if (authorize) {
		session = await auth();

		if (!session) {
			return new NotAuthorizedError();
		}
	}

	await dbConnect();

	return { params, session };
}

export default action;
