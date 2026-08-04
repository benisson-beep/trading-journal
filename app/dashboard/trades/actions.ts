"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { redirect } from "next/navigation";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function createTrade(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  await prisma.trade.create({
    data: {
      userId: user.id,
      symbol: formData.get("symbol") as string,
      direction: formData.get("direction") as "LONG" | "SHORT",
      entryPrice: formData.get("entryPrice") as string,
      exitPrice: formData.get("exitPrice") as string,
      quantity: formData.get("quantity") as string,
      contractSize: formData.get("contractSize") as string,
      fees: formData.get("fees") as string,
      date: new Date(formData.get("date") as string),
    },
  });

  redirect("/dashboard/trades");
}

export async function deleteTrade(tradeId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  await prisma.trade.deleteMany({
    where: { id: tradeId, userId: user.id },
  });

  redirect("/dashboard/trades");
}

export async function updateTrade(tradeId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  await prisma.trade.updateMany({
    where: { id: tradeId, userId: user.id },
    data: {
      symbol: formData.get("symbol") as string,
      direction: formData.get("direction") as "LONG" | "SHORT",
      entryPrice: formData.get("entryPrice") as string,
      exitPrice: formData.get("exitPrice") as string,
      quantity: formData.get("quantity") as string,
      contractSize: formData.get("contractSize") as string,
      fees: formData.get("fees") as string,
      date: new Date(formData.get("date") as string),
    },
  });

  redirect("/dashboard/trades");
}
