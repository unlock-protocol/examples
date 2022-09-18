export const polygon = {
  publicProvider: "https://polygon-rpc.com/",
  provider:
    "https://snowy-weathered-waterfall.matic.quiknode.pro/5b11a0413a62a295070c0dfb25637d5f8c591aba/",
  unlockAddress: "0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f",
  multisig: "0x479f3830fbd715342868BA95E438609BCe443DFB",
  serializerAddress: "0x646e373eaf8a4aec31bf62b7fd6fb59296d6cda9",
  id: 137,
  name: "Polygon",
  blockTime: 1000,
  subgraphURI:
    "https://api.thegraph.com/subgraphs/name/unlock-protocol/polygon",
  explorer: {
    name: "Polygonscan",
    urls: {
      address: (address: string) =>
        `https://polygonscan.com/address/${address}`,
      transaction: (hash: string) => `https://polygonscan.com/tx/${hash}`,
      token: (address: string, holder: string) =>
        `https://polygonscan.com/token/${address}?a=${holder}`,
    },
  },
  opensea: {
    tokenUrl: (lockAddress: string, tokenId: string) =>
      `https://opensea.io/assets/matic/${lockAddress}/${tokenId}`,
  },
  requiredConfirmations: 12,
  erc20: null,
  baseCurrencySymbol: "Matic",
  locksmithUri: "https://locksmith.unlock-protocol.com",
  nativeCurrency: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
  },
  startBlock: 21986688,
  previousDeploys: [
    {
      unlockAddress: "0x14bb3586Ce2946E71B95Fe00Fc73dd30ed830863",
      startBlock: 15714206,
    },
  ],
  description: "Popular side chain network. Cheaper transaction cost.",
  isTestNetwork: false,
};

const goerli = {
  publicProvider: "https://goerli.prylabs.net",
  provider: "https://goerli.prylabs.net",
  unlockAddress: "0x627118a4fB747016911e5cDA82e2E77C531e8206",
  multisig: "0x95C06469e557d8645966077891B4aeDe8D55A755",
  id: 5,
  name: "Goerli (Testnet)",
  blockTime: 1000,
  subgraphURI: "https://api.thegraph.com/subgraphs/name/unlock-protocol/goerli",
  explorer: {
    name: "Goerli (Testnet)",
    urls: {
      address: (address: string) =>
        `https://goerli.etherscan.io/address/${address}`,
      transaction: (hash: string) => `https://goerli.etherscan.io/tx/${hash}`,
      token: (address: string, holder: string) =>
        `https://goerli.etherscan.io/token/${address}?a=${holder}`,
    },
  },
  opensea: {
    tokenUrl: (_lockAddress: string, _tokenId: string) => null,
  },
  requiredConfirmations: 12,
  erc20: null,
  baseCurrencySymbol: "ETH",
  description: "Main Ethereum test network. Do not use for production",
  locksmithUri: "https://locksmith.unlock-protocol.com",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  startBlock: 7179039,
  previousDeploys: [],
  isTestNetwork: true,
};

const xdai = {
  publicProvider: "https://rpc.gnosischain.com",
  provider:
    "https://cool-empty-bird.xdai.quiknode.pro/4edba942fb43c718f24480484684e907fe3fe1d3/",
  unlockAddress: "0x1bc53f4303c711cc693F6Ec3477B83703DcB317f",
  serializerAddress: "0x646E373EAf8a4AEc31Bf62B7Fd6fB59296d6CdA9",
  multisig: "0xfAC611a5b5a578628C28F77cEBDDB8C6159Ae79D",
  id: 100,
  name: "Gnosis Chain",
  blockTime: 5000,
  requiredConfirmations: 12,
  subgraphURI: "https://api.thegraph.com/subgraphs/name/unlock-protocol/xdai",
  explorer: {
    name: "Blockscout",
    urls: {
      address: (address: string) =>
        `https://blockscout.com/poa/xdai/address/${address}/transactions`,
      transaction: (hash: string) =>
        `https://blockscout.com/poa/xdai/tx/${hash}`,
      token: (address: string, _holder: string) =>
        `https://blockscout.com/xdai/mainnet/token/${address}/token-holders#holders`,
    },
  },
  opensea: {
    tokenUrl: (_lockAddress: string, _tokenId: string) => null,
  },
  erc20: null, // no default ERC20 on xdai for now
  locksmithUri: "https://locksmith.unlock-protocol.com",
  baseCurrencySymbol: "xDai",
  nativeCurrency: {
    name: "xDAI",
    symbol: "xDai",
    decimals: 18,
  },
  startBlock: 19338700,
  previousDeploys: [
    {
      unlockAddress: "0x14bb3586Ce2946E71B95Fe00Fc73dd30ed830863",
      startBlock: 14521200,
    },
  ],
  description:
    "EVM compatible network whose base currency is a stable coin. Cheaper transaction cost.",
  isTestNetwork: false,
};

