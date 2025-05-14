"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nextform = void 0;
const constants_1 = require("./constants");
const crypto_1 = require("crypto");
class Nextform {
    apiKey;
    webhookSecret;
    constructor({ apiKey, webhookSecret = '' }) {
        this.apiKey = apiKey;
        this.webhookSecret = webhookSecret;
    }
    async createSession({ formType, reference, successUrl, signerEmail, customization, brandId, expiresAt, expirationMessage, formData, }) {
        const res = await fetch(`${constants_1.BASE_URL}/sessions`, {
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
        });
        if (!res.ok) {
            throw new Error('Failed to create session');
        }
        const data = await res.json();
        return data;
    }
    verifyWebhook({ body, signature }) {
        if (typeof signature !== 'string')
            return false;
        const signatureValues = signature.split(',');
        const signatureTimestamp = signatureValues.find((s) => s.startsWith('t='))?.replace('t=', '');
        const signatureHash = signatureValues.find((s) => s.startsWith('s='))?.replace('s=', '');
        if (!(signatureTimestamp && signatureHash))
            return false;
        // For convenience, if the body is an object, stringify it
        if (typeof body === 'object' && body !== null) {
            body = JSON.stringify(body);
        }
        const payload = signatureTimestamp + '.' + body;
        const recalculatedHash = (0, crypto_1.createHmac)('sha256', this.webhookSecret).update(payload).digest('hex');
        return (0, crypto_1.timingSafeEqual)(Buffer.from(signatureHash), Buffer.from(recalculatedHash));
    }
}
exports.Nextform = Nextform;
