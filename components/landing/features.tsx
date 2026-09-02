import { BookOpen, BarChart3, TrendingUp, CalendarDays, History } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Trade Journal",
    description:
      "Log every trade with entry, exit, direction, size, fees, notes and context.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Understand win rate, profit factor, expectancy, average win/loss and more.",
  },
  {
    icon: TrendingUp,
    title: "Equity Curve",
    description: "Visualize how your trading performance develops over time.",
  },
  {
    icon: CalendarDays,
    title: "Performance Calendar",
    description: "See profitable and losing days at a glance.",
  },
  {
    icon: History,
    title: "Trade History",
    description:
      "Review previous trades and identify patterns in your execution.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-12 max-w-xl">
        <h2 className="text-3xl font-bold tracking-tight">
          Everything you need to trade with discipline
        </h2>
        <p className="mt-3 text-muted-foreground">
          A focused set of tools built around how traders actually review
          their work.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-muted-foreground/40"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}