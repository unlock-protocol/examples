import { useContext } from 'react';
import { UserContext } from '@/lib/UserContext';
import { magic } from '@/lib/magic';
import { useRouter } from 'next/router';

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

  return (
    <>
      {user?.issuer && (
        <>
          <h1>Dashboard</h1>
          <h2>Email</h2>
          <p>{user.email}</p>
          <h2>Wallet Address</h2>
          <p>{user.publicAddress}</p>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </>
  );
}
