# Wagmi + Paywall

In this example we use [Wagmi](https://wagmi.sh/) in a React app (using [Vite](https://vitejs.dev/)) and use the unlock Paywall to build a checkout once the user is connected.

We pass the `provider` from wagmi to the paywall object:

```js
const checkout = async () => {
  const paywallConfig = {
    locks: {
      '0xb77030a7e47a5eb942a4748000125e70be598632': {
        network: 137,
      },
    },
    skipRecipient: true,
    title: 'My Membership',
  }
  await paywall.connect(await connector.getProvider())
  await paywall.loadCheckoutModal(paywallConfig)
  // You can use the returned value above to get a transaction hash if needed!
  return false
}
```
