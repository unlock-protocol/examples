import { networks } from "../config/networks";

export function loginURL() {
  const current = new URL(window.location.href);
  const endpoint = new URL(`https://app.unlock-protocol.com/alpha/checkout`);
  endpoint.searchParams.append("client_id", current.host);
  endpoint.searchParams.append("redirect_uri", window.location.href);
  return endpoint.toString();
}

const LOCK = `
query getLock($lockAddress: String!) {
  locks(where: { address: $lockAddress }) {
    name
  }
}
`;

const KEY_PURCHASES = `
query getMemberships($walletAddress: String!) {
    keyPurchases(where: { purchaser: $walletAddress }) {
      timestamp
      lock {
        address
      }
      id
    }
  }
`;

export async function getMembershipsBynetwork(
  walletAddress: string,
  networkId: number
) {
  const network = networks[networkId];
  const response = await fetch(network.subgraphURI, {
    method: "POST",
    body: JSON.stringify({
      query: KEY_PURCHASES,
      variables: {
        walletAddress,
      },
    }),
  });
  const json = await response.json();
  const items = json.data.keyPurchases.map((item: any) => ({
    ...item,
    network: network.id,
  }));
  return items;
}

export async function getAllMemberships(walletAddress: string) {
  const items = await Promise.all(
    Object.values(networks).map((network) =>
      getMembershipsBynetwork(walletAddress, network.id)
    )
  );
  return items.flat();
}

export async function getLock(lockAddress: string, networkId: number) {
  const network = networks[networkId];
  const response = await fetch(network.subgraphURI, {
    method: "POST",
    body: JSON.stringify({
      query: LOCK,
      variables: {
        lockAddress,
      },
    }),
  });
  const json = await response.json();
  return json.data?.locks?.[0];
}
