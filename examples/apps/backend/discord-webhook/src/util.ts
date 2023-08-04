import crypto from 'crypto'
import { ColorResolvable } from 'discord.js'
import fetch from 'cross-fetch'
import { networks } from '@unlock-protocol/networks'
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
