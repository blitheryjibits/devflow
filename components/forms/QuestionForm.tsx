"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { RefreshCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import Tag from "@/components/cards/TagCard";
import ROUTES from "@/constants/route";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { AskQuestionSchema } from "@/lib/validations";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface Params {
	question?: Question;
	isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit = false }: Params) => {
	const router = useRouter();
	const editorRef = useRef<MDXEditorMethods>(null);
	const [isPending, startTransition] = useTransition();

	const Editor = dynamic(() => import("@/components/editor/Index"), {
		// Make sure we turn SSR off
		ssr: false,
	});
	const form = useForm<z.infer<typeof AskQuestionSchema>>({
		resolver: zodResolver(AskQuestionSchema),
		defaultValues: {
			title: question?.title || "",
			content: question?.content || "",
			tags: question?.tags.map((tag) => tag.name) || [],
		},
	});

	const handleCreateQuestion = async (
		data: z.infer<typeof AskQuestionSchema>,
	) => {
		startTransition(async () => {
			if (isEdit && question) {
				const result = await editQuestion({
					questionId: question?._id,
					...data,
				});

				if (result.success) {
					toast.success("Question updated successfully");
				}

				if (result.data) {
					router.push(ROUTES.QUESTION(result.data._id.toString()));
				} else {
					toast.error(`Error: ${result.status}
				${result.error?.message || "Failed to update question"}`);
				}

				return; // end edit action
			}

			const result = await createQuestion(data);
			if (result.success) {
				toast.success("Question created successfully");
			}

			if (result.data) {
				router.push(ROUTES.QUESTION(result.data._id));
			} else {
				toast.error(`Error: ${result.status}
				${result.error?.message || "Failed to create question"}`);
			}
		});
	};

	const handleInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		field: { value: string[] },
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const tagInput = e.currentTarget.value.trim();
			if (tagInput && tagInput.length < 15) {
				form.setValue("tags", [...field.value, tagInput]);
				e.currentTarget.value = "";
				form.clearErrors("tags");
			} else if (tagInput.length >= 15) {
				form.setError("tags", {
					type: "manual",
					message: "Tag must be less than 15 characters",
				});
			} else if (field.value.includes(tagInput)) {
				form.setError("tags", {
					type: "manual",
					message: "Tag already exists",
				});
			}
		}
	};

	const handleTagRemove = (tag: string, field: { value: string[] }) => () => {
		const newTags = field.value.filter((t) => t !== tag);
		form.setValue("tags", newTags);

		if (newTags.length === 0) {
			form.setError("tags", {
				type: "manual",
				message: "At least 1 tag is required",
			});
		}
	};

	return (
		<form
			onSubmit={form.handleSubmit(handleCreateQuestion)}
			className="space-y-6"
		>
			{/* Question Title Field */}
			<Controller
				name="title"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel
							htmlFor={field.name}
							className="paragraph-semibold text-dark400_light800"
						>
							Question Title <span className="text-primary-500">*</span>
						</FieldLabel>
						<Input
							{...field}
							id={field.name}
							required
							aria-invalid={fieldState.invalid}
							className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-8 border"
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			{/* Question Content Field */}
			<Controller
				name="content"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel
							htmlFor={field.name}
							className="paragraph-semibold text-dark400_light800"
						>
							Question Content <span className="text-primary-500">*</span>
						</FieldLabel>
						<Editor
							value={field.value}
							fieldChange={field.onChange}
							editorRef={editorRef}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			{/* Tags Field */}
			<Controller
				name="tags"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel
							htmlFor={field.name}
							className="paragraph-semibold text-dark400_light800"
						>
							Tags <span className="text-primary-500">*</span>
						</FieldLabel>
						{/* select and option components */}
						<div>
							<Input
								id={field.name}
								aria-invalid={fieldState.invalid}
								className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-8 border"
								placeholder="Add tags..."
								onKeyDown={(e) => handleInputKeyDown(e, field)}
							/>
							{field.value.length > 0 && (
								<div className="mt-2.5 flex flex-wrap gap-2.5">
									{field?.value?.map((tag: string) => (
										<Tag
											key={tag}
											_id={tag}
											name={tag}
											compact
											remove
											isButton
											handleRemove={handleTagRemove(tag, field)}
										/>
									))}
								</div>
							)}
						</div>
						<div className="text-muted-foreground mt-1.5 text-sm">
							Add up to 3 tags
						</div>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<div className="mt-16 flex justify-end">
				<Button
					type="submit"
					disabled={isPending}
					className="primary-gradient text-light-900 w-fit"
				>
					{isPending ? (
						<>
							<RefreshCcw className="mr-2 size-4 animate-spin" />
							<span>Submitting...</span>
						</>
					) : (
						<>{isEdit ? "Edit" : "Ask a Question"}</>
					)}
				</Button>
			</div>
		</form>
	);
};

export default QuestionForm;
