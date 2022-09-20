import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IoTicketOutline as TicketIcon } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QRCodeDrop } from "../components/QRCodeDrop";
import { useUser } from "../hooks/useUser";
import { getAllMemberships, getLock, loginURL } from "../utils/unlock";
import { Navigation } from "../components/Navigation";

export function Home() {
  const { user } = useUser();
  const client = useQueryClient();
  const navigate = useNavigate();

  const { isLoading: isMembershipsLoading, data: memberships } = useQuery(
    [user],
    async () => {
      if (user) {
        const memberships = await getAllMemberships(user.address);
        const result = await Promise.all(
          memberships.map(async (item) => {
            const lock = await client.fetchQuery(
              [item.lock, item.network],
              () => {
                return getLock(item.lock, item.network);
              }
            );
            return {
              ...item,
              lockName: lock.name,
            };
          })
        );
        return result;
      }
    },
    {
      enabled: !!user,
    }
  );

  const login = loginURL();

  return (
    <div>
      <Navigation />
      <div className="max-w-screen-sm mx-auto w-full pt-12 px-6 pb-6">
        <header className="space-y-2">
          <div className="flex items-center gap-4">
            <TicketIcon size={42} />
            <h1 className="font-bold text-3xl"> Ticket Chat </h1>
          </div>
          <p className="text-lg text-zinc-600">
            Drop your Unlock ticket QR code and chat with others on the same
            event.
          </p>
        </header>
        <main>
          <div>
            <QRCodeDrop />
            {user && !isMembershipsLoading ? (
              <div className="p-2 mt-6">
                <h3 className="p-2 font-medium"> Your membership chatrooms </h3>
                <div className="max-h-72 p-2 overflow-y-scroll space-y-2">
                  {memberships &&
                    memberships.map((item) => (
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          navigate(`/rooms/${item.lock}`);
                        }}
                        className="rounded-xl block text-left truncate px-4 py-2 hover:bg-zinc-50 shadow w-full bg-white"
                        key={item.tokenId}
                      >
                        <div className="font-medium">{item.lockName}</div>
                        <div className="text-sm text-zinc-500 truncate">
                          {item.lock}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6 justify-center flex flex-col">
                <div className="text-center text-zinc-500"> OR </div>
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    window.location.assign(login);
                  }}
                  className="bg-brand-ui-primary text-white px-4 py-2 rounded-full font-bold hover:bg-brand-ui-secondary transition-all duration-150"
                >
                  Login using Wallet
                </button>
              </div>
            )}
          </div>
        </main>
        <footer className="flex w-full justify-center p-6 font-medium">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://unlock-protocol.com"
          >
            {" "}
            Powered by Unlock Protocol{" "}
          </a>
        </footer>
      </div>
    </div>
  );
}
