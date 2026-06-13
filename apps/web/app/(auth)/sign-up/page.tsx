import type { Route } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { signUpAction } from "@/src/application/auth/actions";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <AuthForm
      action={signUpAction}
      description="Create your RideFlow account to start planning together."
      error={params.error}
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-medium text-sky-700" href={"/sign-in" as Route}>
            Sign in
          </Link>
        </>
      }
      next={params.next}
      submitLabel="Create account"
      title="Sign up"
    />
  );
}
