"use client";

import { useEffect, useRef, useState } from "react";
import { getRoom, getUser, joinRoom } from "./actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoomUsers } from "./actions";
import { RoomUsers } from "./RoomUsers";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

const ROOM_REFRESH_INTERVAL = 2000;

export default function Page({ params }: { params: { roomId: string } }) {
  const currentUserQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const usersQuery = useQuery({
    queryKey: ["room-users", { roomId: params.roomId }],
    queryFn: () => getRoomUsers({ roomId: params.roomId }),
    refetchInterval: ROOM_REFRESH_INTERVAL,
  });

  const roomQuery = useQuery({
    queryKey: ["room", { roomId: params.roomId }],
    queryFn: () => getRoom({ roomId: params.roomId }),
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

  const router = useRouter();

  if (usersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const isCreator =
    roomQuery.data?.creatorId &&
    roomQuery.data?.creatorId === currentUserQuery.data?.id;

  const creatorUser = usersQuery.data?.find(
    (user) => user.id === roomQuery.data?.creatorId,
  );

  return (
    <main className="flex h-screen w-1/2 flex-col justify-start">
      <div className="flex items-end justify-between pb-10 pt-10">
        <div>
          <Label htmlFor="username">your player name:</Label>
          <Input
            id="username"
            type="text"
            maxLength={40}
            className="w-52"
            defaultValue={currentUserQuery.data?.name}
            onChange={(e) => {
              if (!e.target.value) return;
              const username = e.target.value;
              clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => {
                joinRoomMutation.mutate(username);
              }, 200);
            }}
          />
        </div>
        {isCreator && (
          <Button
            disabled={Number(usersQuery.data?.length) <= 1}
            onClick={() => {
              router.push(`/room/${params.roomId}/game`);
            }}
          >
            start game
          </Button>
        )}
        {!isCreator && (
          <Button disabled>
            {`wait for "${creatorUser?.name ?? "creator"}" to start the game`}
          </Button>
        )}
      </div>
      <RoomUsers
        currentUserId={currentUserQuery.data?.id}
        users={usersQuery.data ?? []}
      />
    </main>
  );
}
