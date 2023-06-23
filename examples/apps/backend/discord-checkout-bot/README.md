# Discord Checkout Bot

This is the checkout bot used by unlock to token-gate and sell memberships on the discord.

## Develop

1.  Install all the dependencies.

```sh
yarn install
```

1. Configure your lock and paywall config in the config.ts file

1. Create a .env.local file with the following variables. You will need to create a discord bot application from the discord developer panel.

```sh
DISCORD_CLIENT_ID=
DISCORD_CHANNEL_ID=
DISCORD_GUILD_ID=
DISCORD_ROLE_ID=
DISCORD_CLIENT_SECRET=
DISCORD_BOT_TOKEN=
HOST=
DATABASE_URL=
```

1. Run `yarn dev` to start the bot.
