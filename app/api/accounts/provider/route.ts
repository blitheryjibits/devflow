import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/https-errors";
import { flatten } from "@/lib/handlers/flattenValidationError";
import { AccountSchema } from "@/lib/vallidations";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();

  try {
    await dbConnect();

    const validatedData = AccountSchema.partial().safeParse({ providerAccountId });
    if (!validatedData.success) {
      const fieldErrors = flatten(validatedData);
      throw new ValidationError(fieldErrors);
    }

    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
