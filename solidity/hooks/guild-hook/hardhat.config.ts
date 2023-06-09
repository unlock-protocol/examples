import '@unlock-protocol/hardhat-plugin'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import networks from '@unlock-protocol/networks'

let accounts: string[] = []
if (process.env.PKEY) {
  accounts.push(process.env.PKEY)
}

const networksByNames = Object.keys(networks).reduce((acc, networkId) => {
  const network = networks[networkId]
  return {
    ...acc,
    [network.chain]: {
      accounts,
      url: network.provider,
    },
  }
}, {})

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: networksByNames,
  etherscan: {
    apiKey: {
      arbitrumOne: 'W5XNFPZS8D6JZ5AXVWD4XCG8B5ZH5JCD4Y',
      gnosis: 'BSW3C3NDUUBWSQZJ5FUXBNXVYX92HZDDCV',
      polygon: 'W9TVEYKW2CDTQ94T3A2V93IX6U3IHQN5Y3',
      goerli: 'HPSH1KQDPJTNAPU3335G931SC6Y3ZYK3BF',
      mainnet: 'HPSH1KQDPJTNAPU3335G931SC6Y3ZYK3BF',
      rinkeby: 'HPSH1KQDPJTNAPU3335G931SC6Y3ZYK3BF',
      bsc: '6YUDRP3TFPQNRGGZQNYAEI1UI17NK96XGK',
      xdai: 'api-key',
      optimisticEthereum: 'V51DWC44XURIGPP49X85VZQGH1DCBAW5EC',
    },
  },
}

export default config
