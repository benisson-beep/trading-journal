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

  const tagInput = formData.get("tags") as string;
  const tagNames = tagInput ? tagInput.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const tagIds = await getOrCreateTags(user.id, tagNames);

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
      tags: {
        connect: tagIds.map((id) => ({ id })),
      },
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

  const existingTrade = await prisma.trade.findFirst({
    where: { id: tradeId, userId: user.id },
  });
  if (!existingTrade) {
    throw new Error("Trade not found or not authorized");
  }

  const tagInput = formData.get("tags") as string;
  const tagNames = tagInput ? tagInput.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const tagIds = await getOrCreateTags(user.id, tagNames);

  await prisma.trade.update({
    where: { id: tradeId },
    data: {
      symbol: formData.get("symbol") as string,
      direction: formData.get("direction") as "LONG" | "SHORT",
      entryPrice: formData.get("entryPrice") as string,
      exitPrice: formData.get("exitPrice") as string,
      quantity: formData.get("quantity") as string,
      contractSize: formData.get("contractSize") as string,
      fees: formData.get("fees") as string,
      date: new Date(formData.get("date") as string),
      tags: {
        set: [],
        connect: tagIds.map((id) => ({ id })),
      },
    },
  });

  redirect("/dashboard/trades");
}

export async function getOrCreateTags(userId: string, tagNames: string[]) {
  const tagIds: string[] = [];

  for (const name of tagNames) {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) continue;

    const tag = await prisma.tag.upsert({
      where: { userId_name: { userId, name: trimmed } },
      update: {},
      create: { userId, name: trimmed },
    });

    tagIds.push(tag.id);
  }

  return tagIds;
}

export async function getUserTags(userId: string) {
  return prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

updateTrade