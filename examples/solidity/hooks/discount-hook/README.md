# Discount Hook for Locks

This project implements an Unlock [PublicLock Hook](https://docs.unlock-protocol.com/core-protocol/public-lock/hooks) that can be used on Locks smart contracts to support a discount code or coupon.

This process is _secured_ and cannot be bypassed by calling the contract directly as the discount code is used to submit the transaction on-chain.

When the user enters a discount code on the frontend application, it is used to generate a private key that is then used to sign the recipient's address. That signature is passed as the data argument on the `purchase` call.

A lock manager can add any number of discount code to their lock by calling the function `setDiscountCodeForLock` multiple times.

The Unlock Protocol team has deployed and verified a version of this hook on the following networks:

Production networks:

- [Optimism: `0x8e0B46ec3B95c81355175693dA0083b00fCc1326`](https://optimistic.etherscan.io/address/0x8e0B46ec3B95c81355175693dA0083b00fCc1326)
- [Polygon: `0x93E160838c529873cB7565106bBb79a3226FE07A`](https://polygonscan.com/address/0x93E160838c529873cB7565106bBb79a3226FE07A)

Test networks:

- [Goerli: `0x850c015A6A88756a59Dc025fca988494fF90DBB7`](https://goerli.etherscan.io/address/0x850c015A6A88756a59Dc025fca988494fF90DBB7)

## Example

[This example lock](https://goerli.etherscan.io/address/0x2490f447fdb7b259bc454871806b6b794de65944) is deployed on Goerli and uses this discount hook with 2 different discounts:

- `FRIENDS` for a 50% discount
- `FAMILY` for a 100% discount

This means if you purchase a key [through this checkout URL](https://app.unlock-protocol.com/checkout?paywallConfig=%7B%22locks%22%3A%7B%220x2490f447fdb7b259bc454871806b6b794de65944%22%3A%7B%22network%22%3A5%2C%22name%22%3A%22%22%2C%22captcha%22%3Afalse%2C%22password%22%3Afalse%2C%22promo%22%3Atrue%2C%22emailRequired%22%3Afalse%2C%22maxRecipients%22%3Anull%2C%22dataBuilder%22%3A%22%22%2C%22skipRecipient%22%3Afalse%7D%7D%2C%22pessimistic%22%3Atrue%2C%22skipRecipient%22%3Atrue%2C%22title%22%3A%22Try+Discounts%21%22%2C%22icon%22%3A%22%22%7D) and enter any of the 2 discount codes you will see a discounted price on the final confirmation screen!

If you don't enter a discount code, you will pay the full price of 0.01 Eth.

## Using the hook for your own lock

1. First, you need to generate promo codes, then [go to this page to generate the corresponding signer address](https://unlock-protocol.github.io/discount-hook/). You can also generate this locally if needed by checking out the repo and switching to the `gh-page` branch. 

<img width="1044" alt="Screen Shot 2023-01-09 at 12 55 04 PM" src="https://user-images.githubusercontent.com/17735/211374963-b9fc6999-50ce-4e91-8ae4-4a5a55db91e8.png">


2. Then, click on the network your lock has been deployed on (list above) and head to `Contract` > `Write Contract`. Connect your wallet (you need to be connected as one of the lock's manager) and click on `setDiscountForLock`. There, enter the lock address, and then the signer address generated in the previous step and the discount amount to be applied. Since the EVM does not support floating numbers, you have to enter the discount percentage in [basis points](https://en.wikipedia.org/wiki/Basis_point). For example for a 100% discount, you would enter `10000`. For a 3% discount, you would enter `300`.

<img width="696" alt="Screen Shot 2023-01-09 at 12 56 45 PM" src="https://user-images.githubusercontent.com/17735/211375263-029bfd0a-a421-4188-b329-b664819bf5e4.png">

3. After that, you need to point your lock to the hook. You can do that by going to your lock's settings page on the Unlock Dashboard. Then check the Advanced tab and the Hooks section.  Add the address of the key purchase hook for the network your lock is deployed on. You can find a list of all the key purchase hook addresses listed above (and please get in touch with us if you need it to be deployed on more networks).

<img width="1266" alt="Screen Shot 2023-01-09 at 12 57 19 PM" src="https://user-images.githubusercontent.com/17735/211375358-c00fecba-d4e5-46d9-a8cb-2ab00aec9731.png">

4. Finally, [build a Checkout URL](https://unlock-protocol.com/blog/checkout-builder-release) and make sure you tick `Promo Codes` option for the lock to which you are applying a discount!

<img width="751" alt="Screen Shot 2023-01-09 at 12 57 52 PM" src="https://user-images.githubusercontent.com/17735/211375444-f59089c9-c320-4c3f-8db0-c85a15836466.png">


## Dev

You can deploy the hook on other chains by adding the chain to the `hardhat.config.js` config file and calling:

```
yarn run hardhat run scripts/deploy.js --network my-network
```

To verify the contract on block explorers, call :

```
yarn run hardhat verify --network my-network 0xhook-address
```

Running tests:

```
yarn run hardhat test test/sample-test.js
```
