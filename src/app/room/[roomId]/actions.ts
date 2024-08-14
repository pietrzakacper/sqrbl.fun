"use server";

import { cookies } from "next/headers";
import { db } from "~/server/db";

export async function joinRoom({ roomId }: { roomId: string }) {
  const userId = cookies().get("userId")?.value;

  if (!userId) {
    throw new Error("User not found");
  }

  await db.roomUser.upsert({
    create: {
      roomId,
      userId,
    },
    update: {},
    where: {
      roomId_userId: { roomId, userId },
    },
  });

  const room = await getRoomWithUsers({ roomId });

  return {
    room,
    currentUserId: userId,
  };
}

export async function getRoomWithUsers({ roomId }: { roomId: string }) {
  return db.room.findFirstOrThrow({
    where: { id: roomId },
    include: { users: true },
  });
}

export type RoomUsers = Awaited<ReturnType<typeof getRoomWithUsers>>["users"];
