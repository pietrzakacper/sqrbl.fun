"use client";

import { useRef } from "react";
import { joinRoom } from "./actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoomUsers } from "./actions";
import { RoomUsers } from "./RoomUsers";

const ROOM_REFRESH_INTERVAL = 2000;

export default function Page({ params }: { params: { roomId: string } }) {
  const usersQuery = useQuery({
    queryKey: ["room", { roomId: params.roomId }],
    queryFn: () => getRoomUsers({ roomId: params.roomId }),
    refetchInterval: ROOM_REFRESH_INTERVAL,
  });

  const joinRoomMutation = useMutation({
    mutationKey: ["room", { roomId: params.roomId }],
    mutationFn: (username: string) =>
      joinRoom({ roomId: params.roomId, username }),
    onSuccess: () => {
      void usersQuery.refetch();
    },
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  if (usersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex h-screen w-1/2 flex-col justify-start">
      <div className="flex justify-center p-10">
        <div>Choose your username:</div>
        <input
          type="text"
          onChange={(e) => {
            if (e.target.value === "") return;
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              joinRoomMutation.mutate(e.target.value);
            }, 200);
          }}
        />
      </div>
      <RoomUsers
        currentUserId={joinRoomMutation.data?.currentUserId}
        users={usersQuery.data ?? []}
      />
    </main>
  );
}
