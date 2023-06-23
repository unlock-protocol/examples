const baseURL = process.env.BASE_URL
const locksmithURL = process.env.LOCKSMITH_URL || ''

export const config = {
  id: process.env.DISCORD_WEBHOOK_ID!,
  token: process.env.DISCORD_WEBHOOK_TOKEN!,
  websubSecret: process.env.WEBSUB_SECRET!,
  locksmithURL,
  baseURL,
  leaseSeconds: 86400 * 90, // 90 days
}
