import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import { magic } from "../lib/magic";
import { useRouter } from "next/router";
import { Paywall } from "@unlock-protocol/paywall";
import networks from "@unlock-protocol/networks";

export default function Dashboard() {
  const [user, setUser] = useContext(UserContext);
  // Create our router
  const router = useRouter();

  const logout = () => {
    // Call Magic's logout method, reset the user state, and route to the login page
    magic.user.logout().then(() => {
      setUser({ user: null });
      router.push("/login");
    });
  };

  const checkout = async () => {
    const paywallConfig = {
      "locks": {
        "0x6c208a3eb3150e7896124d282095f9e5fca18780": {
          "network": 5,
        }
      },
      "skipRecipient": true,
      "title": "My Membership",
    }
    const paywall = new Paywall(networks)
    await paywall.connect(magic.rpcProvider)
    await paywall.loadCheckoutModal(paywallConfig)
    // You can use the returned value above to get a transaction hash if needed!
    return false
  }

  return (
    <>
      {user?.issuer && (
        <>
          <h1>Dashboard</h1>
          <h2>Email</h2>
          <p>{user.email}</p>
          <h2>Wallet Address</h2>
          <p>{user.publicAddress}</p>
          <button onClick={checkout}>Checkout</button>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </>
  );
}
