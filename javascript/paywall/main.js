import './style.css'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { Paywall } from '@unlock-protocol/paywall';

const APP_NAME = 'My Awesome App'
const APP_LOGO_URL = 'https://example.com/logo.png'
const DEFAULT_ETH_JSONRPC_URL = `https://rpc.unlock-protocol.com/5`
const DEFAULT_CHAIN_ID = 5

// Initialize Coinbase Wallet SDK
const coinbaseWallet = new CoinbaseWalletSDK({
  appName: APP_NAME,
  appLogoUrl: APP_LOGO_URL,
  darkMode: false
})

console.log(Paywall)
const connectButton = document.getElementById("connect");
const checkoutButton = document.getElementById("checkout");

connectButton.onclick = async () => {
  // Initialize a Web3 Provider object
  const ethereum = coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID)
  console.log(ethereum)
  const x = await ethereum.enable()
  console.log(x)
  if (x) {
    connectButton.setAttribute('disabled', true)
    checkoutButton.removeAttribute('disabled')
  }
}

checkoutButton.onclick = async () => {
  console.log(Paywall)

}
