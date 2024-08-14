import { joinRoom } from "./actions";
import { RoomUsers } from "./RoomUsers";

export default async function Page({ params }: { params: { roomId: string } }) {
  const {
    room: { users },
    currentUserId,
  } = await joinRoom({ roomId: params.roomId });

  return (
    <>
      <div>Room</div>
      <RoomUsers
        roomId={params.roomId}
        currentUserId={currentUserId}
        users={users}
      />
    </>
  );
}
