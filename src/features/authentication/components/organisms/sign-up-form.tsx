"use client";

import { signInWithGithub, signUpWithEmail } from "@/features/authentication/applications/auth.action";
import { SocialButton } from "@/features/authentication/components/atoms/social-button";
import { AuthField } from "@/features/authentication/components/molecules/auth-field";
import { signUpSchema, SignUpSchema } from "@/features/authentication/types/auth.schema";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { GitHubIcon, GoogleIcon } from "@neondatabase/auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpSchema) => {
    try {
      const result = await signUpWithEmail(values);
      if (!result.success) {
        toast.error(result.error);
      } else if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleGithubSignUp = async () => {
    try {
      const result = await signInWithGithub();
      if (!result.success) {
        toast.error(result.error);
      } else if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch (err) {
      toast.error("Failed to sign up with GitHub.");
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <AuthField
            id="name"
            label="Full Name"
            placeholder="John Doe"
            type="text"
            disabled={isSubmitting}
            error={errors.name}
            {...register("name")}
          />
          <AuthField
            id="email"
            label="Email"
            placeholder="name@example.com"
            type="email"
            disabled={isSubmitting}
            error={errors.email}
            {...register("email")}
          />
          <AuthField
            id="password"
            label="Password"
            type="password"
            disabled={isSubmitting}
            error={errors.password}
            {...register("password")}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <SocialButton
        disabled
        onClick={() => { }}
      >
        <GitHubIcon />
        Coming soon
      </SocialButton>
      <SocialButton
        disabled
        onClick={() => { }}
      >
        <GoogleIcon />
        Coming soon
      </SocialButton>
    </div>
  );
}
