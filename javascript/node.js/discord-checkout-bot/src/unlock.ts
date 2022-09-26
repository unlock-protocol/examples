import { Web3Service } from "@unlock-protocol/unlock-js";

export const web3Service = new Web3Service({
  "56": {
    publicProvider: "https://bsc-dataseed.binance.org/",
    provider: "https://bsc-dataseed.binance.org/",
    unlockAddress: "0xeC83410DbC48C7797D2f2AFe624881674c65c856",
    id: 56,
    name: "Binance Smart Chain",
  },
  "4": {
    publicProvider:
      "https://eth-rinkeby.alchemyapi.io/v2/n0NXRSZ9olpkJUPDLBC00Es75jaqysyT",
    provider:
      "https://eth-rinkeby.alchemyapi.io/v2/n0NXRSZ9olpkJUPDLBC00Es75jaqysyT",
    unlockAddress: "0xd8c88be5e8eb88e38e6ff5ce186d764676012b0b",
    id: 4,
    name: "Rinkeby",
  },
  "10": {
    publicProvider: "https://mainnet.optimism.io",
    provider: "https://mainnet.optimism.io",
    unlockAddress: "0x99b1348a9129ac49c6de7F11245773dE2f51fB0c",
    id: 10,
    name: "Optimism",
  },
  "1": {
    id: 1,
    publicProvider:
      "https://eth-mainnet.alchemyapi.io/v2/6idtzGwDtRbzil3s6QbYHr2Q_WBfn100", // Should we use Infura?
    provider:
      "https://eth-mainnet.alchemyapi.io/v2/6idtzGwDtRbzil3s6QbYHr2Q_WBfn100",
    unlockAddress: "0x3d5409CcE1d45233dE1D4eBDEe74b8E004abDD13",
    name: "Ethereum",
  },
  "137": {
    publicProvider: "https://polygon-rpc.com/",
    provider:
      "https://snowy-weathered-waterfall.matic.quiknode.pro/5b11a0413a62a295070c0dfb25637d5f8c591aba/",
    unlockAddress: "0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f",
    serializerAddress: "0x646e373eaf8a4aec31bf62b7fd6fb59296d6cda9",
    id: 137,
    name: "Polygon",
  },
  "100": {
    publicProvider: "https://rpc.gnosischain.com",
    provider:
      "https://cool-empty-bird.xdai.quiknode.pro/4edba942fb43c718f24480484684e907fe3fe1d3/",
    unlockAddress: "0x1bc53f4303c711cc693F6Ec3477B83703DcB317f",
    serializerAddress: "0x646E373EAf8a4AEc31Bf62B7Fd6fB59296d6CdA9",
    id: 100,
    name: "xDai",
  },
});

export async function hasMembership(userAddress: string, paywallConfig: any) {
  for (const [lockAddress, { network }] of Object.entries<{ network: number }>(
    paywallConfig.locks
  )) {
    const keyId = await web3Service.getTokenIdForOwner(
      lockAddress,
      userAddress,
      network
    );
    if (keyId > 0) {
      return true;
    }
  }
  return false;
}
