# Vite.js + Unlock Paywall's

This is an example of how to add the Unlock Paywall library to a Vite Vanilla application.

Here we only demonstrate the use of the Paywall for checkout with the following characteristics:

- Checkout is loaded with a global config
- The ability to "collect" hidden metadata which are linked to the user's membership:

```js
window.unlockProtocolConfig = {
  locks: {
    '0xb77030a7e47a5eb942a4748000125e70be598632': {
      network: 137,
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

The Paywall library triggers events which can be used to know its state.

```javascript
window.addEventListener(eventName, function (event) {
  console.group(`Received ${eventName}`)
  console.log(event.detail)
  console.groupEnd()
})
```
