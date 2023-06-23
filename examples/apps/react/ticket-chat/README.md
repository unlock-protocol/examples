# Ticket Chat

A realtime token gated chat application which can use unlock based QR tickets to let users login.
This example uses [liveblocks](https://liveblocks.io/) for storing realtime chat data. You will need to create an account and get an API key to run this exaple.

## Developing

1. Create a .env.local file with the following variables.

```shell
VITE_LIVEBLOCK_PUBLIC_KEY=key # Key from liveblocks project.
VITE_BASE_URL=http://localhost:3000
```

1. Run `yarn install`

1. Run `yarn dev` to start the application.

For production, you can build the app or directly deploy to a hosting provider such as vercel.
