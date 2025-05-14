import { SessionResponse } from '../src/schemas/session';
type NexformOptions = {
    apiKey: string;
    webhookSecret?: string;
};
type CreateSessionOptions = {
    formType: 'w9' | 'w8ben' | 'w8bene';
    reference?: string;
    successUrl?: string;
    signerEmail?: string;
    customization?: string;
    brandId?: string;
    expiresAt?: Date;
    expirationMessage?: string;
    formData?: any;
};
export declare class Nextform {
    readonly apiKey: string;
    readonly webhookSecret: string;
    constructor({ apiKey, webhookSecret }: NexformOptions);
    createSession({ formType, reference, successUrl, signerEmail, customization, brandId, expiresAt, expirationMessage, formData, }: CreateSessionOptions): Promise<SessionResponse>;
    verifyWebhook({ body, signature }: {
        body: string | object;
        signature: string;
    }): boolean;
}
export {};
