import { Button } from "~/components/ui/button";
import { createRoom } from "./create-room";

export default function Home() {
  return (
    <main className="">
      <form action={createRoom}>
        <Button type="submit">create new game</Button>
      </form>
    </main>
  );
}
