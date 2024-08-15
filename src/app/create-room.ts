"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export const createRoom = async () => {
  const userId = cookies().get("userId")?.value;

  if (!userId) {
    throw new Error("User not found");
  }

  await db.user.upsert({
    where: { id: userId },
    create: { id: userId, name: "" },
    update: {},
  });

  const createdRoom = await db.room.create({
    data: {
      creatorId: userId,
    },
  });

  redirect(`/room/${createdRoom.id}`);
};
