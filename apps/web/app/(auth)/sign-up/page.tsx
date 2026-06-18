import type { Route } from "next";
import Link from "next/link";

import { AuthPanel } from "@/components/auth/auth-panel";
import { Card, CardContent } from "@/components/ui/card";
import { signUpAction } from "@/src/application/auth/actions-server";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-10 text-slate-950 sm:px-6">
      <Card className="w-full max-w-md border-slate-200 shadow-rideflow-card" data-testid="auth-fallback-sign-up">
        <CardContent className="p-6 sm:p-8">
          <AuthPanel
            action={signUpAction}
            error={params.error}
            hideFooter
            mode="sign-up"
            next={params.next}
          />
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              className="font-semibold text-forest-700 underline-offset-4 hover:underline"
              data-testid="auth-fallback-sign-up-switch"
              href={"/sign-in" as Route}
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
