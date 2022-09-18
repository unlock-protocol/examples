import { WebhookClient, MessageEmbed } from 'discord.js'
import express from 'express'
import { config } from './config'
import { chunk, NETWORK_COLOR, networks, websubRequest, wait } from './util'
import { createIntentHandler, createWebsubMiddleware } from './middleware'

const port = process.env.PORT || 4000

const keysCallbackEndpoint = new URL(
  '/callback/keys',
  config.baseURL
).toString()

const locksCallbackEndpoint = new URL(
  '/callback/locks',
  config.baseURL
).toString()

const webhookClient = new WebhookClient({
  id: config.id,
  token: config.token,
})

const websubMiddleware = createWebsubMiddleware({
  secret: config.websubSecret,
})

const intentHandler = createIntentHandler({
  secret: config.websubSecret,
})

const app = express()
app.use(express.json())

app.get('/callback/locks', intentHandler)
app.get('/callback/keys', intentHandler)

app.post('/callback/locks', websubMiddleware, async (req) => {
  const embeds: MessageEmbed[] = []
  const locks: any[] = req.body?.data
  const network = networks[req.body?.network]
  const lockIds = locks.map((lock: any) => lock.id)

  console.info(`New Locks: ${lockIds.join(', ')}`)

  if (!locks.length) {
    return
  }

  for (const lock of locks) {
    const embed = new MessageEmbed()
    if (network) {
      embed.addField('network', network.name)

      const explorerURL = network.explorer.urls.address(lock.address)
      if (explorerURL) {
        embed.setURL(explorerURL)
      }
      const networkColor = NETWORK_COLOR[network.id]
      if (networkColor) {
        embed.setColor(networkColor)
      }
    }

    embed.setTitle(`New Lock (${lock.id})`)
    embeds.push(embed)
  }
  const embedChunks = chunk(embeds, 3)

  for (const embedChunk of embedChunks) {
    await webhookClient.send({
      embeds: embedChunk,
    })
  }
})

app.post('/callback/keys', websubMiddleware, async (req) => {
  const embeds: MessageEmbed[] = []
  const keys: any[] = req.body?.data
  const network = networks[req.body?.network]
  const keyIds = keys.map((key: any) => key.id)
  console.info(`New Keys: ${keyIds.join(', ')}`)
  if (!keys.length) {
    return
  }

  for (const key of keys) {
    const embed = new MessageEmbed()
    if (network) {
      embed.addField('network', network.name)

      const explorerURL = network.explorer.urls.address(key.lock.address)
      if (explorerURL) {
        embed.setURL(explorerURL)
      }

      const networkColor = NETWORK_COLOR[network.id]
      if (networkColor) {
        embed.setColor(networkColor)
      }
    }

    embed.setTitle(`New key (${key.id})`)
    embed.addField('lock', key.lock.address)
    embeds.push(embed)
  }
  const embedChunks = chunk(embeds, 3)
  for (const embedChunk of embedChunks) {
    await webhookClient.send({
      embeds: embedChunk,
    })
  }
})

async function subscribeHooks() {
  const subscribe = Object.values(networks).map(async (network) => {
    try {
      const locksEndpoint = new URL(
        `/api/hooks/${network.id}/locks`,
        config.locksmithURL
      ).toString()

      const keysEndpoint = new URL(
        `/api/hooks/${network.id}/keys`,
        config.locksmithURL
      ).toString()

      await websubRequest({
        hubEndpoint: locksEndpoint,
        callbackEndpoint: locksCallbackEndpoint,
        leaseSeconds: config.leaseSeconds,
        topic: locksEndpoint,
        mode: 'subscribe',
        secret: config.websubSecret,
      })

      await websubRequest({
        hubEndpoint: keysEndpoint,
        callbackEndpoint: keysCallbackEndpoint,
        leaseSeconds: config.leaseSeconds,
        topic: keysEndpoint,
        mode: 'subscribe',
        secret: config.websubSecret,
      })
    } catch (error) {
      console.error(error.message)
    }
  })

  await Promise.all(subscribe)
}

async function unsubscribeHooks() {
  const unsubscribe = Object.values(networks).map(async (network) => {
    try {
      const locksEndpoint = new URL(
        `/api/hooks/${network.id}/locks`,
        config.locksmithURL
      ).toString()

      const keysEndpoint = new URL(
        `/api/hooks/${network.id}/keys`,
        config.locksmithURL
      ).toString()

      await websubRequest({
        hubEndpoint: locksEndpoint,
        callbackEndpoint: locksCallbackEndpoint,
        topic: locksEndpoint,
        mode: 'unsubscribe',
        secret: config.websubSecret,
      })

      await websubRequest({
        hubEndpoint: keysEndpoint,
        callbackEndpoint: keysCallbackEndpoint,
        topic: keysEndpoint,
        mode: 'unsubscribe',
        secret: config.websubSecret,
      })
    } catch (error) {
      console.error(error.message)
    }
  })

  await Promise.all(unsubscribe)
}

async function shutdown() {
  console.info(`Shutting down the websub-discord bot`)
  await unsubscribeHooks()
  await wait(10000) // wait for 10 seconds to receive intent confirmation
  console.info('Unsubscribed to specified hooks')
  process.exit(0)
}

async function start() {
  console.log(`Listening for websub requests on port: ${port}`)
  // Renew subscription
  setInterval(() => subscribeHooks(), config.leaseSeconds)
  await subscribeHooks()
  console.info(`Subscribed to specified hooks`)
}

const server = app.listen(port)

server.on('listening', start)
server.on('close', shutdown)
process.on('SIGINT', shutdown)
