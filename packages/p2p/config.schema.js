import {existsSync, readFileSync} from 'node:fs'

export const schema = {
  env: {
    doc: 'The application environment',
    format: ['livenet', 'production', 'develop', 'dev', 'e2e', 'test'],
    default: 'livenet',
    env: 'NODE_ENV',
  },
  externalIp: {
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'EXTERNAL_IP',
  },
  port: {
    format: 'port',
    default: 9000,
    env: 'PORT',
  },
  ip: {
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'IP',
  },
  messaging: {
    attempts: {
      format: 'nat',
      default: 50,
      env: 'MESSAGING_ATTEMPTS',
    },
    interval: {
      format: 'nat',
      default: 100,
      env: 'MESSAGING_INTERVAL',
    },
    timeout: {
      format: 'nat',
      default: 100,
      env: 'MESSAGING_TIMEOUT',
    },
  },
  bridge: {
    nodesDir: {
      format: String,
      default: `${process.env.PWD}/data/p2p`,
      env: 'BRIDGE_NODES_DIR',
    },
    port: {
      format: 'port',
      default: 10000,
      env: 'BRIDGE_PORT',
    },
    threshold: {
      format: 'nat',
      default: 4,
      env: 'BRIDGE_THRESHOLD',
    },
    bootstrapNodes: {
      format: 'json',
      default: [],
      env: 'BRIDGE_BOOTSTRAP_NODES',
    },
  },
  chain: {
    coordinator: {
      wallet: {
        privateKey: {
          doc: 'the privateKey for the wallet',
          format: '*',
          default: null,
          nullable: true,
          sensitive: true,
          env: 'COORDINATOR_WALLET_PRIVATE_KEY',
        },
        privateKeyFile: {
          doc: 'full path to json file containing `privateKey` entry for the wallet (secured way to provide the privateKey above)',
          format: String,
          default: null,
          nullable: true,
          env: 'COORDINATOR_WALLET_PRIVATE_KEY_FILE',
        },
      }
    },
    tracker: {
      polling: {
          attempts: {
            format: 'nat',
            default: 5,
            env: 'TRACKER_POLLING_ATTEMPTS',
          },
        interval: {
          format: 'nat',
          default: 15 /* seconds */ * 1000,
            env: 'TRACKER_POLLING_INTERVAL',
        },
      },
    },
  }
}

function setPrivateKeyIn(object) {
  const {privateKey, privateKeyFile} = object
  if (!privateKey) {
    if (!privateKeyFile) throw Error(`missing: privateKeyFile (as alternative to privateKey)`)
    if (!existsSync(privateKeyFile)) throw Error(`no such file: ${privateKeyFile}`)
    const json = JSON.parse(readFileSync(privateKeyFile, 'utf8'))
    if (!json.privateKey) throw Error(`missing: json file ${privateKeyFile} has no privateKey entry`)
    object.privateKey = json.privateKey
  }
}

export function postLoad(config) {
  setPrivateKeyIn(config.chain.coordinator.wallet)
  return config
}
