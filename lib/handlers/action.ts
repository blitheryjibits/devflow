"use server";

import type { Session } from "next-auth";
import { ZodError, type ZodSchema } from "zod/v3";
import { auth } from "@/auth";
import { NotAuthorizedError, ValidationError } from "@/lib/https-errors";
import dbConnect from "@/lib/mongoose";

type ActionOptions<T> = {
	params?: T;
	schema?: ZodSchema<T>;
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
				return new ValidationError(
					error.flatten().fieldErrors as Record<string, string[]>,
				);
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
