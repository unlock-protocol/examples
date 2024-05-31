import Fastify from 'fastify'
import DiscordOauth from 'discord-oauth2'
import { config } from './config'
import crypto from 'crypto'
import cookie from '@fastify/cookie'
import {
  Client,
  Role,
  MessageActionRow,
  MessageButton,
  ButtonInteraction,
  GuildMemberRoleManager,
  CommandInteraction,
} from 'discord.js'
import { sequelize, Nounce, User, appendWalletAddress } from './database'
import { hasMembership } from './unlock'
import { ethers } from 'ethers'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { commands } from './commands'

const port = process.env.PORT || 8080

const client = new Client({
  intents: ['GUILD_MEMBERS'],
})

const oauth = new DiscordOauth({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
})

const restClient = new REST({
  version: '9',
}).setToken(config.token)

const fastify = Fastify({
  logger: true,
})

fastify.addHook('onClose', async (_, done) => {
  await sequelize.close()
  await client.destroy()
})

fastify.register(cookie, {
  parseOptions: {},
})

async function unlockInteractionHandler(interaction: ButtonInteraction) {
  await interaction.deferReply({
    ephemeral: true,
  })

  let role = await interaction.guild?.roles.fetch(config.roleId)

  const hasRole = (
    interaction.member?.roles as GuildMemberRoleManager
  ).cache.get(role!.id)

  if (hasRole) {
    await interaction.editReply({
      content: `You are already a member of Unlock Community, ${interaction.member?.user}. You can send messages.`,
    })
    return
  }
  const user = await User.findOne({
    where: {
      id: interaction.member?.user.id,
    },
  })

  if (!user) {
    const [nounce] = await Nounce.upsert({
      id: crypto.randomUUID(),
      userId: interaction.member!.user.id,
    })

    const nounceData = nounce.toJSON()

    const checkoutURL = new URL(`/checkout/${nounceData.id}`, config.host!)

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle('LINK')
        .setLabel('Buy Membership')
        .setURL(checkoutURL.toString())
        .setEmoji('🔑')
    )
    await interaction.editReply({
      content:
        'You need to go through the checkout and claim a membership NFT.',
      components: [row],
    })
    return
  }

  const { walletAddresses } = user?.toJSON()

  for (const walletAddress of walletAddresses) {
    const validMembership = await hasMembership(
      walletAddress,
      config.paywallConfig
    )

    if (validMembership) {
      let role = interaction.guild?.roles.cache.get(config.roleId)

      if (!role) {
        const fetchedRole = await interaction.guild?.roles.fetch(config.roleId)
        role = fetchedRole!
      }

      await (interaction.member!.roles as GuildMemberRoleManager).add(role)

      await interaction.editReply({
        content: `You already have a valid Unlock Membership. Welcome to Unlock Community, ${
          interaction.member!.user
        }. You can start sending messages now.`,
      })
      return
    }
  }
}

async function UnlockCommandHandler(interaction: CommandInteraction) {
  if (interaction.commandName === 'ping') {
    return interaction.reply({
      ephemeral: true,
      content: 'Pong!',
    })
  }
  if (interaction.commandName === 'unlock') {
    await interaction.deferReply({
      ephemeral: true,
    })

    let role = await interaction.guild?.roles.fetch(config.roleId)

    // const hasRole = (
    //   interaction.member?.roles as GuildMemberRoleManager
    // ).cache.get(role!.id);

    // if (hasRole) {
    //   await interaction.editReply({
    //     content: `You are already a member of Unlock Community, ${interaction.member?.user}. You can send messages.`,
    //   });
    //   return;
    // }

    const user = await User.findOne({
      where: {
        id: interaction.member?.user.id,
      },
    })

    if (!user) {
      const [nounce] = await Nounce.upsert({
        id: crypto.randomUUID(),
        userId: interaction.member!.user.id,
      })

      const nounceData = nounce.toJSON()

      const checkoutURL = new URL(`/checkout/${nounceData.id}`, config.host!)

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle('LINK')
          .setLabel('Claim Membership')
          .setURL(checkoutURL.toString())
          .setEmoji('🔑')
      )
      await interaction.editReply({
        content:
          'You need to go through the checkout and claim a membership NFT.',
        components: [row],
      })
      return
    }

    const { walletAddresses } = user?.toJSON()

    for (const walletAddress of walletAddresses) {
      const validMembership = await hasMembership(
        walletAddress,
        config.paywallConfig
      )

      if (validMembership) {
        let role = interaction.guild?.roles.cache.get(config.roleId)

        if (!role) {
          const fetchedRole = await interaction.guild?.roles.fetch(
            config.roleId
          )
          role = fetchedRole!
        }

        await (interaction.member!.roles as GuildMemberRoleManager).add(role)

        await interaction.editReply({
          content: `You already have a valid Unlock Membership. Welcome to Unlock Community, ${
            interaction.member!.user
          }. You can start sending messages now.`,
        })
        return
      }
    }
  }
}

fastify.get<{
  Params: {
    nounce: string
  }
}>('/checkout/:nounce', async (request, response) => {
  const checkoutURL = new URL('/checkout', 'https://app.unlock-protocol.com')
  checkoutURL.searchParams.set(
    'paywallConfig',
    JSON.stringify(config.paywallConfig)
  )

  if (request.params.nounce) {
    checkoutURL.searchParams.set(
      'redirectUri',
      new URL(`/access/${request.params.nounce}`, config.host!).toString()
    )
  } else {
    checkoutURL.searchParams.set(
      'redirectUri',
      new URL('/membership', config.host!).toString()
    )
  }
  return response.redirect(checkoutURL.toString())
})

