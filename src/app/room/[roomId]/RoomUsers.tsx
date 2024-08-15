"use client";

import clsx from "clsx";
import type { RoomUsers } from "./actions";

export function RoomUsers({
  currentUserId,
  users,
}: {
  currentUserId?: string;
  users: RoomUsers;
}) {
  return (
    <>
      <div>Users:</div>
      <ul className="flex flex-wrap gap-4">
        {users
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .map((user) => (
            <li
              key={user.id}
              className={clsx(
                user.id === currentUserId ? "bg-red-200" : "bg-slate-300",
                "flex h-20 w-20 items-center justify-center rounded-lg p-4",
              )}
            >
              {user.name}
            </li>
          ))}
      </ul>
    </>
  );
}
