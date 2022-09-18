import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import { useUser } from "~/hooks/useUser";
import { MembershipMetadata } from "~/types";

const Home: NextPage = () => {
  const { logoutUser, user } = useUser();
  const { data } =
    useSWR<{ memberships: MembershipMetadata[] }>("/api/memberships");

  const buttonClass =
    "bg-[#603DEB] text-white px-8 text-lg py-2 font-bold rounded hover:opacity-80";

  if (!user?.isLoggedIn) {
    return (
      <div className="max-w-screen-md px-6 pt-24 mx-auto">
        <header className="pb-4 space-y-4 text-center border-b-2">
          <h1 className="text-5xl font-bold">Login using NFT membership</h1>
          <p className="text-xl text-gray-700">
            You do not have valid NFT membership to access this page. Verify or
            buy membership by using the login button below.
          </p>
        </header>
        <div className="pt-8">
          <div className="flex justify-center">
            <button className={buttonClass}>
              <Link href="/api/login">Login using NFT membership</Link>{" "}
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-screen-md px-6 pt-24 mx-auto">
      <header className="pb-4 space-y-4 text-center border-b-2">
        <h1 className="text-5xl font-bold"> Your Unlock Memberships (NFTs)</h1>
        <p className="text-xl text-gray-700">
          These are all the available memberships valid to access this
          application.
        </p>
        <div className="flex justify-end gap-8">
          <button className={buttonClass} onClick={() => logoutUser()}>
            Logout
          </button>
        </div>
      </header>
      <div className="grid pt-8 sm:grid-cols-2">
        {data?.memberships.map((membership) => {
          const expiration = new Date(membership.expiration * 1000);
          return (
            <div className="p-6 bg-white rounded shadow" key={membership.id}>
              <div>
                <img
                  alt={membership.name}
                  className="w-24 rounded"
                  src={membership.image}
                />
              </div>
              <div className="pt-4 space-y-4">
                <h3 className="text-xl font-semibold"> {membership.name}</h3>
                <p className="text-gray-700"> {membership.description}</p>
                <p className="text-gray-500">
                  Valid until{" "}
                  <time dateTime={expiration.toLocaleDateString()}>
                    {expiration.toLocaleDateString()}
                  </time>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
