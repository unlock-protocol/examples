# A basic Purchase Hook

This example shows a very basic "discount" hook that can be added to any lock so that specific addresses may receive a different price when they purchase their NFT membership.

You can run tests locally:

```
yarn run hardhat test test/DiscountHook.js
```

And deploy:

```
yarn run hardhat run scripts/deploy.js --network goerli
```

## Usage

We have deployed a version of this hook on:

- [Goerli](https://goerli.etherscan.io/address/0xBe4dCe6bDb21b4e1e57055C5DBDeC1A0666726b0#code).
- [Polygon](https://polygonscan.com/address/0xe829E1848F530834Bc5DB92489d8346b018A50D8#code)

You can connect it to your lock using the `setEventsHooks` function on the lock and make sure you add discounted prices by calling the `addDiscount` function with your lock address, the recipient's address and the price they will pay.
