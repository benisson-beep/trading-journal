import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--primary), transparent 92%), transparent 45%), radial-gradient(circle at 80% 70%, color-mix(in oklch, var(--primary), transparent 94%), transparent 50%)",
        }}
      />

      <div className="relative z-10 mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Trading Journal</h2>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg shadow-black/20">
        <h1 className="text-xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you instructions to reset your
          password.
        </p>

        {/*
          TODO: No password-reset backend exists yet — this form is UI-only
          and intentionally does not submit anywhere. Wire this up once a
          credentials provider and reset-token flow exist.
        */}
        <form className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Send reset link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-foreground hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}