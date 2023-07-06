# Vite.js + Unlock Paywall's

This is an example of how to add the Unlock Paywall library to a Vite Vanilla application.

Here we only demonstrate the use of the Paywall for checkout with the following characteristics:

- Checkout is loaded with a global config
- The ability to "collect" hidden metadata which are linked to the user's membership:

```js
window.unlockProtocolConfig = {
  locks: {
    '0x71ac04694ec01e4353e9d3b8ec04c48200ed52b7': {
      network: 5,
    },
  },
  metadataInputs: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'userId',
      type: 'hidden',
      required: true,
      value: '123',
    },
  ],
  pessimistic: true,
}
```

- Handling events:
