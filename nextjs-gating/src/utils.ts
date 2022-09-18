import { networks, paywallConfig } from "~/config/unlock";
import { Web3Service } from "@unlock-protocol/unlock-js";
import { Membership } from "./types";
interface GetHasValidKeyOptions {
  network: number;
  lockAddress: string;
  userAddress: string;
}

export async function getValidKey({
  network,
  lockAddress,
  userAddress,
}: GetHasValidKeyOptions) {
  const unlockWeb3Service = new Web3Service(networks);
  // @ts-ignore - unlockjs is not typed properly
  const keyId = await unlockWeb3Service.getTokenIdForOwner(
    lockAddress,
    userAddress,
    network
  );

  if (keyId <= 0) {
    return;
  }

  return {
    id: keyId,
    lockAddress,
    network,
  } as Membership;
}

export async function getValidMemberships(userAddress: string) {
  const promises = Object.keys(paywallConfig.locks as any).map(
    (lockAddress) => {
      return getValidKey({
        lockAddress,
        userAddress,
        network: (paywallConfig.locks as any)[lockAddress].network,
      });
    }
  );
  const results = await Promise.all(promises);
  return results as Membership[];
}

export async function hasMembership(userAddress: string) {
  const results = await getValidMemberships(userAddress);
  return !!results.length;
}

export async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const response = await fetch(input, init);
  const data = await response.json();
  if (response.ok) {
    return data;
  }
  throw new FetchError({
    message: response.statusText,
    response,
    data,
  });
}

export class FetchError extends Error {
  response: Response;
  data: {
    message: string;
  };
  constructor({
    message,
    response,
    data,
  }: {
    message: string;
    response: Response;
    data: {
      message: string;
    };
  }) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }
    this.name = "FetchError";
    this.response = response;
    this.data = data ?? { message: message };
  }
}
