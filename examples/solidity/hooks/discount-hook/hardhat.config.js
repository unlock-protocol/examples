require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("@unlock-protocol/hardhat-plugin");


const unlockNetwoks = require('@unlock-protocol/networks')

const networks = {
  hardhat: {
    gas: 1000000000,
    allowUnlimitedContractSize: true,
    blockGasLimit: 1000000000,
  },
}

Object.keys(unlockNetwoks).forEach((name) => {
  if (['default', 'networks'].indexOf(name) == -1) {
    networks[name] = {
      url: unlockNetwoks[name].publicProvider,
      accounts: [process.env.PKEY]
    }
  }
})
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks,
  etherscan: {
    apiKey: {
      polygon: 'W9TVEYKW2CDTQ94T3A2V93IX6U3IHQN5Y3',
      goerli: 'HPSH1KQDPJTNAPU3335G931SC6Y3ZYK3BF',
      mainnet: 'HPSH1KQDPJTNAPU3335G931SC6Y3ZYK3BF',
      rinkeby: 'HPSH1KQDPJTNAPU3335G931SC6Y3ZYK3BF',
      bsc: '6YUDRP3TFPQNRGGZQNYAEI1UI17NK96XGK',
      xdai: 'api-key',
      optimisticEthereum: 'V51DWC44XURIGPP49X85VZQGH1DCBAW5EC',
    }
  },
};
