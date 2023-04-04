import { useContext } from 'react';
import { UserContext } from '@/lib/UserContext';
import { magic } from '@/lib/magic';
import { useRouter } from 'next/router';
import { Paywall } from '@unlock-protocol/paywall'
import networks from '@unlock-protocol/networks'


export default function Dashboard() {
  const [user, setUser] = useContext(UserContext);
  // Create our router
  const router = useRouter();

  const logout = () => {
    // Call Magic's logout method, reset the user state, and route to the login page
    magic.user.logout().then(() => {
      setUser({ user: null });
      router.push('/login');
    });
  };

  const checkout = async () => {
    const paywallConfig = {
      "icon": "https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-logo.png",
      "locks": {
        "0x0f1ddcacda9e9a8ebc18990b457286c0f2c55ded": {
          "network": 5,
        }
      },
      "skipRecipient": true,
      "title": "Coinbase Membership Demo",
    }
    const paywall = new Paywall(paywallConfig, networks, magic.rpcProvider)
    paywall.loadCheckoutModal()

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
