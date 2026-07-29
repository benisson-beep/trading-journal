import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4">
      <h1 className="text-4xl font-bold">Trading Journal</h1>
      <p className="text-gray-400">Your dashboard starts here.</p>
      <Button>Get Started</Button>
    </main>
  );
}