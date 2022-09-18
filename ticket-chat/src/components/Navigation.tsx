import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { loginURL } from "../utils/unlock";
import { IoTicketOutline as TicketIcon } from "react-icons/io5";

export function Navigation() {
  const { user, signOut, signIn } = useUser();
  const [params] = useSearchParams();

  useEffect(() => {
    const error = params.get("error");
    const code = params.get("code");
    if (error) {
      toast.error(error);
    } else if (code) {
      const decoded = atob(code);
      const json = JSON.parse(decoded);
      const walletAddress = ethers.utils.verifyMessage(json.d, json.s);
      signIn({
        address: walletAddress,
      });
    }
  }, [params]);

  const login = loginURL();

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-screen-sm px-6 py-2 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex text-lg font-bold items-center gap-2"
        >
          <TicketIcon size={20} />
          Ticket Chat
        </Link>
        {user ? (
          <button
            onClick={(event) => {
              event.preventDefault();
              signOut();
            }}
            className="bg-brand-secondary text-white px-4 py-1 rounded-full hover:opacity-75 font-bold"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={(event) => {
              event.preventDefault();
              window.location.assign(login);
            }}
            className="bg-brand-ui-primary text-white px-4 py-1 rounded-full font-bold hover:bg-brand-ui-secondary transition-all duration-150"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
