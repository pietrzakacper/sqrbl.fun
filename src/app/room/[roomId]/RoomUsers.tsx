"use client";

import { useEffect, useState } from "react";
import { getRoomWithUsers, type RoomUsers } from "./actions";
import clsx from "clsx";

const ROOM_REFRESH_INTERVAL = 2000;

export function RoomUsers({
  users: initialUsers,
  roomId,
  currentUserId,
}: {
  users: RoomUsers;
  roomId: string;
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    const interval = setInterval(() => {
      void getRoomWithUsers({ roomId }).then((room) => {
        setUsers(room.users);
      });
    }, ROOM_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [roomId]);

  return (
    <>
      <div>Users:</div>
      <ul>
        {users.map((user) => (
          <li
            key={user.userId}
            className={clsx(
              user.userId === currentUserId ? "bg-red-200" : "bg-slate-300",
            )}
          >
            {user.userId}
          </li>
        ))}
      </ul>
    </>
  );
}
