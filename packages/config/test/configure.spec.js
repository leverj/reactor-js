import {expect} from 'expect'
import {rmSync, writeFileSync} from 'node:fs'

const packageDir = `${import.meta.dirname}/..`

const configName = 'testing_override'
const env = 'special'
const configFile = `${packageDir}/src/schema/${configName}.configure.js`
const local_override = `${packageDir}/src/override/local-${env}.js`

describe.skip(`${configName} config`, () => {
  before(() => {
    writeFileSync(configFile,
    `import {configure} from '@leverj/config/src/index.js'
    
    const schema = {
      env: {
        format: ['${env}', 'livenet'],
        default: 'livenet',
        env: 'NODE_ENV',
      },
      all_props: '',
      prop_1: {
        prop_1_2: ''
      },
      prop_2: '',
      prop_3 :'',
      dependencies: ['prop_1.prop_1_2', 'prop_2', 'prop_3']
    }
    
    export default async function (options = {}) {
      return configure('${configName}', schema, options)
    }`)
    writeFileSync(local_override,
    `export default {
      ${configName}: {
        all_props: function () { return this.prop_1.prop_1_2 + this.prop_2 + this.prop_3 },
        prop_1: {
          prop_1_2: function () { return 'prop_1_2' }
        },
        prop_2: function () { return this.prop_1.prop_1_2 + '_prop_2' },
        prop_3: function () { return this.prop_2 + 'prop_3' },
      }
    }`)
  })
  after(() => [local_override, configFile].forEach(_ => rmSync(_)))

  it('dependencies check', async () => {
    const configure = (await import(configFile)).default
    expect(await configure({env: {NODE_ENV: env}})).toMatchObject({
      env: env,
      all_props: 'prop_1_2prop_1_2_prop_2prop_1_2_prop_2prop_3',
      prop_1: {
        prop_1_2: 'prop_1_2',
      },
      prop_2: 'prop_1_2_prop_2',
      prop_3: 'prop_1_2_prop_2prop_3',
      dependencies: ['prop_1.prop_1_2', 'prop_2', 'prop_3'],
    })
  })
})
