import { createRoom } from "./create-room";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <form action={createRoom}>
        <button className="bg-white p-4 text-black">Create new room</button>
      </form>
    </main>
  );
}
