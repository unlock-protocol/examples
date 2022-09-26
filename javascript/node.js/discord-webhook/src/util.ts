import crypto from 'crypto'
import { ColorResolvable } from 'discord.js'
import fetch from 'cross-fetch'

export function chunk<T>(array: readonly T[], size: number) {
  if (!array.length) {
    return []
  }

  const result: T[][] = []

  let currentIndex = 0

  while (currentIndex < array.length) {
    result.push(array.slice(currentIndex, currentIndex + size))
    currentIndex += size
  }
  return result
}

interface CreateSignatureOptions {
  content: string
  secret: string
  algorithm: string
}
export function createSignature({
  secret,
  content,
  algorithm,
}: CreateSignatureOptions) {
  const signature = crypto
    .createHmac(algorithm, secret)
    .update(content)
    .digest('hex')
  return signature
}

interface SubscriptionOptions {
  callbackEndpoint: string
  hubEndpoint: string
  topic: string
  mode: 'subscribe' | 'unsubscribe'
  leaseSeconds?: number
  secret?: string
}

export async function websubRequest({
  hubEndpoint,
  callbackEndpoint,
  mode,
  leaseSeconds = 86000,
  secret,
}: SubscriptionOptions) {
  const formData = new URLSearchParams()
  formData.set('hub.topic', hubEndpoint)
  formData.set('hub.callback', callbackEndpoint)
  formData.set('hub.mode', mode)
  formData.set('hub.lease_seconds', leaseSeconds.toString(10))
  if (secret) {
    formData.set('hub.secret', secret)
  }
  const result = await fetch(hubEndpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  if (!result.ok) {
    throw new Error(`failed to subscribe: ${result.statusText}`)
  }
  const text = await result.text()
  return text
}

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const NETWORK_COLOR: Record<string, ColorResolvable> = {
  '1': '#3c3c3d',
  '10': '#ff001b',
  '100': '#39a7a1',
  '137': '#8146d9',
  '56': '#f8ba33',
}

interface Network {
  id: number
  name: string
  explorer: {
    name: string
    urls: {
      address(address: string): string
    }
  }
}

export const networks: Record<string, Network> = {
  '1': {
    id: 1,
    name: 'Ethereum',
    explorer: {
      name: 'Etherscan',
      urls: {
        address: (address) => `https://etherscan.io/address/${address}`,
      },
    },
  },
  '10': {
    id: 10,
    name: 'Optimism',
    explorer: {
      name: 'Etherscan',
      urls: {
        address: (address) =>
          `https://optimistic.etherscan.io/address/${address}`,
      },
    },
  },
  '100': {
    id: 100,
    name: 'xDai',
    explorer: {
      name: 'Blockscout',
      urls: {
        address: (address) =>
          `https://blockscout.com/poa/xdai/address/${address}/transactions`,
      },
    },
  },
  '56': {
    id: 56,
    name: 'Binance Smart Chain',
    explorer: {
      name: 'BscScan',
      urls: {
        address: (address) => `https://bscscan.com/address/${address}`,
      },
    },
  },
  '137': {
    id: 137,
    name: 'Polygon',
    explorer: {
      name: 'Polygonscan',
      urls: {
        address: (address) => `https://polygonscan.com/address/${address}`,
      },
    },
  },
  '4': {
    id: 4,
    name: 'Rinkeby',
    explorer: {
      name: 'Etherscan',
      urls: {
        address: (address) => `https://rinkeby.etherscan.io/address/${address}`,
      },
    },
  },
  '5': {
    id: 5,
    name: 'Goerli (Testnet)',
    explorer: {
      name: 'Goerli (Testnet)',
      urls: {
        address: (address) => `https://goerli.etherscan.io/address/${address}`,
      },
    },
  },
  '80001': {
    id: 80001,
    name: 'Mumbai (Polygon)',
    explorer: {
      name: 'PolygonScan (Mumbai)',
      urls: {
        address: (address) =>
          `https://mumbai.polygonscan.com/address/${address}`,
      },
    },
  },
  '42220': {
    id: 42220,
    name: 'Celo',
    explorer: {
      name: 'Celoscan',
      urls: {
        address: (address) => `https://celoscan.io/address/${address}`,
      },
    },
  },
}
