# The Guild Hook

The Guild hook is a contract to be used as an `onKeyPurchase` [Hook with a membership contract](https://docs.unlock-protocol.com/core-protocol/public-lock/hooks). It requires Unlock's backend service (called `Locksmith`) to verify that the purchaser of a given membership NFT belongs to a specific [guild.xyz](https://guild.xyz/) guild. If so, `Locksmith` provides a signed message that gets passed to the `purchase` method on the lock, and then to this `GuildHook` contract. The contract will verify the signature and revert if it does not match!

This Hook is in fact identical to the Captcha hook.
