// /components/forms/AuthForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Controller,
	type DefaultValues,
	type FieldValues,
	type Path,
	type Resolver,
	type SubmitHandler,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/route";

/**
 * This form was made as a generic type form so it can dynamically handle both
 * sign-in and sign-up forms to avoid repetition.
 */

//  defines the values to be used in the RHF.
interface AuthFormProps<T extends FieldValues> {
	schema: ZodType<T, FieldValues>;
	defaultValues: T;
	onSubmit: (data: T) => Promise<ActionResponse>;
	formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
	schema,
	defaultValues,
	formType,
	onSubmit,
}: AuthFormProps<T>) => {
	const router = useRouter();
	const form = useForm<T>({
		// zodResolver has a wide resolver type; cast to the specific generic Resolver<T> to satisfy TS
		resolver: zodResolver(schema) as Resolver<T>,
		defaultValues: defaultValues as DefaultValues<T>,
	});

	const handleSubmit: SubmitHandler<T> = async (data) => {
		// TODO: Authenticate User
		const result = await onSubmit(data);

		if (result?.success) {
			toast.success(
				formType === "SIGN_IN" ? "Sign in successful" : "Sign up successful",
			);
			router.push(`${ROUTES.HOME}`);
		} else {
			toast.error(result?.error?.message);
		}
	};

	const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

	return (
		<form
			onSubmit={form.handleSubmit(handleSubmit)}
			className="mt-10 space-y-6"
		>
			<FieldGroup>
				{Object.keys(defaultValues).map((field) => (
					<Controller
						key={field}
						name={field as Path<T>}
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name} className="font-inter">
									{field.name === "email"
										? "Email Address"
										: field.name.charAt(0).toUpperCase() + field.name.slice(1)}
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									required
									aria-invalid={fieldState.invalid}
									type={field.name === "password" ? "password" : "text"}
									className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-8 border"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
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
				{form.formState.isSubmitting
					? buttonText === "Sign In"
						? "Signing In..."
						: "Signing Up..."
					: buttonText}
			</Button>

			{formType === "SIGN_IN" ? (
				<p>
					Don&apos;t have an account?{" "}
					<Link
						href={ROUTES.SIGN_UP}
						className="paragraph-semibold primary-text-gradient"
					>
						Sign up
					</Link>
				</p>
			) : (
				<p>
					Already have an account?{" "}
					<Link
						href={ROUTES.SIGN_IN}
						className="paragraph-semibold primary-text-gradient"
					>
						Sign in
					</Link>
				</p>
			)}
		</form>
	);
};

export default AuthForm;
