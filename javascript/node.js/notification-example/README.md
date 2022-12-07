# Notification worker

This is a simple notification worker that can be used to send notifications on discord when network balance on hosted locksmith is low.

## Setup

1. Run yarn install
2. Setup environment variables using wrangler

```bash
wrangler secret put DISCORD_WEBHOOK_URL # https://discord.com/api/webhooks/...
wrangler secret put LOCKSMITH_URL # https://locksmith.unlock-protocol.com
wrangler secret put DISCORD_USER_ID # 1234567890
```

3. Run wrangler publish

If running in development, use `wrangler dev --test-scheduled` to run the worker locally. This will run the worker every 5 minutes.
