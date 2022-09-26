export const networks: Record<
  string,
  {
    unlockAddress: string;
    provider: string;
  }
> = {
  "4": {
    unlockAddress: "0xd8c88be5e8eb88e38e6ff5ce186d764676012b0b", // Smart contracts docs include all addresses on all networks
    provider: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
};

export const paywallConfig: Record<string, unknown> = {
  locks: {
    "0x4B464E559Ce469313e5a6E1fD92F351c098Ef164": {
      network: 4,
    },
  },
  pessimistic: true,
};
