import {buildModule} from '@nomicfoundation/hardhat-ignition'

export const ContractWithLibraryModule = buildModule('ContractWithLibrary', (m) => {
  // To use a library, you first deploy it with `m.library`
  const library = m.library('BasicLibrary')

  // We then pass it as an option to `m.contract`
  const contractWithLibrary = m.contract('ContractWithLibrary', [], {
    libraries: {BasicLibrary: library},
  })

  return {
    contractWithLibrary,
  }
})
