type DashboardGreetingProps = {
  greeting: string;
  subtitle: string;
};

export function DashboardGreeting({ greeting, subtitle }: DashboardGreetingProps) {
  return (
    <header
      className="flex flex-col gap-2"
      data-testid="dashboard-greeting"
    >
      <h1
        className="font-display text-5xl text-forest-800 sm:text-6xl"
        style={{ letterSpacing: "-0.02em", lineHeight: "1.1" }}
      >
        {greeting}
      </h1>
      <p className="text-base text-ink-700 sm:text-lg">{subtitle}</p>
    </header>
  );
}
