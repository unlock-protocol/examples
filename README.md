# Unlock Examples

This repository contains examples and sample applications built using unlock protocol in different contexts. You can use the examples here as a starting point for building your own applications!

Please, do check the [Unlock Protocols docs](https://docs.unlock-protocol.com/) for extensive documentation.

The examples are loosely sorted by languages and framework used. Each of them contains a README that provides more details about what the specific example provides.

## Javascript

### Nodejs

- [Discord Checkout Bot](./javascript/node.js/discord-checkout-bot/)

A token gating discord bot which allows creators to sell NFT and give access to their discord. This example makes use of unlock checkout and authentication APIs to integrate with discord.

- [Discord Webhook](./javascript/node.js/discord-webhook)

A discord webhook to receive information about newly created keys and locks on different networks supported by unlock on discord channels. This example makes use of websub APIs provided by unlock to subscribe and receive events from locksmith.

### React

- [Ticket Chat](./javascript/react/ticket-chat)

A realtime chat application built on top of [liveblocks](https://liveblocks.io) to allow unlock NFT ticket holders to chat with each other at events.
This example makes use of unlock QR code tickets and SIWE integration to build a smooth token gating event chat flow.

### Nextjs

- [Nextjs Gating](./javascript/nextjs/token-gating/)

A nextjs gating template app which uses server side gating and access control based on tier of memberships. This example makes of use unlock checkout and authentication APIs to provide server-side gating and access control.

# License

All code is licensed under [MIT](./LICENSE)
