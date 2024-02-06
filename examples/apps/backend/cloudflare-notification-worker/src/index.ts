/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */
import BigNumber from 'bignumber.js'
import { MINIMUM_BALANCES } from './minimum'
export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  DISCORD_WEBHOOK_URL: string
  DISCORD_USER_ID: string
  LOCKSMITH_URL: string
  NOTIFICATIONS: KVNamespace
}

interface Options {
  networkName: string
  networkId: string
  address: string
  balance: string
  minimum: string
  user: string
}

async function sendNotification(endpoint: string, options: Options) {
  const { networkName, networkId, address, balance, minimum, user } = options
  const body = {
    username: 'Unlock Alert',
    allowed_mentions: {
      parse: ['users'],
    },
    content: `<@${user}>`,
    embeds: [
      {
        title: `Low balance on ${networkName} network`,
        type: 'rich',
        description: `The balance on ${networkName} network is ${balance} which is lower the minimum threshold set at ${minimum}. Please fund it ASAP.`,
        fields: [
          {
            name: 'Network',
            value: networkName,
            inline: true,
          },
          {
            name: 'Network ID',
            value: networkId,
            inline: true,
          },
          {
            name: 'Address',
            value: address,
            inline: true,
          },
          {
            name: 'Balance',
            value: balance,
            inline: true,
          },
        ],
      },
    ],
  }

  const response = await fetch(endpoint, {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
    method: 'POST',
  })

  if (!response.ok) {
    console.error(response, options, response.statusText, response.status)
  } else {
    console.info(response, options, 'successfully sent notification')
  }
}

const notifyIfTooLow = async (
  env: Env,
  networkId: string,
  networkName: string,
  balance: string,
  address: string
) => {
  const minimumBalance = new BigNumber(MINIMUM_BALANCES[networkId])
  const networkBalance = new BigNumber(balance)
  if (networkBalance.gte(minimumBalance)) {
    return
  }

  await sendNotification(env.DISCORD_WEBHOOK_URL, {
    networkName,
    networkId,
    address,
    balance: networkBalance.toString(),
    minimum: minimumBalance.toString(),
    user: env.DISCORD_USER_ID,
  })
  await env.NOTIFICATIONS.put('last_sent', Date.now()?.toString())
}

const getBalances = async (env: Env, balanceEndpoint: URL) => {
  const lastSent = await env.NOTIFICATIONS.get('last_sent')
  // If sent a notification in the last 24 hours, do not send another one
  if (lastSent) {
    const lastSentDate = parseInt(lastSent)
    const diff = Date.now() - lastSentDate
    if (diff < 1000 * 60 * 60 * 24) {
      return
    }
  }

  const response = await fetch(balanceEndpoint.toString(), {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })

  const balances: Record<string, Record<string, string>> = await response.json()

  for (const [networkId, config] of Object.entries(balances)) {
    if (!Array.isArray(config)) {
      if (!Object.keys(config).length) {
        continue
      }
      await notifyIfTooLow(
        env,
        networkId,
        config.name,
        config.balance,
        config.address
      )
    } else {
      for (let i = 0; i < config.length; i++) {
        await notifyIfTooLow(
          env,
          networkId,
          config[i].name,
          config[i].balance,
          config[i].address
        )
      }
    }
  }
}

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    getBalances(env, new URL('/purchase', env.LOCKSMITH_URL))
  },
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const balances = await getBalances(
      env,
      new URL('/purchase', env.LOCKSMITH_URL)
    )
    return new Response(JSON.stringify(balances), {
      headers: {
        'content-type': 'application/json',
      },
    })
  },
}
