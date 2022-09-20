import useLocalStorage from "use-local-storage-state";

interface Ticket {
  id: string;
  lock: string;
  network: number;
}

interface User {
  address: string;
}

export function useUser() {
  const [user, setUser] = useLocalStorage<User | null>("account", {
    defaultValue: null,
  });

  const signOut = () => {
    setUser(null);
  };

  const signIn = (user: User) => {
    setUser(user);
  };

  return {
    user,
    signIn,
    signOut,
  };
}