fastify.get<{
  Params: {
    nounce: string
  }
  Querystring: {
    signature: string
  }
}>('/access/:nounce', async (request, response) => {
  const nounce = await Nounce.findOne({
    where: {
      id: request.params.nounce,
    },
  })

  if (!nounce) {
    return response.status(404).send({
      message:
        'We could not find a valid request for the specified nounce. Please go through the bot again to regenerate a new one.',
    })
  }
  const { userId } = nounce.toJSON()
  const { guildId, roleId } = config
  const guild = await client.guilds.fetch(guildId)
  const member = await guild.members.fetch(userId!)
  const role = await guild.roles.fetch(roleId)
  await member.roles.add(role as Role)

  const channel = await guild.channels.fetch(config.channelId)

  if (channel?.type === 'GUILD_TEXT') {
    await channel.send({
      content: `Welcome to the Unlock Community, ${member.user}. You can start sending messages now.`,
    })
  }
  response.redirect(`https://discord.com/channels/${guildId}`)

  await nounce.destroy()

  const walletAddress = ethers.utils.verifyMessage(
    config.paywallConfig.messageToSign,
    request.query.signature
  )
  await appendWalletAddress(userId!, walletAddress)
  return
})

fastify.get<{
  Querystring: {
    signature: string
  }
}>('/membership', async (req, res) => {
  const { signature } = req.query
  if (!signature) {
    return res.status(401).send({
      message: 'You need signature in the query params',
    })
  }
  const { paywallConfig } = config
  const walletAddress = ethers.utils.verifyMessage(
    paywallConfig.messageToSign,
    signature
  )
  const hasValidMembership = await hasMembership(walletAddress, paywallConfig)

  if (hasValidMembership) {
    const discordOauthURL = oauth.generateAuthUrl({
      redirectUri: new URL(`/access`, config.host).toString(),
      scope: ['guilds', 'guilds.join', 'identify'],
    })

    return res.redirect(discordOauthURL.toString())
  } else {
    return res.redirect(new URL(`/checkout`, config.host!).toString())
  }
})

fastify.get<{
  Querystring: {
    code: string
  }
}>('/access', async (req, res) => {
  try {
    const code = req.query.code
    const { guildId, roleId } = config
    const data = await oauth.tokenRequest({
      code,
      grantType: 'authorization_code',
      scope: ['guilds', 'guilds.join', 'identify'],
      redirectUri: new URL(`/access`, config.host).toString(),
    })

    const user = await oauth.getUser(data.access_token)
    const userGuilds = await oauth.getUserGuilds(data.access_token)
    const userGuildIds = userGuilds.map((guild) => guild.id)
    const guild = await client.guilds.fetch(guildId)
    if (userGuildIds.includes(guildId!)) {
      const member = await guild.members.fetch(user.id)
      const role = await guild.roles.fetch(roleId!)
      await member.roles.add(role!)
    } else {
      await oauth.addMember({
        userId: user.id,
        guildId,
        roles: [roleId],
        botToken: config.token!,
        accessToken: data.access_token,
      })
    }
    const channel = await guild.channels.fetch(config.channelId)

    if (channel?.type === 'GUILD_TEXT') {
      await channel.send({
        content: `Welcome to the Unlock Community, ${user}. You can start sending messages now.`,
      })
    }
    return res.redirect(`https://discord.com/channels/${guildId}`)
  } catch (error: any) {
    fastify.log.error(error.message)
    return res.status(500).send({
      message:
        'There was an error in accessing Unlock Discord. Please contact one of the team members.',
    })
  }
})

fastify.addHook('onReady', async () => {
  try {
    await sequelize.sync()
    await client.login(config.token)

    await restClient.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      {
        body: commands,
      }
    )

    client.on('ready', () => {
      fastify.log.info(`Discord bot connected!`)
    })

    client.on('guildMemberAdd', async (member) => {
      if (member.guild.id !== config.guildId) {
        return
      }

      let channel = member.guild.channels.cache.get(config.channelId)
      if (!channel) {
        const fetchedChannel = await member.guild.channels.fetch(
          config.channelId
        )
        channel = fetchedChannel!
      }

      if (channel.type !== 'GUILD_TEXT') {
        return
      }

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('unlock')
          .setLabel('Unlock Discord')
          .setStyle('PRIMARY')
          .setEmoji('🔐')
      )
      await channel.send({
        content: `Hello ${member.user}! Are you ready to be a part of the Unlock Community? Press unlock button to start.`,
        components: [row],
      })
    })

    client.on('interactionCreate', async (interaction) => {
      if (interaction.isButton()) {
        if (interaction.customId === 'unlock') {
          return unlockInteractionHandler(interaction)
        }
      }
      if (interaction.isCommand()) {
        return UnlockCommandHandler(interaction)
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      fastify.log.error(error.message)
    }
    process.exit(1)
  }
})

fastify.listen(port, '0.0.0.0', async (error, address) => {
  if (error) {
    fastify.log.error(error.message)
    process.exit(0)
  }
  fastify.log.info(address)
})
