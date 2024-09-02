import {buildModule} from '@nomicfoundation/hardhat-ignition'

import {BasicDeploymentsModule} from './BasicDeploymentsModule.js'

export const SubmodulesExampleModule = buildModule('SubmodulesExample', (m) => {
  // You can import modules and use them as submodules with `m.useModule`.
  // Submodules allow you to reuse code and to organize your codebase.
  //
  // When you use a submodule, you get access to the contract futures
  // that it exports.
  const {helloWorld} = m.useModule(BasicDeploymentsModule)

  // If you use a submodule more than once, you get the exact same
  // Futures as result
  const {helloWorld: helloWorldAlias} = m.useModule(BasicDeploymentsModule)

  console.log('Are these futures the same?', helloWorldAlias === helloWorld)

  // You can re-export futures from submodules
  return {
    helloWorld,
  }
})
