import { NextResponse } from "next/server";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { flatten } from "@/lib/handlers/flattenValidationError";
import { NotFoundError, ValidationError } from "@/lib/https-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

export async function POST(request: Request) {
	const { email } = await request.json();

	try {
		const validatedData = UserSchema.partial().safeParse({ email });
		if (!validatedData.success) {
			const fieldErrors = flatten(validatedData);
			throw new ValidationError(fieldErrors);
		}

		await dbConnect();
		const user = await User.findOne({ email });
		if (!user) throw new NotFoundError("User");

		return NextResponse.json({ success: true, data: user }, { status: 200 });
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse;
	}
}
