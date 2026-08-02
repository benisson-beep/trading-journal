import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4">
      <h1 className="text-4xl font-bold">Trading Journal</h1>
      <p className="text-gray-400">Your dashboard starts here.</p>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button type="submit">Sign in with Google</Button>
      </form>
    </main>
  );
}