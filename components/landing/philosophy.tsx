import { Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";

const PRINCIPLES = [
  {
    icon: TrendingUp,
    title: "Data over emotion",
    description: "Let your actual numbers guide your next decision, not your last trade.",
  },
  {
    icon: CheckCircle2,
    title: "Patterns over noise",
    description: "Spot what's really driving your results across setups and sessions.",
  },
  {
    icon: Sparkles,
    title: "Process over outcome",
    description: "A single winning trade means less than a repeatable process.",
  },
];

export function Philosophy() {
  return (
    <section className="border-y border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Don&apos;t just record trades.
            <br />
            Learn from them.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            A spreadsheet tells you what happened. Trading Journal turns
            historical trade data into feedback you can actually act on —
            so every trade makes the next one a little sharper.
          </p>
        </div>

        <div className="space-y-4">
          {PRINCIPLES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}