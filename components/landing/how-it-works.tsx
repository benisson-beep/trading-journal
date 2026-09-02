const STEPS = [
  {
    number: "01",
    title: "Log your trade",
    description: "Record the important details of every position as you take it.",
  },
  {
    number: "02",
    title: "Review your performance",
    description: "Use analytics and charts to understand what is actually working.",
  },
  {
    number: "03",
    title: "Improve your process",
    description: "Identify patterns and make better decisions over time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-12 max-w-xl">
        <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
        <p className="mt-3 text-muted-foreground">
          Three steps, repeated every day you trade.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <div key={step.number} className="relative">
            <span className="font-mono text-4xl font-bold text-primary/30">
              {step.number}
            </span>
            <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {step.description}
            </p>
            {index < STEPS.length - 1 && (
              <div className="mt-8 hidden h-px w-full bg-border sm:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}