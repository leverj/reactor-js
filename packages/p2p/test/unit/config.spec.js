import {wallets} from '@leverj/lever.chain-deployment/hardhat.help'
import {configure} from '@leverj/lever.config'
import {expect} from 'expect'
import {rmSync, writeFileSync} from 'node:fs'
import {postLoad, schema} from '../../config.schema.js'

describe(`config`, () => {
  const NODE_ENV = 'livenet'
  const privateKey = wallets[0].privateKey

  it('can use privateKey', async () => {
    expect(await configure(schema, postLoad, {env: {NODE_ENV, COORDINATOR_WALLET_PRIVATE_KEY: privateKey}})).toMatchObject({
      chain: {coordinator: {wallet: {privateKey}}}
    })
  })

  it('can use privateKeyFile as alternative to privateKey', async () => {
    const COORDINATOR_WALLET_PRIVATE_KEY_FILE = `${import.meta.dirname}/config.json`

    try {
      await expect(() => configure(schema, postLoad, {env: {NODE_ENV}})).rejects.toThrow(
        /missing: privateKeyFile/
      )

      writeFileSync(COORDINATOR_WALLET_PRIVATE_KEY_FILE, 'bla bla bla')
      await expect(() => configure(schema, postLoad, {env: {NODE_ENV, COORDINATOR_WALLET_PRIVATE_KEY_FILE}})).rejects.toThrow(
        /Unexpected token .+ is not valid JSON/
      )

      writeFileSync(COORDINATOR_WALLET_PRIVATE_KEY_FILE, JSON.stringify({whatever: privateKey}))
      await expect(() => configure(schema, postLoad, {env: {NODE_ENV, COORDINATOR_WALLET_PRIVATE_KEY_FILE}})).rejects.toThrow(
        /missing: json file .+ has no privateKey entry/
      )

      writeFileSync(COORDINATOR_WALLET_PRIVATE_KEY_FILE, JSON.stringify({privateKey}))
      expect(await configure(schema, postLoad, {env: {NODE_ENV, COORDINATOR_WALLET_PRIVATE_KEY_FILE}})).toMatchObject({
        chain: {coordinator: {wallet: {privateKey}}},
      })
    } finally {
      rmSync(COORDINATOR_WALLET_PRIVATE_KEY_FILE)
    }
  })
})