const mainnet = {
  id: 1,
  publicProvider:
    "https://eth-mainnet.alchemyapi.io/v2/6idtzGwDtRbzil3s6QbYHr2Q_WBfn100", // Should we use Infura?
  provider:
    "https://eth-mainnet.alchemyapi.io/v2/6idtzGwDtRbzil3s6QbYHr2Q_WBfn100",
  unlockAddress: "0x3d5409CcE1d45233dE1D4eBDEe74b8E004abDD13",
  multisig: "0xa39b44c4AFfbb56b76a1BF1d19Eb93a5DfC2EBA9",
  name: "Ethereum",
  blockTime: 8000,
  subgraphURI: "https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock",
  explorer: {
    name: "Etherscan",
    urls: {
      address: (address: string) => `https://etherscan.io/address/${address}`,
      transaction: (hash: string) => `https://etherscan.io/tx/${hash}`,
      token: (address: string, holder: string) =>
        `https://etherscan.com/token/${address}?a=${holder}`,
    },
  },
  opensea: {
    tokenUrl: (lockAddress: string, tokenId: string) =>
      `https://opensea.io/assets/${lockAddress}/${tokenId}`,
  },
  erc20: {
    symbol: "DAI",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  requiredConfirmations: 12,
  baseCurrencySymbol: "Eth",
  locksmithUri: "https://locksmith.unlock-protocol.com",
  nativeCurrency: {
    name: "Ether",
    symbol: "Eth",
    decimals: 18,
  },
  startBlock: 7120795,
  description: "The most popular network",
  isTestNetwork: false,
};

const mumbai = {
  publicProvider: "https://matic-mumbai.chainstacklabs.com",
  provider: "https://matic-mumbai.chainstacklabs.com",
  unlockAddress: "0x1FF7e338d5E582138C46044dc238543Ce555C963",
  multisig: "0x12E37A8880801E1e5290c815a894d322ac591607",
  id: 80001,
  name: "Mumbai (Polygon)",
  blockTime: 1000,
  subgraphURI: "https://api.thegraph.com/subgraphs/name/unlock-protocol/mumbai",
  explorer: {
    name: "PolygonScan (Mumbai)",
    urls: {
      address: (address: string) =>
        `https://mumbai.polygonscan.com/address/${address}`,
      transaction: (hash: string) =>
        `https://mumbai.polygonscan.com/tx/${hash}`,
      token: (address: string, holder: string) =>
        `https://mumbai.polygonscan.com/token/${address}?a=${holder}`,
    },
  },
  opensea: {
    tokenUrl: (_lockAddress: string, _tokenId: string) => null,
  },
  requiredConfirmations: 12,
  erc20: null,
  baseCurrencySymbol: "MATIC",
  locksmithUri: "https://locksmith.unlock-protocol.com",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  startBlock: 26584912,
  previousDeploys: [],
  description: "Polygon test network. Do not use for production",
  isTestNetwork: true,
};

const rinkeby = {
  publicProvider:
    "https://eth-rinkeby.alchemyapi.io/v2/n0NXRSZ9olpkJUPDLBC00Es75jaqysyT",
  provider:
    "https://eth-rinkeby.alchemyapi.io/v2/n0NXRSZ9olpkJUPDLBC00Es75jaqysyT",
  unlockAddress: "0xd8c88be5e8eb88e38e6ff5ce186d764676012b0b",
  serializerAddress: "0x1bd356194d97297F77e081fFFAB97b57297E93e4",
  multisig: "0x04e855D82c079222d6bDBc041F6202d5A0137267",
  id: 4,
  name: "Rinkeby",
  blockTime: 8000,
  subgraphURI:
    "https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock-rinkeby",
  explorer: {
    name: "Etherscan",
    urls: {
      address: (address: string) =>
        `https://rinkeby.etherscan.io/address/${address}`,
      transaction: (hash: string) => `https://rinkeby.etherscan.io/tx/${hash}`,
      token: (address: string, holder: string) =>
        `https://rinkeby.etherscan.io/token/${address}?a=${holder}`,
    },
  },
  opensea: {
    tokenUrl: (lockAddress: string, tokenId: string) =>
      `https://testnets.opensea.io/assets/${lockAddress}/${tokenId}`,
  },
  requiredConfirmations: 12,
  erc20: {
    symbol: "WEE",
    address: "0xaFF4481D10270F50f203E0763e2597776068CBc5",
  },
  baseCurrencySymbol: "Eth",
  locksmithUri: "https://rinkeby.locksmith.unlock-protocol.com",
  nativeCurrency: {
    name: "Rinkeby Eth",
    symbol: "Eth",
    decimals: 18,
  },
  startBlock: 3530008,
  description: "Ethereum test network. Do not use for production",
  isTestNetwork: true,
};

const optimism = {
  publicProvider: "https://mainnet.optimism.io",
  provider: "https://mainnet.optimism.io",
  unlockAddress: "0x99b1348a9129ac49c6de7F11245773dE2f51fB0c",
  multisig: "0x6E78b4447e34e751EC181DCBed63633aA753e145",
  id: 10,
  name: "Optimism",
  blockTime: 8000,
  subgraphURI:
    "https://api.thegraph.com/subgraphs/name/unlock-protocol/optimism",
  explorer: {
    name: "Etherscan",
    urls: {
      address: (address: string) =>
        `https://optimistic.etherscan.io/address/${address}`,
      transaction: (hash: string) =>
        `https://optimistic.etherscan.io/tx/${hash}`,
      token: (address: string, holder: string) =>
        `https://optimistic.etherscan.io/token/${address}?a=${holder}`,
    },
  },
  opensea: {
    tokenUrl: (_lockAddress: string, _tokenId: string) => null,
  },
  requiredConfirmations: 12,
  baseCurrencySymbol: "Eth",
  locksmithUri: "https://locksmith.unlock-protocol.com",
  nativeCurrency: {
    name: "Eth",
    symbol: "Eth",
    decimals: 18,
  },
  description: "Layer 2 network. Cheaper transaction cost.",
  isTestNetwork: false,
};

export const networks = [
  goerli,
  rinkeby,
  polygon,
  mumbai,
  xdai,
  mainnet,
  optimism,
].reduce((networks, network) => {
  networks[network.id] = network as any;
  return networks;
}, {} as Record<string, typeof polygon>);
