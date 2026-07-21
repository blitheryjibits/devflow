import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/https-errors";
import { UserSchema } from "@/lib/vallidations";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { flatten } from "@/lib/handlers/flattenValidationError";

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
