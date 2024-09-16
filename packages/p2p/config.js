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
  timeout: {
    format: 'nat',
    default: 100,
    env: 'TIMEOUT',
  },
  tryCount: {
    format: 'nat',
    default: 50,
    env: 'TRY_COUNT',
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
    polling: {
      interval: {
        format: 'nat',
        default: 15 /* seconds */ * 1000,
        env: 'CHAIN_POLLING_INTERVAL',
      },
      attempts: {
        format: 'nat',
        default: 5,
        env: 'CHAIN_POLLING_ATTEMPTS',
      },
    },
  }
}

export default await configure(schema)
