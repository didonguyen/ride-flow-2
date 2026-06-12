import type { ReactNode } from "react";

type AuthFormProps = {
  title: string;
  description: string;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  footer: ReactNode;
  error?: string;
  next?: string;
};

export function AuthForm({
  title,
  description,
  action,
  submitLabel,
  footer,
  error,
  next
}: AuthFormProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-slate-600">{description}</p>
          </div>

          {error ? (
            <p
              className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <form action={action} className="mt-6 space-y-4">
            <input name="next" type="hidden" value={next ?? ""} />
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                autoComplete="email"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-600 transition focus:border-sky-600 focus:ring-2"
                id="email"
                name="email"
                required
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                autoComplete="current-password"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-600 transition focus:border-sky-600 focus:ring-2"
                id="password"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </div>
            <button
              className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
              type="submit"
            >
              {submitLabel}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {footer}
          </div>
        </div>
      </section>
    </main>
  );
}
