"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const discord_oauth2_1 = __importDefault(require("discord-oauth2"));
const config_1 = require("./config");
const crypto_1 = __importDefault(require("crypto"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const discord_js_1 = require("discord.js");
const database_1 = require("./database");
const unlock_1 = require("./unlock");
const ethers_1 = require("ethers");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const commands_1 = require("./commands");
const port = process.env.PORT || 8080;
const client = new discord_js_1.Client({
    intents: ["GUILD_MEMBERS"],
});
const oauth = new discord_oauth2_1.default({
    clientId: config_1.config.clientId,
    clientSecret: config_1.config.clientSecret,
});
const restClient = new rest_1.REST({
    version: "9",
}).setToken(config_1.config.token);
const fastify = (0, fastify_1.default)({
    logger: true,
});
fastify.addHook("onClose", async (_, done) => {
    await database_1.sequelize.close();
    await client.destroy();
});
fastify.register(cookie_1.default, {
    parseOptions: {},
});
async function unlockInteractionHandler(interaction) {
    await interaction.deferReply({
        ephemeral: true,
    });
    let role = await interaction.guild?.roles.fetch(config_1.config.roleId);
    const hasRole = (interaction.member?.roles).cache.get(role.id);
    if (hasRole) {
        await interaction.editReply({
            content: `You are already a member of Unlock Community, ${interaction.member?.user}. You can send messages.`,
        });
        return;
    }
    const user = await database_1.User.findOne({
        where: {
            id: interaction.member?.user.id,
        },
    });
    if (!user) {
        const [nounce] = await database_1.Nounce.upsert({
            id: crypto_1.default.randomUUID(),
            userId: interaction.member.user.id,
        });
        const nounceData = nounce.toJSON();
        const checkoutURL = new URL(`/checkout/${nounceData.id}`, config_1.config.host);
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setStyle("LINK")
            .setLabel("Buy Membership")
            .setURL(checkoutURL.toString())
            .setEmoji("🔑"));
        await interaction.editReply({
            content: "You need to go through the checkout and claim a membership NFT.",
            components: [row],
        });
        return;
    }
    const { walletAddresses } = user?.toJSON();
    for (const walletAddress of walletAddresses) {
        const validMembership = await (0, unlock_1.hasMembership)(walletAddress, config_1.config.paywallConfig);
        if (validMembership) {
            let role = interaction.guild?.roles.cache.get(config_1.config.roleId);
            if (!role) {
                const fetchedRole = await interaction.guild?.roles.fetch(config_1.config.roleId);
                role = fetchedRole;
            }
            await interaction.member.roles.add(role);
            await interaction.editReply({
                content: `You already have a valid Unlock Membership. Welcome to Unlock Community, ${interaction.member.user}. You can start sending messages now.`,
            });
            return;
        }
    }
}
async function UnlockCommandHandler(interaction) {
    if (interaction.commandName === "ping") {
        return interaction.reply({
            ephemeral: true,
            content: "Pong!",
        });
    }
    if (interaction.commandName === "unlock") {
        await interaction.deferReply({
            ephemeral: true,
        });
        let role = await interaction.guild?.roles.fetch(config_1.config.roleId);
        const hasRole = (interaction.member?.roles).cache.get(role.id);
        if (hasRole) {
            await interaction.editReply({
                content: `You are already a member of Unlock Community, ${interaction.member?.user}. You can send messages.`,
            });
            return;
        }
        const user = await database_1.User.findOne({
            where: {
                id: interaction.member?.user.id,
            },
        });
        if (!user) {
            const [nounce] = await database_1.Nounce.upsert({
                id: crypto_1.default.randomUUID(),
                userId: interaction.member.user.id,
            });
            const nounceData = nounce.toJSON();
            const checkoutURL = new URL(`/checkout/${nounceData.id}`, config_1.config.host);
            const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setStyle("LINK")
                .setLabel("Claim Membership")
                .setURL(checkoutURL.toString())
                .setEmoji("🔑"));
            await interaction.editReply({
                content: "You need to go through the checkout and claim a membership NFT.",
                components: [row],
            });
            return;
        }
        const { walletAddresses } = user?.toJSON();
        for (const walletAddress of walletAddresses) {
            const validMembership = await (0, unlock_1.hasMembership)(walletAddress, config_1.config.paywallConfig);
            if (validMembership) {
                let role = interaction.guild?.roles.cache.get(config_1.config.roleId);
                if (!role) {
                    const fetchedRole = await interaction.guild?.roles.fetch(config_1.config.roleId);
                    role = fetchedRole;
                }
                await interaction.member.roles.add(role);
                await interaction.editReply({
                    content: `You already have a valid Unlock Membership. Welcome to Unlock Community, ${interaction.member.user}. You can start sending messages now.`,
                });
                return;
            }
        }
    }
}
fastify.get("/checkout/:nounce", async (request, response) => {
    const checkoutURL = new URL("/checkout", "https://app.unlock-protocol.com");
    checkoutURL.searchParams.set("paywallConfig", JSON.stringify(config_1.config.paywallConfig));
    if (request.params.nounce) {
        checkoutURL.searchParams.set("redirectUri", new URL(`/access/${request.params.nounce}`, config_1.config.host).toString());
    }
    else {
        checkoutURL.searchParams.set("redirectUri", new URL("/membership", config_1.config.host).toString());
    }
    return response.redirect(checkoutURL.toString());
});
fastify.get("/access/:nounce", async (request, response) => {
    const nounce = await database_1.Nounce.findOne({
        where: {
            id: request.params.nounce,
        },
    });
    if (!nounce) {
        return response.status(404).send({
            message: "We could not find a valid request for the specified nounce. Please go through the bot again to regenerate a new one.",
        });
    }
    const { userId } = nounce.toJSON();
    const { guildId, roleId } = config_1.config;
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    const role = await guild.roles.fetch(roleId);
    await member.roles.add(role);
    const channel = await guild.channels.fetch(config_1.config.channelId);
    if (channel?.type === "GUILD_TEXT") {
        await channel.send({
            content: `Welcome to the Unlock Community, ${member.user}. You can start sending messages now.`,
        });
    }
    response.redirect(`https://discord.com/channels/${guildId}`);
    await nounce.destroy();
    const walletAddress = ethers_1.ethers.utils.verifyMessage(config_1.config.paywallConfig.messageToSign, request.query.signature);
    await (0, database_1.appendWalletAddress)(userId, walletAddress);
    return;
});
fastify.get("/membership", async (req, res) => {
    const { signature } = req.query;
    if (!signature) {
        return res.status(401).send({
            message: "You need signature in the query params",
        });
    }
    const { paywallConfig } = config_1.config;
    const walletAddress = ethers_1.ethers.utils.verifyMessage(paywallConfig.messageToSign, signature);
    const hasValidMembership = await (0, unlock_1.hasMembership)(walletAddress, paywallConfig);
    if (hasValidMembership) {
        const discordOauthURL = oauth.generateAuthUrl({
            redirectUri: new URL(`/access`, config_1.config.host).toString(),
            scope: ["guilds", "guilds.join", "identify"],
        });
        return res.redirect(discordOauthURL.toString());
    }
    else {
        return res.redirect(new URL(`/checkout`, config_1.config.host).toString());
    }
});
fastify.get("/access", async (req, res) => {
    try {
        const code = req.query.code;
        const { guildId, roleId } = config_1.config;
        const data = await oauth.tokenRequest({
            code,
            grantType: "authorization_code",
            scope: ["guilds", "guilds.join", "identify"],
            redirectUri: new URL(`/access`, config_1.config.host).toString(),
        });
        const user = await oauth.getUser(data.access_token);
        const userGuilds = await oauth.getUserGuilds(data.access_token);
        const userGuildIds = userGuilds.map((guild) => guild.id);
        const guild = await client.guilds.fetch(guildId);
        if (userGuildIds.includes(guildId)) {
            const member = await guild.members.fetch(user.id);
            const role = await guild.roles.fetch(roleId);
            await member.roles.add(role);
        }
        else {
            await oauth.addMember({
                userId: user.id,
                guildId,
                roles: [roleId],
                botToken: config_1.config.token,
                accessToken: data.access_token,
            });
        }
        const channel = await guild.channels.fetch(config_1.config.channelId);
        if (channel?.type === "GUILD_TEXT") {
            await channel.send({
                content: `Welcome to the Unlock Community, ${user}. You can start sending messages now.`,
            });
        }
        return res.redirect(`https://discord.com/channels/${guildId}`);
    }
    catch (error) {
        fastify.log.error(error.message);
        return res.status(500).send({
            message: "There was an error in accessing Unlock Discord. Please contact one of the team members.",
        });
    }
});
fastify.addHook("onReady", async () => {
    try {
        await database_1.sequelize.sync();
        await client.login(config_1.config.token);
        await restClient.put(v9_1.Routes.applicationGuildCommands(config_1.config.clientId, config_1.config.guildId), {
            body: commands_1.commands,
        });
        client.on("ready", () => {
            fastify.log.info(`Discord bot connected!`);
        });
        client.on("guildMemberAdd", async (member) => {
            if (member.guild.id !== config_1.config.guildId) {
                return;
            }
            let channel = member.guild.channels.cache.get(config_1.config.channelId);
            if (!channel) {
                const fetchedChannel = await member.guild.channels.fetch(config_1.config.channelId);
                channel = fetchedChannel;
            }
            if (channel.type !== "GUILD_TEXT") {
                return;
            }
            const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId("unlock")
                .setLabel("Unlock Discord")
                .setStyle("PRIMARY")
                .setEmoji("🔐"));
            await channel.send({
                content: `Hello ${member.user}! Are you ready to be a part of the Unlock Community? Press unlock button to start.`,
                components: [row],
            });
        });
        client.on("interactionCreate", async (interaction) => {
            if (interaction.isButton()) {
                if (interaction.customId === "unlock") {
                    return unlockInteractionHandler(interaction);
                }
            }
            if (interaction.isCommand()) {
                return UnlockCommandHandler(interaction);
            }
        });
    }
    catch (error) {
        if (error instanceof Error) {
            fastify.log.error(error.message);
        }
        process.exit(1);
    }
});
fastify.listen(port, "0.0.0.0", async (error, address) => {
    if (error) {
        fastify.log.error(error.message);
        process.exit(0);
    }
    fastify.log.info(address);
});
