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
      <div className="pb-4 font-semibold">all players:</div>
      <ul className="flex flex-wrap gap-4">
        {users
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .map((user) => (
            <li
              key={user.id}
              className={clsx(
                user.id === currentUserId ? "bg-violet-300" : "bg-slate-300",
                "flex h-20 w-52 items-center justify-center rounded-lg border-2 border-dashed border-black p-4",
              )}
            >
              <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {user.name}
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
