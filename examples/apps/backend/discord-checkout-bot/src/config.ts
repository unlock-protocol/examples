export const paywallConfig = {
  messageToSign: 'Allow access to Unlock Discord Community',
  pessimistic: true,
  locks: {
    '0xb6bd8fc42df6153f79eea941a2b4c86f8e5f7b1d': {
      name: 'Unlock Community',
      network: 8453,
    },
  },
  metadataInputs: [{ name: 'email', type: 'email', required: true }],
}

export const config = {
  paywallConfig,
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  host: process.env.HOST!,
  token: process.env.DISCORD_BOT_TOKEN!,
  databaseURL: process.env.DATABASE_URL!,
  guildId: process.env.DISCORD_GUILD_ID!,
  roleId: process.env.DISCORD_ROLE_ID!,
  channelId: process.env.DISCORD_CHANNEL_ID!,
}
