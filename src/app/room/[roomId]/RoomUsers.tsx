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
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className={clsx(
              user.id === currentUserId ? "bg-red-200" : "bg-slate-300",
            )}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </>
  );
}
