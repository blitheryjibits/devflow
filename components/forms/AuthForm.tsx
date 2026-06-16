// /components/forms/AuthForm.tsx
"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, Controller } from "react-hook-form";
import { z, ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import ROUTES from "@/constants/route";

/**
 * This form was made as a generic type form so it can dynamically handle both
 * sign-in and sign-up forms to avoid repetition.
 */

//  defines the values to be used in the RHF.
interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ schema, defaultValues, formType, onSubmit }: AuthFormProps<T>) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: standardSchemaResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    // TODO: Authenticate User
    const sentData = await onSubmit(data);
    console.log(sentData);
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-10 space-y-6">
      <FieldGroup>
        {Object.keys(defaultValues).map((field) => (
          <Controller
            key={field}
            name={field as Path<T>}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="font-inter">
                  {field.name === "email" ? "Email Address" : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  required
                  aria-invalid={fieldState.invalid}
                  type={field.name === "password" ? "password" : "text"}
                  className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-8 border"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}
      </FieldGroup>
      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="primary-gradient paragraph-medium rounded-2 font-inter text-light-900 min-h-12 w-full px-4 py-3 hover:cursor-pointer"
      >
        {form.formState.isSubmitting ? (buttonText === "Sign In" ? "Signing In..." : "Signing Up...") : buttonText}
      </Button>

      {formType === "SIGN_IN" ? (
        <p>
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.SIGN_UP} className="paragraph-semibold primary-text-gradient">
            Sign up
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <Link href={ROUTES.SIGN_IN} className="paragraph-semibold primary-text-gradient">
            Sign in
          </Link>
        </p>
      )}
    </form>
  );
};

export default AuthForm;
