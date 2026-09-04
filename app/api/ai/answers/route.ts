// import { google } from "@ai-sdk/google";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import handeError from "@/lib/handlers/error";
import { flatten } from "@/lib/handlers/flattenValidationError";
import { ValidationError } from "@/lib/https-errors";
import { AIAnswerSchema } from "@/lib/validations";

export async function POST(req: Request) {
	const { question, content, userAnswer } = await req.json();
	const google = createGoogleGenerativeAI({
		apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
	});

	try {
		const validatedData = AIAnswerSchema.safeParse({
			question,
			content,
			userAnswer,
		});

		if (!validatedData.success) {
			const fieldErrors = flatten(validatedData);
			throw new ValidationError(fieldErrors);
		}

		const { text } = await generateText({
			model: google("gemini-3.5-flash-lite"),
			prompt: `Generate a markdown-formatted response to the following question: ${question}.
            Consider the provided context: **Context:** ${content}
            Also, prioritize and incorporate the user's answer when formulating your response: **User's Answer:** ${userAnswer}
            Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point. Provide the final answer in markdown format.`,
			system: `You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary.
                For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).`,
		});

		return NextResponse.json({ success: true, data: text }, { status: 200 });
	} catch (error) {
		return handeError(error, "api") as APIErrorResponse;
	}
}
