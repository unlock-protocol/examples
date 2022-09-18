import { LiveList } from "@liveblocks/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlockAvatar } from "../components/BlockAvatar";
import {
  RoomProvider,
  useList,
  useOthers,
  useUpdateMyPresence,
} from "../config/liveblock";
import { useUser } from "../hooks/useUser";
import { CgSpinner as LoadingIcon } from "react-icons/cg";
import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import { useParams } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllMemberships } from "../utils/unlock";

dayjs.extend(relativeTimePlugin);

export function SomeoneIsTyping() {
  const typers = useOthers()
    .toArray()
    .filter((user) => user.presence?.isTyping);

  return (
    <div>
      {!!typers.length && (
        <p>{typers.length > 1 ? "People are" : "Someone is"} typing...</p>
      )}
    </div>
  );
}

export function HowManyAreHere() {
  const others = useOthers();
  return <div>{others.count} members</div>;
}

interface ChatRoomProps {
  address: string;
}

export function ChatRoom({ address }: ChatRoomProps) {
  const updatePresence = useUpdateMyPresence();
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const messages = useList("messages") as any[] | null;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollDown = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef]);

  useEffect(() => {
    scrollDown();
  }, [scrollDown, messages?.length]);

  const walletAddress = user?.address;
  const { isLoading: isLocksLoading, data: locks } = useQuery(
    [walletAddress],
    async () => {
      if (user) {
        const memberships = await getAllMemberships(user.address);
        return memberships.map((item) => item.lock.toLowerCase());
      }
    },
    {
      enabled: !!walletAddress,
    }
  );

  const isDisabled = !locks?.includes(address.toLowerCase());

  if (messages === null) {
    return (
      <main className="mx-auto max-w-screen-md h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <LoadingIcon size={24} className="animate-spin" />
          <p> Loading chat room </p>
        </div>
      </main>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="mx-auto mt-6 max-w-screen-sm h-[90vh] flex-1 flex flex-col">
        <div
          ref={containerRef}
          className="flex h-full flex-col space-y-2 p-6 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {messages.map((message, index) => {
            const timeSince = dayjs().from(message.createdAt, true);
            return (
              <div
                className="bg-white inline-flex rounded-xl shadow-sm p-2 gap-4 items-center"
                key={index}
              >
                <BlockAvatar className="rounded-full" seed={message.address} />
                <div className="flex items-start flex-col">
                  <p>{message.text}</p>
                  <time dateTime={timeSince} className="text-zinc-400 text-xs">
                    {timeSince} ago
                  </time>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-6">
          <div className="flex px-2 pb-2 justify-between">
            <SomeoneIsTyping />
            <HowManyAreHere />
          </div>
          <input
            value={message}
            disabled={isDisabled || !user}
            className="w-full p-4 disabled:opacity-75 rounded-xl border-transparent shadow focus:ring-0 focus:border-gray-200"
            placeholder={
              user
                ? isDisabled
                  ? "You do not have valid ticket to participate"
                  : "Shitpost"
                : "You are not signed in with a valid ticket"
            }
            onChange={(e) => {
              setMessage(e.target.value);
              updatePresence({ isTyping: true });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updatePresence({ isTyping: false });
                messages.push({
                  text: message,
                  address: user?.address,
                  createdAt: Date.now(),
                });
                setMessage("");
              }
            }}
            onBlur={() => updatePresence({ isTyping: false })}
          />
        </div>
      </div>
    </div>
  );
}

export function Room() {
  const { lockAddress } = useParams<{ lockAddress: string }>();
  const roomId = lockAddress!;
  return (
    <RoomProvider
      initialStorage={{
        messages: new LiveList(),
      }}
      id={roomId}
    >
      <ChatRoom address={roomId} />
    </RoomProvider>
  );
}
