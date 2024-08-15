"use client";

import { useState } from "react";
import { joinRoom } from "./actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoomUsers } from "./actions";
import { RoomUsers } from "./RoomUsers";

const ROOM_REFRESH_INTERVAL = 2000;

export default function Page({ params }: { params: { roomId: string } }) {
  const [username, setUsername] = useState("");

  const usersQuery = useQuery({
    queryKey: ["room", { roomId: params.roomId }],
    queryFn: () => getRoomUsers({ roomId: params.roomId }),
    refetchInterval: ROOM_REFRESH_INTERVAL,
  });

  const joinRoomMutation = useMutation({
    mutationKey: ["room", { roomId: params.roomId }],
    mutationFn: () => joinRoom({ roomId: params.roomId, username }),
    onSuccess: () => {
      void usersQuery.refetch();
    },
  });

  if (usersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>Room</div>
      <form onSubmit={(e) => (e.preventDefault(), joinRoomMutation.mutate())}>
        Choose your username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </form>
      <RoomUsers
        currentUserId={joinRoomMutation.data?.currentUserId}
        users={usersQuery.data ?? []}
      />
    </>
  );
}
