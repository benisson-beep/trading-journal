"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function saveScreenshot(userId: string, tradeId: string, formData: FormData) {
  const file = formData.get("screenshot") as File | null;
  if (!file || file.size === 0) return; // no screenshot selected — skip silently

  const buffer = Buffer.from(await file.arrayBuffer());
  const storagePath = `${userId}/${tradeId}-${file.name}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("trade-screenshots")
    .upload(storagePath, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  await prisma.trade.update({
    where: { id: tradeId },
    data: { screenshotPath: storagePath },
  });
}

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

  const newTrade = await prisma.trade.create({
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
      notes: formData.get("notes") as string,
      tags: {
        connect: tagIds.map((id) => ({ id })),
      },
    },
  });

  await saveScreenshot(user.id, newTrade.id, formData);

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
      notes: formData.get("notes") as string,
      tags: {
        set: [],
        connect: tagIds.map((id) => ({ id })),
      },
    },
  });

  await saveScreenshot(user.id, tradeId, formData);

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

export async function uploadScreenshot(tradeId: string, formData: FormData) {
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

  const trade = await prisma.trade.findFirst({
    where: { id: tradeId, userId: user.id },
  });
  if (!trade) {
    throw new Error("Trade not found");
  }

  await saveScreenshot(user.id, tradeId, formData);

  revalidatePath("/dashboard/trades");
  revalidatePath(`/dashboard/trades/${tradeId}/edit`);
}