import {configure} from '@leverj/config'

const dataDir = `${import.meta.dirname}/../../data`

const schema = {
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
      default: `${dataDir}/p2p`,
      env: 'BRIDGE_CONF_DIR',
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
          format: '*',
          default: null,
          nullable: false,
          sensitive: true,
          env: 'COORDINATOR_WALLET_PRIVATE_KEY',
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

export default await configure(schema)
