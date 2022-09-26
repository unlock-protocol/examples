import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const LIVEBLOCK_PUBLIC_KEY = import.meta.env.VITE_LIVEBLOCK_PUBLIC_KEY!;

const client = createClient({
  publicApiKey: LIVEBLOCK_PUBLIC_KEY,
});

export const {
  RoomProvider,
  useMyPresence,
  useOthers,
  useUpdateMyPresence,
  useList,
} = createRoomContext(client);
