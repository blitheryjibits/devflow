"use client";

import z from "zod";
import { AskQuestionSchema } from "@/lib/vallidations";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Tag from "@/components/cards/TagCard";

import { useRef } from "react";
import { type MDXEditorMethods, type MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";

const QuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const Editor = dynamic(() => import("@/components/editor/Index"), {
    // Make sure we turn SSR off
    ssr: false,
  });
  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const handleCreateQuestion = (data: z.infer<typeof AskQuestionSchema>) => {
    console.log(data);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
    // console.log(e, field);
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();
      if (tagInput && tagInput.length < 15) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length >= 15) {
        form.setError("tags", { type: "manual", message: "Tag must be less than 15 characters" });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", { type: "manual", message: "Tag already exists" });
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
    <form onSubmit={form.handleSubmit(handleCreateQuestion)} className="space-y-6">
      {/* Question Title Field */}
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="paragraph-semibold text-dark400_light800">
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
            <FieldLabel htmlFor={field.name} className="paragraph-semibold text-dark400_light800">
              Question Content <span className="text-primary-500">*</span>
            </FieldLabel>
            <Editor value={field.value} fieldChange={field.onChange} editorRef={editorRef} />
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
            <FieldLabel htmlFor={field.name} className="paragraph-semibold text-dark400_light800">
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
            <div className="text-muted-foreground mt-1.5 text-sm">Add up to 3 tags</div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="mt-16 flex justify-end">
        <Button type="submit" className="primary-gradient text-light-900 w-fit">
          Ask Question
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
