import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div>
      <p className="text-gray-400">Welcome, {session?.user?.name}</p>
    </div>
  );
}