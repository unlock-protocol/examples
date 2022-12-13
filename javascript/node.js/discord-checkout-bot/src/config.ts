export const paywallConfig = {
  messageToSign: "Allow access to Unlock Discord Community",
  pessimistic: true,
  locks: {
    "0xb77030a7e47a5eb942a4748000125e70be598632": {
      name: "Unlock Community",
      network: 137,
    },
  },
  metadataInputs: [{ name: "email", type: "email", required: true }],
};

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
};
