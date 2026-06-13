import type { Route } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { signInAction } from "@/src/application/auth/actions";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <AuthForm
      action={signInAction}
      description="Use your RideFlow account to continue planning trips."
      error={params.error}
      footer={
        <>
          Need an account?{" "}
          <Link className="font-medium text-sky-700" href={"/sign-up" as Route}>
            Sign up
          </Link>
        </>
      }
      next={params.next}
      submitLabel="Sign in"
      title="Sign in"
    />
  );
}
