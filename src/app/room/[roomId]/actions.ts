"use server";

import { cookies } from "next/headers";
import { db } from "~/server/db";

export async function joinRoom({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}) {
  const userId = cookies().get("userId")?.value;

  if (!userId) {
    throw new Error("User not found");
  }

  await db.user.upsert({
    create: {
      id: userId,
      name: username,
    },
    update: {
      name: username,
    },
    where: {
      id: userId,
    },
  });

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

  return {
    currentUserId: userId,
  };
}

export async function getRoomUsers({ roomId }: { roomId: string }) {
  return db.user.findMany({ where: { rooms: { some: { roomId } } } });
}

export async function getRoom({ roomId }: { roomId: string }) {
  return db.room.findFirst({ where: { id: roomId } });
}

export async function getUser() {
  const userId = cookies().get("userId")?.value;

  if (!userId) {
    throw new Error("User not found");
  }

  const existingUser = await db.user.findFirst({ where: { id: userId } });

  return existingUser ?? { id: userId, name: "", date: new Date() };
}

export type RoomUsers = Awaited<ReturnType<typeof getRoomUsers>>;
export type User = Awaited<ReturnType<typeof getUser>>;
