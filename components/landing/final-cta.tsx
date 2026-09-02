import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center sm:px-12">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Your trading data already tells a story.
          <br />
          Start paying attention to it.
        </h2>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/auth/register">
            <Button size="lg" className="w-full sm:w-auto">
              Start Journaling
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}