import { useState } from 'react'
import { WagmiConfig, createClient, chain } from 'wagmi'

import { useAccount } from 'wagmi'

import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from 'connectkit'
import './App.css'
import DeployLock from './DeployLock'
import PurchaseKey from './PurchaseKey'
const alchemyId = process.env.ALCHEMY_ID

const chains = [chain.goerli]

const client = createClient(
  getDefaultClient({
    appName: 'Your App Name',
    alchemyId,
    chains,
  })
)

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <WagmiConfig client={client}>
          <ConnectKitProvider>
            <Content></Content>
          </ConnectKitProvider>
        </WagmiConfig>
      </header>
    </div>
  )
}

const Content = () => {
  const { isConnected } = useAccount()
  const [action, setAction] = useState('')

  if (!isConnected) {
    return <ConnectKitButton />
  }
  return (
    <>
      <div className="absolute top-0 right-0 p-4">
        <ConnectKitButton />
      </div>

      {action === 'deploy' && <DeployLock />}
      {action === 'purchase' && <PurchaseKey />}

      {action === '' && (
        <>
          <h1>Using Unlock with Wagmi!</h1>
          <button
            className="block w-1/2 px-4 py-3 mt-8 text-base text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none"
            onClick={() => setAction('deploy')}
          >
            Deploy Lock
          </button>
          <button
            className="block w-1/2 px-4 py-3 mt-8 text-base text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none"
            onClick={() => setAction('purchase')}
          >
            Purchase Key
          </button>
        </>
      )}
      {action !== '' && (
        <button
          className="block w-1/2 px-4 py-3 mt-8 text-base text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:outline-none"
          onClick={() => setAction('')}
        >
          Cancel
        </button>
      )}
    </>
  )
}

export default App
