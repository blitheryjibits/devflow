import type mongoose from "mongoose";
import { Question, Tag } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
	GetTagQuestionsSchema,
	PaginatedSearchParamsSchema,
} from "../validations";

export const getTags = async (
	params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> => {
	const validationResult = await action({
		params,
		schema: PaginatedSearchParamsSchema,
	});

	if (validationResult instanceof Error)
		return handleError(validationResult) as ErrorResponse;

	const { page = 1, pageSize = 10, filter, query } = params;
	const skip = (Number(page) - 1) * pageSize;
	const limit = Number(pageSize);
	const queryFilter: mongoose.QueryFilter<typeof Tag> = {};

	if (query) {
		queryFilter.$or = [
			{
				name: {
					regex: query,
					options: "i",
				},
			},
		];
	}

	let sortCriteria = {};

	switch (filter) {
		case "popular":
			sortCriteria = { questions: -1 };
			break;
		case "recent":
			sortCriteria = { createdAt: -1 };
			break;
		case "oldest":
			sortCriteria = { createdAt: 1 };
			break;
		case "name":
			sortCriteria = { name: 1 };
			break;
		default:
			sortCriteria = { questions: -1 };
			break;
	}

	try {
		const totalTags = await Tag.countDocuments();

		const tags = await Tag.find(queryFilter)
			.sort(sortCriteria)
			.skip(skip)
			.limit(limit);

		const isNext = totalTags > skip + tags.length;

		return {
			success: true,
			data: {
				tags: JSON.parse(JSON.stringify(tags)),
				isNext,
			},
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
};

export const getTagQuestions = async (
	params: getTagQuestionsParams,
): Promise<
	ActionResponse<{ tag: Tag; questions: Question[]; isNext: boolean }>
> => {
	const validationResult = await action({
		params,
		schema: GetTagQuestionsSchema,
	});

	if (validationResult instanceof Error)
		return handleError(validationResult) as ErrorResponse;

	const { tagId, page = 1, pageSize = 10, query } = params;
	const skip = (Number(page) - 1) * pageSize;
	const limit = Number(pageSize);

	try {
		const tag = await Tag.findById(tagId);
		if (!tag) throw new Error("Tag Not Found");

		const queryFilter: mongoose.QueryFilter<typeof Question> = {
			tags: { $in: [tagId] },
		};

		if (query) {
			queryFilter.title = [
				{
					regex: query,
					options: "i",
				},
			];
		}

		const totalQuestions = await Question.countDocuments(queryFilter);

		const questions = await Question.find(queryFilter)
			.select("_id title views upvotes downvotes author createdAt")
			.populate([
				{ path: "author", select: "name image" },
				{ path: "tags", select: "name" },
			])
			.skip(skip)
			.limit(limit);

		const isNext = totalQuestions > skip + questions.length;

		return {
			success: true,
			data: {
				tag: JSON.parse(JSON.stringify(tag)),
				questions: JSON.parse(JSON.stringify(questions)),
				isNext,
			},
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
};
