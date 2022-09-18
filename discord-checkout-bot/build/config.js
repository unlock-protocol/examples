"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.paywallConfig = void 0;
exports.paywallConfig = {
    messageToSign: "Allow access to Unlock Discord Community",
    pessimistic: true,
    locks: {
        "0xCE62D71c768aeD7EA034c72a1bc4CF58830D9894": {
            name: "Unlock Community",
            network: 100,
        },
    },
    metadataInputs: [{ name: "email", type: "email", required: true }],
};
exports.config = {
    paywallConfig: exports.paywallConfig,
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    host: process.env.HOST,
    token: process.env.DISCORD_BOT_TOKEN,
    databaseURL: process.env.DATABASE_URL,
    guildId: process.env.DISCORD_GUILD_ID,
    roleId: process.env.DISCORD_ROLE_ID,
    channelId: process.env.DISCORD_CHANNEL_ID,
};
