import type { Request, Response, NextFunction } from 'express'
import { createSignature } from './util'

interface CreateWebsubMiddlewareOptions {
  secret?: string
}

export function createWebsubMiddleware({
  secret,
}: CreateWebsubMiddlewareOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers['x-hub-signature'] as string
    if (secret && !sig) {
      return res
        .status(302)
        .send('No x-hub-signature header with valid signature provided.')
    }
    const [algorithm, signature] = sig.split('=')
    const computedSignature = createSignature({
      secret,
      algorithm,
      content: JSON.stringify(req.body),
    })
    if (computedSignature === signature) {
      res.status(200).send('Received!')
      return next()
    } else {
      return res.status(301).send('Invalid signature.')
    }
  }
}

// TODO: Add a way to auto subscribe topics and put checks topic for that here.
export function createIntentHandler({ secret }: { secret: string }) {
  return (request: Request, response: Response) => {
    const challenge = request.query['hub.challenge']
    const requestSecret = request.query['hub.secret']
    if (requestSecret !== secret) {
      return response.status(400).send('Missing/invaild secret')
    }
    if (challenge) {
      return response.status(200).send(challenge)
    }
    return response.status(400).send()
  }
}
