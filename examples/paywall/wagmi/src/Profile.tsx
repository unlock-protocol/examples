import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore (this is a local package)
import { Paywall } from '@unlock-protocol/paywall'
import networks from '@unlock-protocol/networks'

const paywall = new Paywall(networks)

export function Profile() {
  const { address, isConnected, connector } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const checkout = async () => {
    if (connector) {
      const paywallConfig = {
        locks: {
          '0x6c208a3eb3150e7896124d282095f9e5fca18780': {
            network: 5,
          },
        },
        skipRecipient: true,
        title: 'My Membership',
      }
      await paywall.connect(await connector.getProvider())
      await paywall.loadCheckoutModal(paywallConfig)
    }
    // You can use the returned value above to get a transaction hash if needed!
    return false
  }

  if (isConnected)
    return (
      <div>
        Connected to {address}
        <button onClick={() => disconnect()}>Disconnect</button>
        <button onClick={() => checkout()}>Checkout!</button>
      </div>
    )
  return <button onClick={() => connect()}>Connect Wallet</button>
}
