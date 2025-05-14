import { BASE_URL } from './constants'
import { SessionResponse } from '../src/schemas/session'
import { createHmac, timingSafeEqual } from 'crypto'

type NexformOptions = {
  apiKey: string
  webhookSecret?: string
}

type CreateSessionOptions = {
  formType: 'w9' | 'w8ben' | 'w8bene'
  reference?: string
  successUrl?: string
  signerEmail?: string
  customization?: string
  brandId?: string
  expiresAt?: Date
  expirationMessage?: string
  formData?: any
}

export class Nextform {
  readonly apiKey: string
  readonly webhookSecret: string

  constructor({ apiKey, webhookSecret = '' }: NexformOptions) {
    this.apiKey = apiKey
    this.webhookSecret = webhookSecret
  }

  async createSession({
    formType,
    reference,
    successUrl,
    signerEmail,
    customization,
    brandId,
    expiresAt,
    expirationMessage,
    formData,
  }: CreateSessionOptions): Promise<SessionResponse> {
    const res = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        formType,
        reference,
        successUrl,
        signerEmail,
        customization,
        brandId,
        expiresAt,
        expirationMessage,
        formData,
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to create session')
    }

    const data = await res.json()

    return data as SessionResponse
  }

  verifyWebhook({ body, signature }: { body: string | object; signature: string }): boolean {
    if (typeof signature !== 'string') return false

    const signatureValues = signature.split(',')
    const signatureTimestamp = signatureValues.find((s) => s.startsWith('t='))?.replace('t=', '')
    const signatureHash = signatureValues.find((s) => s.startsWith('s='))?.replace('s=', '')
    if (!(signatureTimestamp && signatureHash)) return false

    // For convenience, if the body is an object, stringify it
    if (typeof body === 'object' && body !== null) {
      body = JSON.stringify(body)
    }

    const payload = signatureTimestamp + '.' + body
    const recalculatedHash = createHmac('sha256', this.webhookSecret).update(payload).digest('hex')
    return timingSafeEqual(Buffer.from(signatureHash), Buffer.from(recalculatedHash))
  }
}
