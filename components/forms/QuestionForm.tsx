"use client";

import { AskQuestionSchema } from "@/lib/vallidations";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const QuestionForm = () => {
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const handleCreateQuestion = (data: any) => {
    console.log(data);
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
                {...field}
                id={field.name}
                required
                aria-invalid={fieldState.invalid}
                className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-8 border"
                placeholder="Add tags..."
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            <div className="text-muted-foreground mt-1.5 text-sm">Add up to 3 tags</div>
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
