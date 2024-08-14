"use server";

import { redirect } from "next/navigation";
import { db } from "~/server/db";

export const createRoom = async () => {
  const createdRoom = await db.room.create({
    data: {},
  });

  redirect(`/room/${createdRoom.id}`);
};
