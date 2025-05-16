# JavaScript Library for W-9 and W-8BEN

This JavaScript library helps you collect, generate, and keep track of commonly requested IRS forms such as W-9, W-8BEN, and W-8BEN-E using the Nextform API.

### Install

```bash
npm i @balancer-team/nextform
```

### Usage

Provide your API key and optional webhook secret to the `Nextform` constructor. You can obtain a free API key by signing up at [nextform.app](https://nextform.app/).

```ts
import { Nextform } from '@balancer-team/nextform'

const nextform = new Nextform({
  apiKey: 'YOUR_API_KEY',
  webhookSecret: 'YOUR_WEBHOOK_SECRET',
})
```

Set up a session by calling `createSession` with the desired form type. The form type can be one of the following:

- `w9` - Form W-9 (Request for Taxpayer Identification Number and Certification)
- `w8ben` - Form W-8BEN (Certificate of Foreign Status of Beneficial Owner)
- `w8bene` - Form W-8BEN-E (Certificate of Status of Beneficial Owner for Entities)

```ts
const session = await nextform.createSession({
  formType: 'w9', // or 'w8ben' or 'w8bene'
})

// Output:
//
// {
//   id: 'oymuG8Hz2NJJVrEvYNM5e',
//   formType: 'w9',
//   reference: '',
//   status: 'open',
//   url: 'https://nextform.app/form/w9/oymuG8Hz2NJJVrEvYNM5e',
//   ...
// }
```

The [session object](https://nextform.app/docs/create-session) contains a URL that you can use to open the form in a browser. Redirect your users to this URL to collect the form data.

### Receive and Verify Webhooks

To receive webhooks, set up a webhook endpoint in your application. The endpoint should verify the webhook signature using the `verifyWebhook` method. This ensures that the webhook is from Nextform and not from an unauthorized source. The below example uses the `express` library to set up a simple webhook endpoint. Modify the code below to use your preferred web framework.

```ts
router.post('/webhook', async (req, res) => {
  // Obtain the signature and body from the request
  const signature = req.get('Nextform-Signature')
  const body = JSON.stringify(req.body) // Assumes you are using express.json() middleware

  // Verify the webhook signature
  const isVerified = nextform.verifyWebhook({ signature: signature, body: body }) // true or false
  if (!isVerified) return res.status(401).send('Invalid signature.')

  // Add your code to handle the data from the webhook
  const data = req.body
  // ...
})
```
