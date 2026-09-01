import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/login-card";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  async function handleGoogleSignIn() {
    "use server";
    await signIn("google");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      {/* Subtle background texture, not a flat black screen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--primary), transparent 92%), transparent 45%), radial-gradient(circle at 80% 70%, color-mix(in oklch, var(--primary), transparent 94%), transparent 50%)",
        }}
      />

      <div className="relative z-10 mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Trading Journal</h2>
        <p className="mt- max-w-sm text-sm text-muted-foreground">
          Track your trades. Understand your performance. Improve your edge.
        </p>
      </div>

      <div className="relative z-10">
        <LoginCard onGoogleSignIn={handleGoogleSignIn} />
      </div>
    </main>
  );
}