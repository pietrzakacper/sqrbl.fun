"use client";

import { useEffect, useRef, useState } from "react";
import { getUser, joinRoom } from "./actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoomUsers } from "./actions";
import { RoomUsers } from "./RoomUsers";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const ROOM_REFRESH_INTERVAL = 2000;

export default function Page({ params }: { params: { roomId: string } }) {
  const currentUserQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

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

  const [userAutoAdded, setUserAutoAdded] = useState(false);

  useEffect(() => {
    if (userAutoAdded) return;
    if (!currentUserQuery.data || currentUserQuery.isLoading) return;
    if (!usersQuery.data || usersQuery.isLoading) return;
    if (usersQuery.data.find((u) => u.id === currentUserQuery.data?.id)) return;

    if (currentUserQuery.data.name) {
      setUserAutoAdded(true);
      joinRoomMutation.mutate(currentUserQuery.data.name);
    }
  }, [currentUserQuery, usersQuery, joinRoomMutation, userAutoAdded]);

  const timeoutRef = useRef<NodeJS.Timeout>();

  if (usersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex h-screen w-1/2 flex-col justify-start">
      <div className="pb-10 pt-10">
        <Label htmlFor="username">your player name:</Label>
        <Input
          id="username"
          type="text"
          maxLength={40}
          className="w-52"
          defaultValue={currentUserQuery.data?.name}
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
        currentUserId={currentUserQuery.data?.id}
        users={usersQuery.data ?? []}
      />
    </main>
  );
}
