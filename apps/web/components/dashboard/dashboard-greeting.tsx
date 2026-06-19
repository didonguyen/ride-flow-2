type DashboardGreetingProps = {
  greeting: string;
  subtitle: string;
};

export function DashboardGreeting({ greeting, subtitle }: DashboardGreetingProps) {
  return (
    <header className="flex flex-col gap-2" data-testid="dashboard-greeting">
      <h1 className="font-display text-4xl text-ink-950 sm:text-5xl">{greeting}</h1>
      <p className="text-base text-ink-700 sm:text-lg">{subtitle}</p>
    </header>
  );
}
