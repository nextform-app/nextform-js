import 'dotenv/config'
import test from 'node:test'
import assert from 'node:assert'
import { Nextform } from '../src/index'

// Before testing, ensure that the API_KEY environment variable is set
if (!process.env.API_KEY) throw new Error('API_KEY environment variable is not set')

const nextform = new Nextform({ apiKey: process.env.API_KEY })

test('Create session with form type only', async () => {
  const data = await nextform.createSession({
    formType: 'w9',
  })
  assert.ok(data)
  assert.strictEqual(data.formType, 'w9')
})
