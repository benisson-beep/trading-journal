import { Button } from "@/components/ui/button";
import { signIn, signOut, auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4">
      <h1 className="text-4xl font-bold">Trading Journal</h1>

      {session?.user ? (
        <>
          <p className="text-gray-400">Signed in as {session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit">Sign out</Button>
          </form>
        </>
      ) : (
        <>
          <p className="text-gray-400">Your dashboard starts here.</p>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button type="submit">Sign in with Google</Button>
          </form>
        </>
      )}
    </main>
  );
}