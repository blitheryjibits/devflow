"use server";

import mongoose from "mongoose";
import Question from "@/database/question.model";
import Tag, { type ITagDoc } from "@/database/Tag.model";
import TagQuestion from "@/database/Tag-Question.model";
import User from "@/database/user.model";
import action from "@/lib/handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../https-errors";
import {
	AskQuestionSchema,
	EditQuestionSchema,
	GetQuestionSchema,
} from "../validations";

export async function createQuestion(
	params: CreateQuestionParams,
): Promise<ActionResponse<Question>> {
	const validationResult = await action({
		params,
		schema: AskQuestionSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { title, content, tags } = validationResult.params!;
	const userId = validationResult?.session?.user?.id;
	const session = await mongoose.startSession();

	session.startTransaction();

	try {
		const [question] = await Question.create(
			[{ title, content, author: userId }],
			{ session },
		);

		if (!question) {
			throw new Error("Failed to create question");
		}

		const tagIds: mongoose.Types.ObjectId[] = [];
		const tagQuestionDocuments: {
			tag: mongoose.Types.ObjectId;
			question: mongoose.Types.ObjectId;
		}[] = [];

		for (const tag of tags) {
			const existingTag = await Tag.findOneAndUpdate(
				{ name: { $regex: new RegExp(`^${tag}$`, "i") } },
				{ $setOnInsert: { name: tag }, $inc: { questions: 1 } },
				{ upsert: true, returnDocument: "after", session },
			);

			tagIds.push(existingTag._id);
			tagQuestionDocuments.push({
				tag: existingTag._id,
				question: question._id,
			});
		}

		await TagQuestion.insertMany(tagQuestionDocuments, { session });

		await Question.findByIdAndUpdate(
			question._id,
			{ tags: tagIds },
			{ session },
		);

		await session.commitTransaction();
		return { success: true, data: JSON.parse(JSON.stringify(question)) };
	} catch (error) {
		await session.abortTransaction();
		return handleError(error) as ErrorResponse;
	} finally {
		session.endSession();
	}
}

export async function editQuestion(
	params: EditQuestionParams,
): Promise<ActionResponse<Question>> {
	const validationResult = await action({
		params,
		schema: EditQuestionSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { title, content, tags, questionId } = validationResult.params!;
	const userId = validationResult?.session?.user?.id;
	const session = await mongoose.startSession();

	session.startTransaction();

	try {
		const question = await Question.findById(questionId).populate("tags");

		if (!question) {
			throw new NotFoundError("Question");
		}
		if (question.author.toString() !== userId) {
			throw new Error("Not authorized to edit this question");
		}

		if (question.title !== title || question.content !== content) {
			question.title = title;
			question.content = content;
			await question.save({ session });
		}

		const existingTagNames = question.tags.map((tag: ITagDoc) =>
			tag.name.toLowerCase(),
		);

		const tagsToAdd = tags.filter(
			(tag) => !existingTagNames.includes(tag.toLowerCase()),
		);

		const tagsToRemove = question.tags.filter(
			(tag: ITagDoc) => !tags.includes(tag.name.toLowerCase()),
		);
		const newTagDocs = [];

		if (tagsToAdd.length > 0) {
			for (const tag of tagsToAdd) {
				const existingTag = await Tag.findOneAndUpdate(
					{ name: { $regex: new RegExp(`^${tag}$`, "i") } },
					{ $setOnInsert: { name: tag }, $inc: { questions: 1 } },
					{ upsert: true, returnDocument: "after", session },
				);

				if (existingTag) {
					newTagDocs.push({
						tag: existingTag._id,
						question: questionId,
					});
				}

				question.tags.push(existingTag._id);
			}
		}

		if (tagsToRemove.length > 0) {
			const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);
			await Tag.updateMany(
				{ _id: { $in: tagIdsToRemove } },
				{ $inc: { questions: -1 } },
				{ session },
			);
		}

		await TagQuestion.deleteMany(
			{
				question: questionId,
				tag: { $in: tagsToRemove.map((tag: ITagDoc) => tag._id) },
			},
			{ session },
		);

		question.tags = question.tags.filter(
			(tagId: mongoose.Types.ObjectId) => !tagsToRemove.includes(tagId),
		);

		if (newTagDocs.length > 0) {
			await TagQuestion.insertMany(newTagDocs, { session });
		}

		await question.save({ session });
		await session.commitTransaction();
		return { success: true, data: JSON.parse(JSON.stringify(question)) };
	} catch (error) {
		await session.abortTransaction();
		return handleError(error) as ErrorResponse;
	} finally {
		session.endSession();
	}
}

export async function getQuestion(
	params: getQuestionsParams,
): Promise<ActionResponse<Question>> {
	const validationResult = await action({
		params,
		schema: GetQuestionSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { questionId } = validationResult.params!;

	try {
		const question = await Question.findById(questionId).populate("tags");

		if (!question) {
			throw new NotFoundError("Question");
		}
		return { success: true, data: JSON.parse(JSON.stringify(question)) };
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}
