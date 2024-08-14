import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api } from "~/trpc/react";
import { createRoom } from "./create-room";

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <form action={createRoom}>
          <button className="bg-white text-black p-4">Create new room</button>
        </form>
      </main>
  );
}
