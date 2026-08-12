// /components/forms/AuthForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { createAnswer } from "@/lib/actions/answer.action";
import { AnswerSchema } from "@/lib/validations";

const Editor = dynamic(() => import("@/components/editor/Index"), {
	// Make sure we turn SSR off
	ssr: false,
});

const AnswerForm = ({ questionId }: { questionId: string }) => {
	const editorRef = useRef<MDXEditorMethods>(null);
	const [isAnswering, startAnsweringTransition] = useTransition();
	const [isAiSubmitting, setAiIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof AnswerSchema>>({
		// zodResolver has a wide resolver type; cast to the specific generic Resolver<T> to satisfy TS
		resolver: zodResolver(AnswerSchema),
		defaultValues: {
			content: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
		startAnsweringTransition(async () => {
			const result = await createAnswer({
				questionId,
				content: values.content,
			});

			if (result.success) {
				form.reset();

				toast.success("Your Answer was posted successfully");
			} else {
				toast.error(result.error?.message);
			}
		});
	};

	return (
		<div>
			<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
				<h4 className="paragraph-semibold text-dark400_light800">
					Write Your Answer Here
				</h4>
				<Button
					className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
					disabled={isAiSubmitting}
				>
					{isAiSubmitting ? (
						<>
							<ReloadIcon className="mr-2 size-4 animate-spin" />
							Generating...
						</>
					) : (
						<>
							<Image
								src="/icons/stars.svg"
								alt="Generate AI Answer"
								height={12}
								width={12}
								className=" object-contain"
							/>
							Generate AI Answer
						</>
					)}
				</Button>
			</div>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="mt-10 space-y-6"
			>
				<FieldGroup>
					<Controller
						// key={field}
						name={"content"}
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name} className="font-inter">
									Answer Form
								</FieldLabel>

								<Editor
									value={field.value}
									fieldChange={field.onChange}
									editorRef={editorRef}
								/>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={isAnswering}
						className="primary-gradient w-fit"
					>
						{isAnswering ? (
							<ReloadIcon className="mr-2 size-4 animate-spin" />
						) : (
							"Post Answer"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AnswerForm;
