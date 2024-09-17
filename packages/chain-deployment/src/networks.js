export const networks = {
  abstractTestnet: {
    id: 11124n,
    label: 'abstractTestnet',
    name: 'Abstract Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    providerURL: 'https://api.testnet.abs.xyz',
    blockExplorer: {
      name: 'Abstract Block Explorer',
      url: 'https://explorer.testnet.abs.xyz'
    },
    contracts: {},
    testnet: true
  },
  acala: {
    id: 787n,
    label: 'acala',
    name: 'Acala',
    nativeCurrency: {
      name: 'Acala',
      symbol: 'ACA',
      decimals: 18
    },
    providerURL: 'https://eth-rpc-acala.aca-api.network',
    blockExplorer: {
      name: 'Acala Blockscout',
      url: 'https://blockscout.acala.network',
      apiUrl: 'https://blockscout.acala.network/api'
    },
    contracts: {},
    testnet: false
  },
  ancient8: {
    id: 888888888n,
    label: 'ancient8',
    name: 'Ancient8',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.ancient8.gg',
    blockExplorer: {
      name: 'Ancient8 explorer',
      url: 'https://scan.ancient8.gg',
      apiUrl: 'https://scan.ancient8.gg/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '1': {
          address: '0xB09DC08428C8b4EFB4ff9C0827386CDF34277996'
        }
      },
      portal: {
        '1': {
          address: '0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68',
          blockCreated: 19070571
        }
      },
      l1StandardBridge: {
        '1': {
          address: '0xd5e3eDf5b68135D559D572E26bF863FBC1950033',
          blockCreated: 19070571
        }
      }
    },
    testnet: false
  },
  ancient8Sepolia: {
    id: 28122024n,
    label: 'ancient8Sepolia',
    name: 'Ancient8 Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpcv2-testnet.ancient8.gg',
    blockExplorer: {
      name: 'Ancient8 Celestia Testnet explorer',
      url: 'https://scanv2-testnet.ancient8.gg',
      apiUrl: 'https://scanv2-testnet.ancient8.gg/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '11155111': {
          address: '0x942fD5017c0F60575930D8574Eaca13BEcD6e1bB'
        }
      },
      portal: {
        '11155111': {
          address: '0xfa1d9E26A6aCD7b22115D27572c1221B9803c960',
          blockCreated: 4972908
        }
      },
      l1StandardBridge: {
        '11155111': {
          address: '0xF6Bc0146d3c74D48306e79Ae134A260E418C9335',
          blockCreated: 4972908
        }
      }
    },
    testnet: false
  },
  anvil: {
    id: 31337n,
    label: 'anvil',
    name: 'Anvil',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'http://127.0.0.1:8545',
    blockExplorer: {},
    contracts: {},
    testnet: false
  },
  apexTestnet: {
    id: 3993n,
    label: 'apexTestnet',
    name: 'APEX Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc-testnet.apexlayer.xyz',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://exp-testnet.apexlayer.xyz',
      apiUrl: 'https://exp-testnet.apexlayer.xyz/api'
    },
    contracts: {
      multicall3: {
        address: '0xf7642be33a6b18D16a995657adb5a68CD0438aE2',
        blockCreated: 283775
      }
    },
    testnet: true
  },
  arbitrum: {
    id: 42161n,
    label: 'arbitrum',
    name: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
      apiUrl: 'https://api.arbiscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 7654707
      }
    },
    testnet: false
  },
  arbitrumGoerli: {
    id: 421613n,
    label: 'arbitrumGoerli',
    name: 'Arbitrum Goerli',
    nativeCurrency: {
      name: 'Arbitrum Goerli Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://goerli-rollup.arbitrum.io/rpc',
    blockExplorer: {
      name: 'Arbiscan',
      url: 'https://goerli.arbiscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 88114
      }
    },
    testnet: true
  },
  arbitrumNova: {
    id: 42170n,
    label: 'arbitrumNova',
    name: 'Arbitrum Nova',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://nova.arbitrum.io/rpc',
    blockExplorer: {
      name: 'Arbiscan',
      url: 'https://nova.arbiscan.io',
      apiUrl: 'https://api-nova.arbiscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1746963
      }
    },
    testnet: false
  },
  arbitrumSepolia: {
    id: 421614n,
    label: 'arbitrumSepolia',
    name: 'Arbitrum Sepolia',
    nativeCurrency: {
      name: 'Arbitrum Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorer: {
      name: 'Arbiscan',
      url: 'https://sepolia.arbiscan.io',
      apiUrl: 'https://api-sepolia.arbiscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 81930
      }
    },
    testnet: true
  },
  areonNetwork: {
    id: 463n,
    label: 'areonNetwork',
    name: 'Areon Network',
    nativeCurrency: {
      decimals: 18,
      name: 'AREA',
      symbol: 'AREA'
    },
    providerURL: 'https://mainnet-rpc.areon.network',
    blockExplorer: {
      name: 'Areonscan',
      url: 'https://areonscan.com'
    },
    contracts: {},
    testnet: false
  },
  areonNetworkTestnet: {
    id: 462n,
    label: 'areonNetworkTestnet',
    name: 'Areon Network Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'TAREA',
      symbol: 'TAREA'
    },
    providerURL: 'https://testnet-rpc.areon.network',
    blockExplorer: {
      name: 'Areonscan',
      url: 'https://areonscan.com'
    },
    contracts: {},
    testnet: true
  },
  artelaTestnet: {
    id: 11822n,
    label: 'artelaTestnet',
    name: 'Artela Testnet',
    nativeCurrency: {
      name: 'ART',
      symbol: 'ART',
      decimals: 18
    },
    providerURL: 'https://betanet-rpc1.artela.network',
    blockExplorer: {
      name: 'Artela',
      url: 'https://betanet-scan.artela.network',
      apiUrl: 'https://betanet-scan.artela.network/api'
    },
    contracts: {
      multicall3: {
        address: '0xd07c8635f76e8745Ee7092fbb6e8fbc5FeF09DD7',
        blockCreated: 7001871
      }
    },
    testnet: true
  },
  assetChainTestnet: {
    id: 42421n,
    label: 'assetChainTestnet',
    name: 'AssetChain Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Real World Asset',
      symbol: 'RWA'
    },
    providerURL: 'https://enugu-rpc.assetchain.org',
    blockExplorer: {
      name: 'Asset Chain Testnet Explorer',
      url: 'https://scan-testnet.assetchain.org',
      apiUrl: 'https://scan-testnet.assetchain.org/api'
    },
    contracts: {
      multicall3: {
        address: '0x989F832D35988cb5e3eB001Fa2Fe789469EC31Ea',
        blockCreated: 17177
      }
    },
    testnet: true
  },
  astar: {
    id: 592n,
    label: 'astar',
    name: 'Astar',
    nativeCurrency: {
      name: 'Astar',
      symbol: 'ASTR',
      decimals: 18
    },
    providerURL: 'https://astar.api.onfinality.io/public',
    blockExplorer: {
      name: 'Astar Subscan',
      url: 'https://astar.subscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 761794
      }
    },
    testnet: false
  },
  astarZkEVM: {
    id: 3776n,
    label: 'astarZkEVM',
    name: 'Astar zkEVM',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.startale.com/astar-zkevm',
    blockExplorer: {
      name: 'Astar zkEVM Explorer',
      url: 'https://astar-zkevm.explorer.startale.com'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 93528
      }
    },
    testnet: false
  },
  astarZkyoto: {
    id: 6038361n,
    label: 'astarZkyoto',
    name: 'Astar zkEVM Testnet zKyoto',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.startale.com/zkyoto',
    blockExplorer: {
      name: 'zKyoto Explorer',
      url: 'https://zkyoto.explorer.startale.com'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 196153
      }
    },
    testnet: true
  },
  atletaOlympia: {
    id: 2340n,
    label: 'atletaOlympia',
    name: 'Atleta Olympia',
    nativeCurrency: {
      decimals: 18,
      name: 'Atla',
      symbol: 'ATLA'
    },
    providerURL: 'https://testnet-rpc.atleta.network:9944',
    blockExplorer: {
      name: 'Atleta Olympia Explorer',
      url: 'https://blockscout.atleta.network',
      apiUrl: 'https://blockscout.atleta.network/api'
    },
    contracts: {
      multicall3: {
        address: '0x1472ec6392180fb84F345d2455bCC75B26577115',
        blockCreated: 1076473
      }
    },
    testnet: true
  },
  aurora: {
    id: 1313161554n,
    label: 'aurora',
    name: 'Aurora',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://mainnet.aurora.dev',
    blockExplorer: {
      name: 'Aurorascan',
      url: 'https://aurorascan.dev',
      apiUrl: 'https://aurorascan.dev/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 62907816
      }
    },
    testnet: false
  },
  auroraTestnet: {
    id: 1313161555n,
    label: 'auroraTestnet',
    name: 'Aurora Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://testnet.aurora.dev',
    blockExplorer: {
      name: 'Aurorascan',
      url: 'https://testnet.aurorascan.dev',
      apiUrl: 'https://testnet.aurorascan.dev/api'
    },
    contracts: {},
    testnet: true
  },
  auroria: {
    id: 205205n,
    label: 'auroria',
    name: 'Auroria Testnet',
    nativeCurrency: {
      name: 'Auroria Stratis',
      symbol: 'tSTRAX',
      decimals: 18
    },
    providerURL: 'https://auroria.rpc.stratisevm.com',
    blockExplorer: {
      name: 'Auroria Testnet Explorer',
      url: 'https://auroria.explorer.stratisevm.com'
    },
    contracts: {},
    testnet: true
  },
  avalanche: {
    id: 43114n,
    label: 'avalanche',
    name: 'Avalanche',
    nativeCurrency: {
      decimals: 18,
      name: 'Avalanche',
      symbol: 'AVAX'
    },
    providerURL: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: {
      name: 'SnowTrace',
      url: 'https://snowtrace.io',
      apiUrl: 'https://api.snowtrace.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 11907934
      }
    },
    testnet: false
  },
  avalancheFuji: {
    id: 43113n,
    label: 'avalancheFuji',
    name: 'Avalanche Fuji',
    nativeCurrency: {
      decimals: 18,
      name: 'Avalanche Fuji',
      symbol: 'AVAX'
    },
    providerURL: 'https://api.avax-test.network/ext/bc/C/rpc',
    blockExplorer: {
      name: 'SnowTrace',
      url: 'https://testnet.snowtrace.io',
      apiUrl: 'https://api-testnet.snowtrace.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 7096959
      }
    },
    testnet: true
  },
  b3: {
    id: 8333n,
    label: 'b3',
    name: 'B3',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://mainnet-rpc.b3.fun/http',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://explorer.b3.fun'
    },
    contracts: {},
    testnet: false
  },
  b3Sepolia: {
    id: 1993n,
    label: 'b3Sepolia',
    name: 'B3 Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.b3.fun/http',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://sepolia.explorer.b3.fun'
    },
    contracts: {},
    testnet: true
  },
  bahamut: {
    id: 5165n,
    label: 'bahamut',
    name: 'Bahamut',
    nativeCurrency: {
      name: 'Fasttoken',
      symbol: 'FTN',
      decimals: 18
    },
    providerURL: 'https://rpc1.bahamut.io',
    blockExplorer: {
      name: 'Ftnscan',
      url: 'https://www.ftnscan.com',
      apiUrl: 'https://www.ftnscan.com/api'
    },
    contracts: {},
    testnet: false
  },
  base: {
    id: 8453n,
    label: 'base',
    name: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://mainnet.base.org',
    blockExplorer: {
      name: 'Basescan',
      url: 'https://basescan.org',
      apiUrl: 'https://api.basescan.org/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '1': {
          address: '0x56315b90c40730925ec5485cf004d835058518A0'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 5022
      },
      portal: {
        '1': {
          address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
          blockCreated: 17482143
        }
      },
      l1StandardBridge: {
        '1': {
          address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
          blockCreated: 17482143
        }
      }
    },
    testnet: false
  },
  baseGoerli: {
    id: 84531n,
    label: 'baseGoerli',
    name: 'Base Goerli',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://goerli.base.org',
    blockExplorer: {
      name: 'Basescan',
      url: 'https://goerli.basescan.org',
      apiUrl: 'https://goerli.basescan.org/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '5': {
          address: '0x2A35891ff30313CcFa6CE88dcf3858bb075A2298'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1376988
      },
      portal: {
        '5': {
          address: '0xe93c8cD0D409341205A592f8c4Ac1A5fe5585cfA'
        }
      },
      l1StandardBridge: {
        '5': {
          address: '0xfA6D8Ee5BE770F84FC001D098C4bD604Fe01284a'
        }
      }
    },
    testnet: true
  },
  baseSepolia: {
    id: 84532n,
    label: 'baseSepolia',
    name: 'Base Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.base.org',
    blockExplorer: {
      name: 'Basescan',
      url: 'https://sepolia.basescan.org',
      apiUrl: 'https://api-sepolia.basescan.org/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      disputeGameFactory: {
        '11155111': {
          address: '0xd6E6dBf4F7EA0ac412fD8b65ED297e64BB7a06E1'
        }
      },
      l2OutputOracle: {
        '11155111': {
          address: '0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254'
        }
      },
      portal: {
        '11155111': {
          address: '0x49f53e41452c74589e85ca1677426ba426459e85',
          blockCreated: 4446677
        }
      },
      l1StandardBridge: {
        '11155111': {
          address: '0xfd0Bf71F60660E2f608ed56e1659C450eB113120',
          blockCreated: 4446677
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1059647
      }
    },
    testnet: true
  },
  beam: {
    id: 4337n,
    label: 'beam',
    name: 'Beam',
    nativeCurrency: {
      decimals: 18,
      name: 'Beam',
      symbol: 'BEAM'
    },
    providerURL: 'https://build.onbeam.com/rpc',
    blockExplorer: {
      name: 'Beam Explorer',
      url: 'https://subnets.avax.network/beam'
    },
    contracts: {
      multicall3: {
        address: '0x4956f15efdc3dc16645e90cc356eafa65ffc65ec',
        blockCreated: 1
      }
    },
    testnet: false
  },
  beamTestnet: {
    id: 13337n,
    label: 'beamTestnet',
    name: 'Beam Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Beam',
      symbol: 'BEAM'
    },
    providerURL: 'https://build.onbeam.com/rpc/testnet',
    blockExplorer: {
      name: 'Beam Explorer',
      url: 'https://subnets-test.avax.network/beam'
    },
    contracts: {
      multicall3: {
        address: '0x9bf49b704ee2a095b95c1f2d4eb9010510c41c9e',
        blockCreated: 3
      }
    },
    testnet: true
  },
  bearNetworkChainMainnet: {
    id: 641230n,
    label: 'bearNetworkChainMainnet',
    name: 'Bear Network Chain Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'BearNetworkChain',
      symbol: 'BRNKC'
    },
    providerURL: 'https://brnkc-mainnet.bearnetwork.net',
    blockExplorer: {
      name: 'BrnkScan',
      url: 'https://brnkscan.bearnetwork.net',
      apiUrl: 'https://brnkscan.bearnetwork.net/api'
    },
    contracts: {},
    testnet: false
  },
  bearNetworkChainTestnet: {
    id: 751230n,
    label: 'bearNetworkChainTestnet',
    name: 'Bear Network Chain Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'tBRNKC',
      symbol: 'tBRNKC'
    },
    providerURL: 'https://brnkc-test.bearnetwork.net',
    blockExplorer: {
      name: 'BrnkTestScan',
      url: 'https://brnktest-scan.bearnetwork.net',
      apiUrl: 'https://brnktest-scan.bearnetwork.net/api'
    },
    contracts: {},
    testnet: true
  },
  berachainTestnet: {
    id: 80085n,
    label: 'berachainTestnet',
    name: 'Berachain Artio',
    nativeCurrency: {
      decimals: 18,
      name: 'BERA Token',
      symbol: 'BERA'
    },
    providerURL: 'https://artio.rpc.berachain.com',
    blockExplorer: {
      name: 'Berachain',
      url: 'https://artio.beratrail.io'
    },
    contracts: {},
    testnet: true
  },
  berachainTestnetbArtio: {
    id: 80084n,
    label: 'berachainTestnetbArtio',
    name: 'Berachain bArtio',
    nativeCurrency: {
      decimals: 18,
      name: 'BERA Token',
      symbol: 'BERA'
    },
    providerURL: 'https://bartio.rpc.berachain.com',
    blockExplorer: {
      name: 'Berachain bArtio Beratrail',
      url: 'https://bartio.beratrail.io'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 109269
      }
    },
    testnet: true
  },
  bevmMainnet: {
    id: 11501n,
    label: 'bevmMainnet',
    name: 'BEVM Mainnet',
    nativeCurrency: {
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 18
    },
    providerURL: 'https://rpc-mainnet-1.bevm.io',
    blockExplorer: {
      name: 'Bevmscan',
      url: 'https://scan-mainnet.bevm.io',
      apiUrl: 'https://scan-mainnet-api.bevm.io/api'
    },
    contracts: {},
    testnet: false
  },
  bitTorrent: {
    id: 199n,
    label: 'bitTorrent',
    name: 'BitTorrent',
    nativeCurrency: {
      name: 'BitTorrent',
      symbol: 'BTT',
      decimals: 18
    },
    providerURL: 'https://rpc.bittorrentchain.io',
    blockExplorer: {
      name: 'Bttcscan',
      url: 'https://bttcscan.com',
      apiUrl: 'https://api.bttcscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 31078552
      }
    },
    testnet: false
  },
  bitTorrentTestnet: {
    id: 1028n,
    label: 'bitTorrentTestnet',
    name: 'BitTorrent Chain Testnet',
    nativeCurrency: {
      name: 'BitTorrent',
      symbol: 'BTT',
      decimals: 18
    },
    providerURL: 'https://testrpc.bittorrentchain.io',
    blockExplorer: {
      name: 'Bttcscan',
      url: 'https://testnet.bttcscan.com',
      apiUrl: 'https://testnet.bttcscan.com/api'
    },
    contracts: {},
    testnet: true
  },
  bitkub: {
    id: 96n,
    label: 'bitkub',
    name: 'Bitkub',
    nativeCurrency: {
      name: 'Bitkub',
      symbol: 'KUB',
      decimals: 18
    },
    providerURL: 'https://rpc.bitkubchain.io',
    blockExplorer: {
      name: 'Bitkub Chain Mainnet Explorer',
      url: 'https://www.bkcscan.com',
      apiUrl: 'https://www.bkcscan.com/api'
    },
    contracts: {},
    testnet: false
  },
  bitkubTestnet: {
    id: 25925n,
    label: 'bitkubTestnet',
    name: 'Bitkub Testnet',
    nativeCurrency: {
      name: 'Bitkub Test',
      symbol: 'tKUB',
      decimals: 18
    },
    providerURL: 'https://rpc-testnet.bitkubchain.io',
    blockExplorer: {
      name: 'Bitkub Chain Testnet Explorer',
      url: 'https://testnet.bkcscan.com',
      apiUrl: 'https://testnet.bkcscan.com/api'
    },
    contracts: {},
    testnet: true
  },
  blast: {
    id: 81457n,
    label: 'blast',
    name: 'Blast',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.blast.io',
    blockExplorer: {
      name: 'Blastscan',
      url: 'https://blastscan.io',
      apiUrl: 'https://api.blastscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 212929
      }
    },
    testnet: false
  },
  blastSepolia: {
    id: 168587773n,
    label: 'blastSepolia',
    name: 'Blast Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.blast.io',
    blockExplorer: {
      name: 'Blastscan',
      url: 'https://sepolia.blastscan.io',
      apiUrl: 'https://api-sepolia.blastscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 756690
      }
    },
    testnet: true
  },
  bob: {
    id: 60808n,
    label: 'bob',
    name: 'BOB',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.gobob.xyz',
    blockExplorer: {
      name: 'BOB Explorer',
      url: 'https://explorer.gobob.xyz'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 23131
      },
      l2OutputOracle: {
        '1': {
          address: '0xdDa53E23f8a32640b04D7256e651C1db98dB11C1',
          blockCreated: 4462615
        }
      },
      portal: {
        '1': {
          address: '0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E',
          blockCreated: 4462615
        }
      }
    },
    testnet: false
  },
  bobSepolia: {
    id: 808813n,
    label: 'bobSepolia',
    name: 'BOB Sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    providerURL: 'https://bob-sepolia.rpc.gobob.xyz',
    blockExplorer: {
      name: 'BOB Sepolia Explorer',
      url: 'https://bob-sepolia.explorer.gobob.xyz'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 35677
      },
      l2OutputOracle: {
        '11155111': {
          address: '0x14D0069452b4AE2b250B395b8adAb771E4267d2f',
          blockCreated: 4462615
        }
      },
      portal: {
        '11155111': {
          address: '0x867B1Aa872b9C8cB5E9F7755feDC45BB24Ad0ae4',
          blockCreated: 4462615
        }
      }
    },
    testnet: true
  },
  boba: {
    id: 288n,
    label: 'boba',
    name: 'Boba Network',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://mainnet.boba.network',
    blockExplorer: {
      name: 'BOBAScan',
      url: 'https://bobascan.com'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 446859
      }
    },
    testnet: false
  },
  bobaSepolia: {
    id: 28882n,
    label: 'bobaSepolia',
    name: 'Boba Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.boba.network',
    blockExplorer: {
      name: 'BOBAScan',
      url: 'https://testnet.bobascan.com'
    },
    contracts: {},
    testnet: true
  },
  botanixTestnet: {
    id: 3636n,
    label: 'botanixTestnet',
    name: 'Botanix Testnet',
    nativeCurrency: {
      name: 'Botanix',
      symbol: 'BTC',
      decimals: 18
    },
    providerURL: 'https://poa-node.botanixlabs.dev',
    blockExplorer: {
      name: 'blockscout',
      url: 'https://blockscout.botanixlabs.dev',
      apiUrl: 'https://blockscout.botanixlabs.dev'
    },
    contracts: {},
    testnet: true
  },
  bronos: {
    id: 1039n,
    label: 'bronos',
    name: 'Bronos',
    nativeCurrency: {
      decimals: 18,
      name: 'BRO',
      symbol: 'BRO'
    },
    providerURL: 'https://evm.bronos.org',
    blockExplorer: {
      name: 'BronoScan',
      url: 'https://broscan.bronos.org'
    },
    contracts: {},
    testnet: false
  },
  bronosTestnet: {
    id: 1038n,
    label: 'bronosTestnet',
    name: 'Bronos Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Bronos Coin',
      symbol: 'tBRO'
    },
    providerURL: 'https://evm-testnet.bronos.org',
    blockExplorer: {
      name: 'BronoScan',
      url: 'https://tbroscan.bronos.org'
    },
    contracts: {},
    testnet: true
  },
  bsc: {
    id: 56n,
    label: 'bsc',
    name: 'BNB Smart Chain',
    nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB'
    },
    providerURL: 'https://rpc.ankr.com/bsc',
    blockExplorer: {
      name: 'BscScan',
      url: 'https://bscscan.com',
      apiUrl: 'https://api.bscscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 15921452
      }
    },
    testnet: false
  },
  bscGreenfield: {
    id: 1017n,
    label: 'bscGreenfield',
    name: 'BNB Greenfield Chain',
    nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB'
    },
    providerURL: 'https://greenfield-chain.bnbchain.org',
    blockExplorer: {
      name: 'BNB Greenfield Mainnet Scan',
      url: 'https://greenfieldscan.com'
    },
    contracts: {},
    testnet: false
  },
  bscTestnet: {
    id: 97n,
    label: 'bscTestnet',
    name: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'tBNB'
    },
    providerURL: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    blockExplorer: {
      name: 'BscScan',
      url: 'https://testnet.bscscan.com',
      apiUrl: 'https://testnet.bscscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 17422483
      }
    },
    testnet: true
  },
  btr: {
    id: 200901n,
    label: 'btr',
    name: 'Bitlayer',
    nativeCurrency: {
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 18
    },
    providerURL: 'https://rpc.bitlayer.org',
    blockExplorer: {
      name: 'Bitlayer(BTR) Scan',
      url: 'https://www.btrscan.com'
    },
    contracts: {},
    testnet: false
  },
  btrTestnet: {
    id: 200810n,
    label: 'btrTestnet',
    name: 'Bitlayer Testnet',
    nativeCurrency: {
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 18
    },
    providerURL: 'https://testnet-rpc.bitlayer.org',
    blockExplorer: {
      name: 'Bitlayer(BTR) Scan',
      url: 'https://testnet.btrscan.com'
    },
    contracts: {},
    testnet: true
  },
  bxn: {
    id: 4999n,
    label: 'bxn',
    name: 'BlackFort Exchange Network',
    nativeCurrency: {
      name: 'BlackFort Token',
      symbol: 'BXN',
      decimals: 18
    },
    providerURL: 'https://mainnet.blackfort.network/rpc',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://explorer.blackfort.network',
      apiUrl: 'https://explorer.blackfort.network/api'
    },
    contracts: {},
    testnet: false
  },
  bxnTestnet: {
    id: 4777n,
    label: 'bxnTestnet',
    name: 'BlackFort Exchange Network Testnet',
    nativeCurrency: {
      name: 'BlackFort Testnet Token',
      symbol: 'TBXN',
      decimals: 18
    },
    providerURL: 'https://testnet.blackfort.network/rpc',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://testnet-explorer.blackfort.network',
      apiUrl: 'https://testnet-explorer.blackfort.network/api'
    },
    contracts: {},
    testnet: true
  },
  canto: {
    id: 7700n,
    label: 'canto',
    name: 'Canto',
    nativeCurrency: {
      decimals: 18,
      name: 'Canto',
      symbol: 'CANTO'
    },
    providerURL: 'https://canto.gravitychain.io',
    blockExplorer: {
      name: 'Tuber.Build (Blockscout)',
      url: 'https://tuber.build'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 2905789
      }
    },
    testnet: false
  },
  celo: {
    id: 42220n,
    label: 'celo',
    name: 'Celo',
    nativeCurrency: {
      decimals: 18,
      name: 'CELO',
      symbol: 'CELO'
    },
    providerURL: 'https://forno.celo.org',
    blockExplorer: {
      name: 'Celo Explorer',
      url: 'https://celoscan.io',
      apiUrl: 'https://api.celoscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 13112599
      }
    },
    testnet: false
  },
  celoAlfajores: {
    id: 44787n,
    label: 'celoAlfajores',
    name: 'Alfajores',
    nativeCurrency: {
      decimals: 18,
      name: 'CELO',
      symbol: 'A-CELO'
    },
    providerURL: 'https://alfajores-forno.celo-testnet.org',
    blockExplorer: {
      name: 'Celo Explorer',
      url: 'https://explorer.celo.org/alfajores',
      apiUrl: 'https://explorer.celo.org/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 14569001
      }
    },
    testnet: true
  },
  chiliz: {
    id: 88888n,
    label: 'chiliz',
    name: 'Chiliz Chain',
    nativeCurrency: {
      decimals: 18,
      name: 'CHZ',
      symbol: 'CHZ'
    },
    providerURL: 'https://rpc.ankr.com/chiliz',
    blockExplorer: {
      name: 'Chiliz Explorer',
      url: 'https://scan.chiliz.com',
      apiUrl: 'https://scan.chiliz.com/api'
    },
    contracts: {},
    testnet: false
  },
  chips: {
    id: 2882n,
    label: 'chips',
    name: 'Chips Network',
    nativeCurrency: {
      decimals: 18,
      name: 'IOTA',
      symbol: 'IOTA'
    },
    providerURL: 'https://node.chips.ooo/wasp/api/v1/chains/iota1pp3d3mnap3ufmgqnjsnw344sqmf5svjh26y2khnmc89sv6788y3r207a8fn/evm',
    blockExplorer: {},
    contracts: {},
    testnet: false
  },
  classic: {
    id: 61n,
    label: 'classic',
    name: 'Ethereum Classic',
    nativeCurrency: {
      decimals: 18,
      name: 'ETC',
      symbol: 'ETC'
    },
    providerURL: 'https://etc.rivet.link',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://blockscout.com/etc/mainnet'
    },
    contracts: {},
    testnet: false
  },
  confluxESpace: {
    id: 1030n,
    label: 'confluxESpace',
    name: 'Conflux eSpace',
    nativeCurrency: {
      name: 'Conflux',
      symbol: 'CFX',
      decimals: 18
    },
    providerURL: 'https://evm.confluxrpc.com',
    blockExplorer: {
      name: 'ConfluxScan',
      url: 'https://evm.confluxscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xEFf0078910f638cd81996cc117bccD3eDf2B072F',
        blockCreated: 68602935
      }
    },
    testnet: false
  },
  confluxESpaceTestnet: {
    id: 71n,
    label: 'confluxESpaceTestnet',
    name: 'Conflux eSpace Testnet',
    nativeCurrency: {
      name: 'Conflux',
      symbol: 'CFX',
      decimals: 18
    },
    providerURL: 'https://evmtestnet.confluxrpc.com',
    blockExplorer: {
      name: 'ConfluxScan',
      url: 'https://evmtestnet.confluxscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xEFf0078910f638cd81996cc117bccD3eDf2B072F',
        blockCreated: 117499050
      }
    },
    testnet: true
  },
  coreDao: {
    id: 1116n,
    label: 'coreDao',
    name: 'Core Dao',
    nativeCurrency: {
      decimals: 18,
      name: 'Core',
      symbol: 'CORE'
    },
    providerURL: 'https://rpc.coredao.org',
    blockExplorer: {
      name: 'CoreDao',
      url: 'https://scan.coredao.org'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 11907934
      }
    },
    testnet: false
  },
  crab: {
    id: 44n,
    label: 'crab',
    name: 'Crab Network',
    nativeCurrency: {
      decimals: 18,
      name: 'Crab Network Native Token',
      symbol: 'CRAB'
    },
    providerURL: 'https://crab-rpc.darwinia.network',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://crab-scan.darwinia.network'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 3032593
      }
    },
    testnet: false
  },
  cronos: {
    id: 25n,
    label: 'cronos',
    name: 'Cronos Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Cronos',
      symbol: 'CRO'
    },
    providerURL: 'https://evm.cronos.org',
    blockExplorer: {
      name: 'Cronos Explorer',
      url: 'https://explorer.cronos.org',
      apiUrl: 'https://explorer-api.cronos.org/mainnet/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 1963112
      }
    },
    testnet: false
  },
  cronosTestnet: {
    id: 338n,
    label: 'cronosTestnet',
    name: 'Cronos Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'CRO',
      symbol: 'tCRO'
    },
    providerURL: 'https://evm-t3.cronos.org',
    blockExplorer: {
      name: 'Cronos Explorer',
      url: 'https://cronos.org/explorer/testnet3'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 10191251
      }
    },
    testnet: true
  },
  cronoszkEVM: {
    id: 388n,
    label: 'cronoszkEVM',
    name: 'Cronos zkEVM Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Cronos zkEVM CRO',
      symbol: 'zkCRO'
    },
    providerURL: 'https://mainnet.zkevm.cronos.org',
    blockExplorer: {
      name: 'Cronos zkEVM (Mainnet) Chain Explorer',
      url: 'https://explorer.zkevm.cronos.org'
    },
    contracts: {},
    testnet: false
  },
  cronoszkEVMTestnet: {
    id: 282n,
    label: 'cronoszkEVMTestnet',
    name: 'Cronos zkEVM Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Cronos zkEVM Test Coin',
      symbol: 'zkTCRO'
    },
    providerURL: 'https://testnet.zkevm.cronos.org',
    blockExplorer: {
      name: 'Cronos zkEVM Testnet Explorer',
      url: 'https://explorer.zkevm.cronos.org/testnet'
    },
    contracts: {},
    testnet: true
  },
  crossbell: {
    id: 3737n,
    label: 'crossbell',
    name: 'Crossbell',
    nativeCurrency: {
      decimals: 18,
      name: 'CSB',
      symbol: 'CSB'
    },
    providerURL: 'https://rpc.crossbell.io',
    blockExplorer: {
      name: 'CrossScan',
      url: 'https://scan.crossbell.io',
      apiUrl: 'https://scan.crossbell.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 38246031
      }
    },
    testnet: false
  },
  curtis: {
    id: 33111n,
    label: 'curtis',
    name: 'Curtis',
    nativeCurrency: {
      name: 'ApeCoin',
      symbol: 'APE',
      decimals: 18
    },
    providerURL: 'https://rpc.curtis.apechain.com',
    blockExplorer: {
      name: 'Curtis Explorer',
      url: 'https://explorer.curtis.apechain.com'
    },
    contracts: {},
    testnet: true
  },
  cyber: {
    id: 7560n,
    label: 'cyber',
    name: 'Cyber',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://cyber.alt.technology',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://cyberscan.co',
      apiUrl: 'https://cyberscan.co/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 0
      }
    },
    testnet: false
  },
  cyberTestnet: {
    id: 111557560n,
    label: 'cyberTestnet',
    name: 'Cyber Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://cyber-testnet.alt.technology',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://testnet.cyberscan.co',
      apiUrl: 'https://testnet.cyberscan.co/api'
    },
    contracts: {
      multicall3: {
        address: '0xffc391F0018269d4758AEA1a144772E8FB99545E',
        blockCreated: 304545
      }
    },
    testnet: true
  },
  darwinia: {
    id: 46n,
    label: 'darwinia',
    name: 'Darwinia Network',
    nativeCurrency: {
      decimals: 18,
      name: 'RING',
      symbol: 'RING'
    },
    providerURL: 'https://rpc.darwinia.network',
    blockExplorer: {
      name: 'Explorer',
      url: 'https://explorer.darwinia.network'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 69420
      }
    },
    testnet: false
  },
  dchain: {
    id: 2716446429837000n,
    label: 'dchain',
    name: 'Dchain',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://dchain-2716446429837000-1.jsonrpc.sagarpc.io',
    blockExplorer: {
      name: 'Dchain Explorer',
      url: 'https://dchain-2716446429837000-1.sagaexplorer.io',
      apiUrl: 'https://api-dchain-2716446429837000-1.sagaexplorer.io/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      }
    },
    testnet: false
  },
  dchainTestnet: {
    id: 2713017997578000n,
    label: 'dchainTestnet',
    name: 'Dchain Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://dchaintestnet-2713017997578000-1.jsonrpc.testnet.sagarpc.io',
    blockExplorer: {
      name: 'Dchain Explorer',
      url: 'https://dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io',
      apiUrl: 'https://api-dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      }
    },
    testnet: false
  },
  defichainEvm: {
    id: 1130n,
    label: 'defichainEvm',
    name: 'DeFiChain EVM Mainnet',
    nativeCurrency: {
      name: 'DeFiChain',
      symbol: 'DFI',
      decimals: 18
    },
    providerURL: 'https://eth.mainnet.ocean.jellyfishsdk.com',
    blockExplorer: {
      name: 'DeFiScan',
      url: 'https://meta.defiscan.live'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 137852
      }
    },
    testnet: false
  },
  defichainEvmTestnet: {
    id: 1131n,
    label: 'defichainEvmTestnet',
    name: 'DeFiChain EVM Testnet',
    nativeCurrency: {
      name: 'DeFiChain',
      symbol: 'DFI',
      decimals: 18
    },
    providerURL: 'https://eth.testnet.ocean.jellyfishsdk.com',
    blockExplorer: {
      name: 'DeFiScan',
      url: 'https://meta.defiscan.live/?network=TestNet'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 156462
      }
    },
    testnet: true
  },
  degen: {
    id: 666666666n,
    label: 'degen',
    name: 'Degen',
    nativeCurrency: {
      decimals: 18,
      name: 'Degen',
      symbol: 'DEGEN'
    },
    providerURL: 'https://rpc.degen.tips',
    blockExplorer: {
      name: 'Degen Chain Explorer',
      url: 'https://explorer.degen.tips',
      apiUrl: 'https://explorer.degen.tips/api/v2'
    },
    contracts: {},
    testnet: false
  },
  dfk: {
    id: 53935n,
    label: 'dfk',
    name: 'DFK Chain',
    nativeCurrency: {
      decimals: 18,
      name: 'Jewel',
      symbol: 'JEWEL'
    },
    providerURL: 'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc',
    blockExplorer: {
      name: 'DFKSubnetScan',
      url: 'https://subnets.avax.network/defi-kingdoms'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14790551
      }
    },
    testnet: false
  },
  dodochainTestnet: {
    id: 53457n,
    label: 'dodochainTestnet',
    name: 'DODOchain Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'DODO',
      symbol: 'DODO'
    },
    providerURL: 'https://dodochain-testnet.alt.technology',
    blockExplorer: {
      name: 'DODOchain Testnet (Sepolia) Explorer',
      url: 'https://testnet-scan.dodochain.com'
    },
    contracts: {},
    testnet: true
  },
  dogechain: {
    id: 2000n,
    label: 'dogechain',
    name: 'Dogechain',
    nativeCurrency: {
      decimals: 18,
      name: 'Wrapped Dogecoin',
      symbol: 'WDOGE'
    },
    providerURL: 'https://rpc.dogechain.dog',
    blockExplorer: {
      name: 'DogeChainExplorer',
      url: 'https://explorer.dogechain.dog',
      apiUrl: 'https://explorer.dogechain.dog/api'
    },
    contracts: {
      multicall3: {
        address: '0x68a8609a60a008EFA633dfdec592c03B030cC508',
        blockCreated: 25384031
      }
    },
    testnet: false
  },
  dreyerxMainnet: {
    id: 23451n,
    label: 'dreyerxMainnet',
    name: 'DreyerX Mainnet',
    nativeCurrency: {
      name: 'DreyerX',
      symbol: 'DRX',
      decimals: 18
    },
    providerURL: 'https://rpc.dreyerx.com',
    blockExplorer: {
      name: 'DreyerX Scan',
      url: 'https://scan.dreyerx.com'
    },
    contracts: {},
    testnet: false
  },
  dreyerxTestnet: {
    id: 23452n,
    label: 'dreyerxTestnet',
    name: 'DreyerX Testnet',
    nativeCurrency: {
      name: 'DreyerX',
      symbol: 'DRX',
      decimals: 18
    },
    providerURL: 'http://testnet-rpc.dreyerx.com',
    blockExplorer: {
      name: 'DreyerX Testnet Scan',
      url: 'https://testnet-scan.dreyerx.com'
    },
    contracts: {},
    testnet: true
  },
  edgeless: {
    id: 2026n,
    label: 'edgeless',
    name: 'Edgeless Network',
    nativeCurrency: {
      name: 'Edgeless Wrapped ETH',
      symbol: 'EwETH',
      decimals: 18
    },
    providerURL: 'https://rpc.edgeless.network/http',
    blockExplorer: {
      name: 'Edgeless Explorer',
      url: 'https://explorer.edgeless.network'
    },
    contracts: {},
    testnet: false
  },
  edgelessTestnet: {
    id: 202n,
    label: 'edgelessTestnet',
    name: 'Edgeless Testnet',
    nativeCurrency: {
      name: 'Edgeless Wrapped ETH',
      symbol: 'EwETH',
      decimals: 18
    },
    providerURL: 'https://edgeless-testnet.rpc.caldera.xyz/http',
    blockExplorer: {
      name: 'Edgeless Testnet Explorer',
      url: 'https://testnet.explorer.edgeless.network'
    },
    contracts: {},
    testnet: false
  },
  edgeware: {
    id: 2021n,
    label: 'edgeware',
    name: 'Edgeware EdgeEVM Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Edgeware',
      symbol: 'EDG'
    },
    providerURL: 'https://edgeware-evm.jelliedowl.net',
    blockExplorer: {
      name: 'Edgscan by Bharathcoorg',
      url: 'https://edgscan.live',
      apiUrl: 'https://edgscan.live/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 18117872
      }
    },
    testnet: false
  },
  edgewareTestnet: {
    id: 2022n,
    label: 'edgewareTestnet',
    name: 'Beresheet BereEVM Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Testnet EDG',
      symbol: 'tEDG'
    },
    providerURL: 'https://beresheet-evm.jelliedowl.net',
    blockExplorer: {
      name: 'Edgscan by Bharathcoorg',
      url: 'https://testnet.edgscan.live',
      apiUrl: 'https://testnet.edgscan.live/api'
    },
    contracts: {},
    testnet: false
  },
  ekta: {
    id: 1994n,
    label: 'ekta',
    name: 'Ekta',
    nativeCurrency: {
      decimals: 18,
      name: 'EKTA',
      symbol: 'EKTA'
    },
    providerURL: 'https://main.ekta.io',
    blockExplorer: {
      name: 'Ektascan',
      url: 'https://ektascan.io',
      apiUrl: 'https://ektascan.io/api'
    },
    contracts: {},
    testnet: false
  },
  ektaTestnet: {
    id: 1004n,
    label: 'ektaTestnet',
    name: 'Ekta Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'EKTA',
      symbol: 'EKTA'
    },
    providerURL: 'https://test.ekta.io:8545',
    blockExplorer: {
      name: 'Test Ektascan',
      url: 'https://test.ektascan.io',
      apiUrl: 'https://test.ektascan.io/api'
    },
    contracts: {},
    testnet: true
  },
  eon: {
    id: 7332n,
    label: 'eon',
    name: 'Horizen EON',
    nativeCurrency: {
      decimals: 18,
      name: 'ZEN',
      symbol: 'ZEN'
    },
    providerURL: 'https://eon-rpc.horizenlabs.io/ethv1',
    blockExplorer: {
      name: 'EON Explorer',
      url: 'https://eon-explorer.horizenlabs.io'
    },
    contracts: {},
    testnet: false
  },
  eos: {
    id: 17777n,
    label: 'eos',
    name: 'EOS EVM',
    nativeCurrency: {
      decimals: 18,
      name: 'EOS',
      symbol: 'EOS'
    },
    providerURL: 'https://api.evm.eosnetwork.com',
    blockExplorer: {
      name: 'EOS EVM Explorer',
      url: 'https://explorer.evm.eosnetwork.com',
      apiUrl: 'https://explorer.evm.eosnetwork.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 7943933
      }
    },
    testnet: false
  },
  eosTestnet: {
    id: 15557n,
    label: 'eosTestnet',
    name: 'EOS EVM Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'EOS',
      symbol: 'EOS'
    },
    providerURL: 'https://api.testnet.evm.eosnetwork.com',
    blockExplorer: {
      name: 'EOS EVM Testnet Explorer',
      url: 'https://explorer.testnet.evm.eosnetwork.com',
      apiUrl: 'https://explorer.testnet.evm.eosnetwork.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 9067940
      }
    },
    testnet: true
  },
  etherlink: {
    id: 42793n,
    label: 'etherlink',
    name: 'Etherlink',
    nativeCurrency: {
      decimals: 18,
      name: 'Tez',
      symbol: 'XTZ'
    },
    providerURL: 'https://node.mainnet.etherlink.com',
    blockExplorer: {
      name: 'Etherlink',
      url: 'https://explorer.etherlink.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 33899
      }
    },
    testnet: false
  },
  etherlinkTestnet: {
    id: 128123n,
    label: 'etherlinkTestnet',
    name: 'Etherlink Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Tez',
      symbol: 'XTZ'
    },
    providerURL: 'https://node.ghostnet.etherlink.com',
    blockExplorer: {
      name: 'Etherlink Testnet',
      url: 'https://testnet-explorer.etherlink.com'
    },
    contracts: {},
    testnet: true
  },
  evmos: {
    id: 9001n,
    label: 'evmos',
    name: 'Evmos',
    nativeCurrency: {
      decimals: 18,
      name: 'Evmos',
      symbol: 'EVMOS'
    },
    providerURL: 'https://eth.bd.evmos.org:8545',
    blockExplorer: {
      name: 'Evmos Block Explorer',
      url: 'https://escan.live'
    },
    contracts: {},
    testnet: false
  },
  evmosTestnet: {
    id: 9000n,
    label: 'evmosTestnet',
    name: 'Evmos Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Evmos',
      symbol: 'EVMOS'
    },
    providerURL: 'https://eth.bd.evmos.dev:8545',
    blockExplorer: {
      name: 'Evmos Testnet Block Explorer',
      url: 'https://evm.evmos.dev/'
    },
    contracts: {},
    testnet: false
  },
  fantom: {
    id: 250n,
    label: 'fantom',
    name: 'Fantom',
    nativeCurrency: {
      decimals: 18,
      name: 'Fantom',
      symbol: 'FTM'
    },
    providerURL: 'https://rpc.ankr.com/fantom',
    blockExplorer: {
      name: 'FTMScan',
      url: 'https://ftmscan.com',
      apiUrl: 'https://api.ftmscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 33001987
      }
    },
    testnet: false
  },
  fantomSonicTestnet: {
    id: 64240n,
    label: 'fantomSonicTestnet',
    name: 'Fantom Sonic Open Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Fantom',
      symbol: 'FTM'
    },
    providerURL: 'https://rpcapi.sonic.fantom.network',
    blockExplorer: {
      name: 'Fantom Sonic Open Testnet Explorer',
      url: 'https://public-sonic.fantom.network'
    },
    contracts: {},
    testnet: true
  },
  fantomTestnet: {
    id: 4002n,
    label: 'fantomTestnet',
    name: 'Fantom Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Fantom',
      symbol: 'FTM'
    },
    providerURL: 'https://rpc.testnet.fantom.network',
    blockExplorer: {
      name: 'FTMScan',
      url: 'https://testnet.ftmscan.com',
      apiUrl: 'https://testnet.ftmscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 8328688
      }
    },
    testnet: true
  },
  fibo: {
    id: 12306n,
    label: 'fibo',
    name: 'Fibo Chain',
    nativeCurrency: {
      decimals: 18,
      name: 'fibo',
      symbol: 'FIBO'
    },
    providerURL: 'https://network.hzroc.art',
    blockExplorer: {
      name: 'FiboScan',
      url: 'https://scan.fibochain.org'
    },
    contracts: {},
    testnet: false
  },
  filecoin: {
    id: 314n,
    label: 'filecoin',
    name: 'Filecoin Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'filecoin',
      symbol: 'FIL'
    },
    providerURL: 'https://api.node.glif.io/rpc/v1',
    blockExplorer: {
      name: 'Filfox',
      url: 'https://filfox.info/en'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 3328594
      }
    },
    testnet: false
  },
  filecoinCalibration: {
    id: 314159n,
    label: 'filecoinCalibration',
    name: 'Filecoin Calibration',
    nativeCurrency: {
      decimals: 18,
      name: 'testnet filecoin',
      symbol: 'tFIL'
    },
    providerURL: 'https://api.calibration.node.glif.io/rpc/v1',
    blockExplorer: {
      name: 'Filscan',
      url: 'https://calibration.filscan.io'
    },
    contracts: {},
    testnet: true
  },
  filecoinHyperspace: {
    id: 3141n,
    label: 'filecoinHyperspace',
    name: 'Filecoin Hyperspace',
    nativeCurrency: {
      decimals: 18,
      name: 'testnet filecoin',
      symbol: 'tFIL'
    },
    providerURL: 'https://api.hyperspace.node.glif.io/rpc/v1',
    blockExplorer: {
      name: 'Filfox',
      url: 'https://hyperspace.filfox.info/en'
    },
    contracts: {},
    testnet: true
  },
  flare: {
    id: 14n,
    label: 'flare',
    name: 'Flare Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'flare',
      symbol: 'FLR'
    },
    providerURL: 'https://flare-api.flare.network/ext/C/rpc',
    blockExplorer: {
      name: 'Flare Explorer',
      url: 'https://flare-explorer.flare.network',
      apiUrl: 'https://flare-explorer.flare.network/api'
    },
    contracts: {},
    testnet: false
  },
  flareTestnet: {
    id: 114n,
    label: 'flareTestnet',
    name: 'Coston2',
    nativeCurrency: {
      decimals: 18,
      name: 'coston2flare',
      symbol: 'C2FLR'
    },
    providerURL: 'https://coston2-api.flare.network/ext/C/rpc',
    blockExplorer: {
      name: 'Coston2 Explorer',
      url: 'https://coston2-explorer.flare.network',
      apiUrl: 'https://coston2-explorer.flare.network/api'
    },
    contracts: {},
    testnet: true
  },
  flowMainnet: {
    id: 747n,
    label: 'flowMainnet',
    name: 'FlowEVM Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Flow',
      symbol: 'FLOW'
    },
    providerURL: 'https://mainnet.evm.nodes.onflow.org',
    blockExplorer: {
      name: 'Mainnet Explorer',
      url: 'https://flowdiver.io'
    },
    contracts: {},
    testnet: false
  },
  flowPreviewnet: {
    id: 646n,
    label: 'flowPreviewnet',
    name: 'FlowEVM Previewnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Flow',
      symbol: 'FLOW'
    },
    providerURL: 'https://previewnet.evm.nodes.onflow.org',
    blockExplorer: {
      name: 'Previewnet Explorer',
      url: 'https://previewnet.flowdiver.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 6205
      }
    },
    testnet: false
  },
  flowTestnet: {
    id: 545n,
    label: 'flowTestnet',
    name: 'FlowEVM Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Flow',
      symbol: 'FLOW'
    },
    providerURL: 'https://testnet.evm.nodes.onflow.org',
    blockExplorer: {
      name: 'Flow Diver',
      url: 'https://testnet.flowdiver.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 137518
      }
    },
    testnet: false
  },
  fluence: {
    id: 9999999n,
    label: 'fluence',
    name: 'Fluence',
    nativeCurrency: {
      name: 'FLT',
      symbol: 'FLT',
      decimals: 18
    },
    providerURL: 'https://rpc.mainnet.fluence.dev',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://blockscout.mainnet.fluence.dev',
      apiUrl: 'https://blockscout.mainnet.fluence.dev/api'
    },
    contracts: {},
    testnet: false
  },
  fluenceStage: {
    id: 123420000220n,
    label: 'fluenceStage',
    name: 'Fluence Stage',
    nativeCurrency: {
      name: 'tFLT',
      symbol: 'tFLT',
      decimals: 18
    },
    providerURL: 'https://rpc.stage.fluence.dev',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://blockscout.stage.fluence.dev',
      apiUrl: 'https://blockscout.stage.fluence.dev/api'
    },
    contracts: {},
    testnet: true
  },
  fluenceTestnet: {
    id: 52164803n,
    label: 'fluenceTestnet',
    name: 'Fluence Testnet',
    nativeCurrency: {
      name: 'tFLT',
      symbol: 'tFLT',
      decimals: 18
    },
    providerURL: 'https://rpc.testnet.fluence.dev',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://blockscout.testnet.fluence.dev',
      apiUrl: 'https://blockscout.testnet.fluence.dev/api'
    },
    contracts: {},
    testnet: true
  },
  forma: {
    id: 984122n,
    label: 'forma',
    name: 'Forma',
    nativeCurrency: {
      symbol: 'TIA',
      name: 'TIA',
      decimals: 18
    },
    providerURL: 'https://rpc.forma.art',
    blockExplorer: {
      name: 'Forma Explorer',
      url: 'https://explorer.forma.art'
    },
    contracts: {
      multicall3: {
        address: '0xd53C6FFB123F7349A32980F87faeD8FfDc9ef079',
        blockCreated: 252705
      }
    },
    testnet: false
  },
  foundry: {
    id: 31337n,
    label: 'foundry',
    name: 'Foundry',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'http://127.0.0.1:8545',
    blockExplorer: {},
    contracts: {},
    testnet: false
  },
  fraxtal: {
    id: 252n,
    label: 'fraxtal',
    name: 'Fraxtal',
    nativeCurrency: {
      name: 'Frax Ether',
      symbol: 'frxETH',
      decimals: 18
    },
    providerURL: 'https://rpc.frax.com',
    blockExplorer: {
      name: 'fraxscan',
      url: 'https://fraxscan.com',
      apiUrl: 'https://api.fraxscan.com/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '1': {
          address: '0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11'
      },
      portal: {
        '1': {
          address: '0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D',
          blockCreated: 19135323
        }
      },
      l1StandardBridge: {
        '1': {
          address: '0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2',
          blockCreated: 19135323
        }
      }
    },
    testnet: false
  },
  fraxtalTestnet: {
    id: 2522n,
    label: 'fraxtalTestnet',
    name: 'Fraxtal Testnet',
    nativeCurrency: {
      name: 'Frax Ether',
      symbol: 'frxETH',
      decimals: 18
    },
    providerURL: 'https://rpc.testnet.frax.com',
    blockExplorer: {
      name: 'fraxscan testnet',
      url: 'https://holesky.fraxscan.com',
      apiUrl: 'https://api-holesky.fraxscan.com/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '17000': {
          address: '0x715EA64DA13F4d0831ece4Ad3E8c1aa013167F32'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11'
      },
      portal: {
        '17000': {
          address: '0xB9c64BfA498d5b9a8398Ed6f46eb76d90dE5505d',
          blockCreated: 318416
        }
      },
      l1StandardBridge: {
        '17000': {
          address: '0x0BaafC217162f64930909aD9f2B27125121d6332',
          blockCreated: 318416
        }
      }
    },
    testnet: false
  },
  funkiMainnet: {
    id: 33979n,
    label: 'funkiMainnet',
    name: 'Funki',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc-mainnet.funkichain.com',
    blockExplorer: {
      name: 'Funki Mainnet Explorer',
      url: 'https://funkiscan.io'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      }
    },
    testnet: false
  },
  funkiSepolia: {
    id: 3397901n,
    label: 'funkiSepolia',
    name: 'Funki Sepolia Sandbox',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://funki-testnet.alt.technology',
    blockExplorer: {
      name: 'Funki Sepolia Sandbox Explorer',
      url: 'https://sepolia-sandbox.funkichain.com/'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1620204
      }
    },
    testnet: true
  },
  fuse: {
    id: 122n,
    label: 'fuse',
    name: 'Fuse',
    nativeCurrency: {
      name: 'Fuse',
      symbol: 'FUSE',
      decimals: 18
    },
    providerURL: 'https://rpc.fuse.io',
    blockExplorer: {
      name: 'Fuse Explorer',
      url: 'https://explorer.fuse.io',
      apiUrl: 'https://explorer.fuse.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 16146628
      }
    },
    testnet: false
  },
  fuseSparknet: {
    id: 123n,
    label: 'fuseSparknet',
    name: 'Fuse Sparknet',
    nativeCurrency: {
      name: 'Spark',
      symbol: 'SPARK',
      decimals: 18
    },
    providerURL: 'https://rpc.fusespark.io',
    blockExplorer: {
      name: 'Sparkent Explorer',
      url: 'https://explorer.fusespark.io',
      apiUrl: 'https://explorer.fusespark.io/api'
    },
    contracts: {},
    testnet: false
  },
  gnosis: {
    id: 100n,
    label: 'gnosis',
    name: 'Gnosis',
    nativeCurrency: {
      decimals: 18,
      name: 'Gnosis',
      symbol: 'xDAI'
    },
    providerURL: 'https://rpc.gnosischain.com',
    blockExplorer: {
      name: 'Gnosisscan',
      url: 'https://gnosisscan.io',
      apiUrl: 'https://api.gnosisscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 21022491
      }
    },
    testnet: false
  },
  gnosisChiado: {
    id: 10200n,
    label: 'gnosisChiado',
    name: 'Gnosis Chiado',
    nativeCurrency: {
      decimals: 18,
      name: 'Gnosis',
      symbol: 'xDAI'
    },
    providerURL: 'https://rpc.chiadochain.net',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://blockscout.chiadochain.net',
      apiUrl: 'https://blockscout.chiadochain.net/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 4967313
      }
    },
    testnet: true
  },
  gobi: {
    id: 1663n,
    label: 'gobi',
    name: 'Horizen Gobi Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Test ZEN',
      symbol: 'tZEN'
    },
    providerURL: 'https://gobi-testnet.horizenlabs.io/ethv1',
    blockExplorer: {
      name: 'Gobi Explorer',
      url: 'https://gobi-explorer.horizen.io'
    },
    contracts: {},
    testnet: true
  },
  goerli: {
    id: 5n,
    label: 'goerli',
    name: 'Goerli',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.ankr.com/eth_goerli',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://goerli.etherscan.io',
      apiUrl: 'https://api-goerli.etherscan.io/api'
    },
    contracts: {
      ensRegistry: {
        address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
      },
      ensUniversalResolver: {
        address: '0xfc4AC75C46C914aF5892d6d3eFFcebD7917293F1',
        blockCreated: 10339206
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 6507670
      }
    },
    testnet: true
  },
  gravity: {
    id: 1625n,
    label: 'gravity',
    name: 'Gravity Alpha Mainnet',
    nativeCurrency: {
      name: 'G',
      symbol: 'G',
      decimals: 18
    },
    providerURL: 'https://rpc.gravity.xyz',
    blockExplorer: {
      name: 'Gravity Explorer',
      url: 'https://explorer.gravity.xyz',
      apiUrl: 'https://explorer.gravity.xyz/api'
    },
    contracts: {
      multicall3: {
        address: '0xf8ac4BEB2F75d2cFFb588c63251347fdD629B92c',
        blockCreated: 16851
      }
    },
    testnet: false
  },
  ham: {
    id: 5112n,
    label: 'ham',
    name: 'Ham',
    nativeCurrency: {
      decimals: 18,
      name: 'Ham',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.ham.fun',
    blockExplorer: {
      name: 'Ham Chain Explorer',
      url: 'https://explorer.ham.fun',
      apiUrl: 'https://explorer.ham.fun/api/v2'
    },
    contracts: {},
    testnet: false
  },
  haqqMainnet: {
    id: 11235n,
    label: 'haqqMainnet',
    name: 'HAQQ Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Islamic Coin',
      symbol: 'ISLM'
    },
    providerURL: 'https://rpc.eth.haqq.network',
    blockExplorer: {
      name: 'HAQQ Explorer',
      url: 'https://explorer.haqq.network',
      apiUrl: 'https://explorer.haqq.network/api'
    },
    contracts: {},
    testnet: false
  },
  haqqTestedge2: {
    id: 54211n,
    label: 'haqqTestedge2',
    name: 'HAQQ Testedge 2',
    nativeCurrency: {
      decimals: 18,
      name: 'Islamic Coin',
      symbol: 'ISLMT'
    },
    providerURL: 'https://rpc.eth.testedge2.haqq.network',
    blockExplorer: {
      name: 'HAQQ Explorer',
      url: 'https://explorer.testedge2.haqq.network',
      apiUrl: 'https://explorer.testedge2.haqq.network/api'
    },
    contracts: {},
    testnet: false
  },
  hardhat: {
    id: 31337n,
    label: 'hardhat',
    name: 'Hardhat',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'http://127.0.0.1:8545',
    blockExplorer: {},
    contracts: {},
    testnet: true
  },
  harmonyOne: {
    id: 1666600000n,
    label: 'harmonyOne',
    name: 'Harmony One',
    nativeCurrency: {
      name: 'Harmony',
      symbol: 'ONE',
      decimals: 18
    },
    providerURL: 'https://rpc.ankr.com/harmony',
    blockExplorer: {
      name: 'Harmony Explorer',
      url: 'https://explorer.harmony.one'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 24185753
      }
    },
    testnet: false
  },
  hashkeyTestnet: {
    id: 133n,
    label: 'hashkeyTestnet',
    name: 'HashKey Chain Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'HashKey EcoPoints',
      symbol: 'HSK'
    },
    providerURL: 'https://hashkeychain-testnet.alt.technology',
    blockExplorer: {
      name: 'HashKey Chain Explorer',
      url: 'https://hashkeychain-testnet-explorer.alt.technology'
    },
    contracts: {},
    testnet: false
  },
  hedera: {
    id: 295n,
    label: 'hedera',
    name: 'Hedera Mainnet',
    nativeCurrency: {
      symbol: 'HBAR',
      name: 'HBAR',
      decimals: 18
    },
    providerURL: 'https://mainnet.hashio.io/api',
    blockExplorer: {
      name: 'Hashscan',
      url: 'https://hashscan.io/mainnet'
    },
    contracts: {},
    testnet: false
  },
  hederaPreviewnet: {
    id: 297n,
    label: 'hederaPreviewnet',
    name: 'Hedera Previewnet',
    nativeCurrency: {
      symbol: 'HBAR',
      name: 'HBAR',
      decimals: 18
    },
    providerURL: 'https://previewnet.hashio.io/api',
    blockExplorer: {
      name: 'Hashscan',
      url: 'https://hashscan.io/previewnet'
    },
    contracts: {},
    testnet: true
  },
  hederaTestnet: {
    id: 296n,
    label: 'hederaTestnet',
    name: 'Hedera Testnet',
    nativeCurrency: {
      symbol: 'HBAR',
      name: 'HBAR',
      decimals: 18
    },
    providerURL: 'https://testnet.hashio.io/api',
    blockExplorer: {
      name: 'Hashscan',
      url: 'https://hashscan.io/testnet'
    },
    contracts: {},
    testnet: true
  },
  holesky: {
    id: 17000n,
    label: 'holesky',
    name: 'Holesky',
    nativeCurrency: {
      name: 'Holesky Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://ethereum-holesky-rpc.publicnode.com',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://holesky.etherscan.io',
      apiUrl: 'https://api-holesky.etherscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 77
      },
      ensRegistry: {
        address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
        blockCreated: 801613
      },
      ensUniversalResolver: {
        address: '0xa6AC935D4971E3CD133b950aE053bECD16fE7f3b',
        blockCreated: 973484
      }
    },
    testnet: true
  },
  immutableZkEvm: {
    id: 13371n,
    label: 'immutableZkEvm',
    name: 'Immutable zkEVM',
    nativeCurrency: {
      decimals: 18,
      name: 'Immutable Coin',
      symbol: 'IMX'
    },
    providerURL: 'https://rpc.immutable.com',
    blockExplorer: {
      name: 'Immutable Explorer',
      url: 'https://explorer.immutable.com',
      apiUrl: 'https://explorer.immutable.com/api'
    },
    contracts: {
      multicall3: {
        address: '0x236bdA4589e44e6850f5aC6a74BfCa398a86c6c0',
        blockCreated: 4335972
      }
    },
    testnet: false
  },
  immutableZkEvmTestnet: {
    id: 13473n,
    label: 'immutableZkEvmTestnet',
    name: 'Immutable zkEVM Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Immutable Coin',
      symbol: 'IMX'
    },
    providerURL: 'https://rpc.testnet.immutable.com',
    blockExplorer: {
      name: 'Immutable Testnet Explorer',
      url: 'https://explorer.testnet.immutable.com/'
    },
    contracts: {
      multicall3: {
        address: '0x2CC787Ed364600B0222361C4188308Fa8E68bA60',
        blockCreated: 5977391
      }
    },
    testnet: true
  },
  inEVM: {
    id: 2525n,
    label: 'inEVM',
    name: 'inEVM Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Injective',
      symbol: 'INJ'
    },
    providerURL: 'https://mainnet.rpc.inevm.com/http',
    blockExplorer: {
      name: 'inEVM Explorer',
      url: 'https://inevm.calderaexplorer.xyz',
      apiUrl: 'https://inevm.calderaexplorer.xyz/api/v2'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 118606
      }
    },
    testnet: false
  },
  iota: {
    id: 8822n,
    label: 'iota',
    name: 'IOTA EVM',
    nativeCurrency: {
      decimals: 18,
      name: 'IOTA',
      symbol: 'IOTA'
    },
    providerURL: 'https://json-rpc.evm.iotaledger.net',
    blockExplorer: {
      name: 'Explorer',
      url: 'https://explorer.evm.iota.org',
      apiUrl: 'https://explorer.evm.iota.org/api'
    },
    contracts: {},
    testnet: false
  },
  iotaTestnet: {
    id: 1075n,
    label: 'iotaTestnet',
    name: 'IOTA EVM Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'IOTA',
      symbol: 'IOTA'
    },
    providerURL: 'https://json-rpc.evm.testnet.iotaledger.net',
    blockExplorer: {
      name: 'Explorer',
      url: 'https://explorer.evm.testnet.iotaledger.net',
      apiUrl: 'https://explorer.evm.testnet.iotaledger.net/api'
    },
    contracts: {},
    testnet: true
  },
  iotex: {
    id: 4689n,
    label: 'iotex',
    name: 'IoTeX',
    nativeCurrency: {
      decimals: 18,
      name: 'IoTeX',
      symbol: 'IOTX'
    },
    providerURL: 'https://babel-api.mainnet.iotex.io',
    blockExplorer: {
      name: 'IoTeXScan',
      url: 'https://iotexscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 22163670
      }
    },
    testnet: false
  },
  iotexTestnet: {
    id: 4690n,
    label: 'iotexTestnet',
    name: 'IoTeX Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'IoTeX',
      symbol: 'IOTX'
    },
    providerURL: 'https://babel-api.testnet.iotex.io',
    blockExplorer: {
      name: 'IoTeXScan',
      url: 'https://testnet.iotexscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xb5cecD6894c6f473Ec726A176f1512399A2e355d',
        blockCreated: 24347592
      }
    },
    testnet: true
  },
  jbc: {
    id: 8899n,
    label: 'jbc',
    name: 'JIBCHAIN L1',
    nativeCurrency: {
      name: 'JBC',
      symbol: 'JBC',
      decimals: 18
    },
    providerURL: 'https://rpc-l1.jibchain.net',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://exp-l1.jibchain.net',
      apiUrl: 'https://exp-l1.jibchain.net/api'
    },
    contracts: {
      multicall3: {
        address: '0xc0C8C486D1466C57Efe13C2bf000d4c56F47CBdC',
        blockCreated: 2299048
      }
    },
    testnet: false
  },
  jbcTestnet: {
    id: 88991n,
    label: 'jbcTestnet',
    name: 'Jibchain Testnet',
    nativeCurrency: {
      name: 'tJBC',
      symbol: 'tJBC',
      decimals: 18
    },
    providerURL: 'https://rpc.testnet.jibchain.net',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://exp.testnet.jibchain.net',
      apiUrl: 'https://exp.testnet.jibchain.net/api'
    },
    contracts: {
      multicall3: {
        address: '0xa1a858ad9041B4741e620355a3F96B3c78e70ecE',
        blockCreated: 32848
      }
    },
    testnet: true
  },
  kaia: {
    id: 8217n,
    label: 'kaia',
    name: 'Kaia',
    nativeCurrency: {
      decimals: 18,
      name: 'Kaia',
      symbol: 'KAIA'
    },
    providerURL: 'https://public-en.node.kaia.io',
    blockExplorer: {
      name: 'KaiaScope',
      url: 'https://kaiascope.com',
      apiUrl: 'https://api-cypress.klaytnscope.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 96002415
      }
    },
    testnet: false
  },
  kairos: {
    id: 1001n,
    label: 'kairos',
    name: 'Kairos Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Kairos KAIA',
      symbol: 'KAIA'
    },
    providerURL: 'https://public-en-kairos.node.kaia.io',
    blockExplorer: {
      name: 'KaiaScope',
      url: 'https://kairos.kaiascope.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 123390593
      }
    },
    testnet: true
  },
  kakarotSepolia: {
    id: 1802203764n,
    label: 'kakarotSepolia',
    name: 'Kakarot Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia-rpc.kakarot.org',
    blockExplorer: {
      name: 'Kakarot Scan',
      url: 'https://sepolia.kakarotscan.org'
    },
    contracts: {},
    testnet: true
  },
  karura: {
    id: 686n,
    label: 'karura',
    name: 'Karura',
    nativeCurrency: {
      name: 'Karura',
      symbol: 'KAR',
      decimals: 18
    },
    providerURL: 'https://eth-rpc-karura.aca-api.network',
    blockExplorer: {
      name: 'Karura Blockscout',
      url: 'https://blockscout.karura.network',
      apiUrl: 'https://blockscout.karura.network/api'
    },
    contracts: {},
    testnet: false
  },
  kava: {
    id: 2222n,
    label: 'kava',
    name: 'Kava EVM',
    nativeCurrency: {
      name: 'Kava',
      symbol: 'KAVA',
      decimals: 18
    },
    providerURL: 'https://evm.kava.io',
    blockExplorer: {
      name: 'Kava EVM Explorer',
      url: 'https://kavascan.com',
      apiUrl: 'https://kavascan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 3661165
      }
    },
    testnet: false
  },
  kavaTestnet: {
    id: 2221n,
    label: 'kavaTestnet',
    name: 'Kava EVM Testnet',
    nativeCurrency: {
      name: 'Kava',
      symbol: 'KAVA',
      decimals: 18
    },
    providerURL: 'https://evm.testnet.kava.io',
    blockExplorer: {
      name: 'Kava EVM Testnet Explorer',
      url: 'https://testnet.kavascan.com/',
      apiUrl: 'https://testnet.kavascan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xDf1D724A7166261eEB015418fe8c7679BBEa7fd6',
        blockCreated: 7242179
      }
    },
    testnet: true
  },
  kcc: {
    id: 321n,
    label: 'kcc',
    name: 'KCC Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'KCS',
      symbol: 'KCS'
    },
    providerURL: 'https://kcc-rpc.com',
    blockExplorer: {
      name: 'KCC Explorer',
      url: 'https://explorer.kcc.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 11760430
      }
    },
    testnet: false
  },
  klaytn: {
    id: 8217n,
    label: 'klaytn',
    name: 'Klaytn',
    nativeCurrency: {
      decimals: 18,
      name: 'Klaytn',
      symbol: 'KLAY'
    },
    providerURL: 'https://public-en-cypress.klaytn.net',
    blockExplorer: {
      name: 'KlaytnScope',
      url: 'https://scope.klaytn.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 96002415
      }
    },
    testnet: false
  },
  klaytnBaobab: {
    id: 1001n,
    label: 'klaytnBaobab',
    name: 'Klaytn Baobab Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Baobab Klaytn',
      symbol: 'KLAY'
    },
    providerURL: 'https://public-en-baobab.klaytn.net',
    blockExplorer: {
      name: 'KlaytnScope',
      url: 'https://baobab.klaytnscope.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 123390593
      }
    },
    testnet: true
  },
  koi: {
    id: 701n,
    label: 'koi',
    name: 'Koi Network',
    nativeCurrency: {
      decimals: 18,
      name: 'Koi Network Native Token',
      symbol: 'KRING'
    },
    providerURL: 'https://koi-rpc.darwinia.network',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://koi-scan.darwinia.network'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 180001
      }
    },
    testnet: true
  },
  kroma: {
    id: 255n,
    label: 'kroma',
    name: 'Kroma',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://api.kroma.network',
    blockExplorer: {
      name: 'Kroma Explorer',
      url: 'https://blockscout.kroma.network',
      apiUrl: 'https://blockscout.kroma.network/api'
    },
    contracts: {},
    testnet: false
  },
  kromaSepolia: {
    id: 2358n,
    label: 'kromaSepolia',
    name: 'Kroma Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://api.sepolia.kroma.network',
    blockExplorer: {
      name: 'Kroma Sepolia Explorer',
      url: 'https://blockscout.sepolia.kroma.network',
      apiUrl: 'https://blockscout.sepolia.kroma.network/api'
    },
    contracts: {},
    testnet: true
  },
  l3x: {
    id: 12324n,
    label: 'l3x',
    name: 'L3X Protocol',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc-mainnet.l3x.com',
    blockExplorer: {
      name: 'L3X Mainnet Explorer',
      url: 'https://explorer.l3x.com',
      apiUrl: 'https://explorer.l3x.com/api/v2'
    },
    contracts: {},
    testnet: false
  },
  l3xTestnet: {
    id: 12325n,
    label: 'l3xTestnet',
    name: 'L3X Protocol Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc-testnet.l3x.com',
    blockExplorer: {
      name: 'L3X Testnet Explorer',
      url: 'https://explorer-testnet.l3x.com',
      apiUrl: 'https://explorer-testnet.l3x.com/api/v2'
    },
    contracts: {},
    testnet: true
  },
  lightlinkPegasus: {
    id: 1891n,
    label: 'lightlinkPegasus',
    name: 'LightLink Pegasus Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://replicator.pegasus.lightlink.io/rpc/v1',
    blockExplorer: {
      name: 'LightLink Pegasus Explorer',
      url: 'https://pegasus.lightlink.io'
    },
    contracts: {},
    testnet: true
  },
  lightlinkPhoenix: {
    id: 1890n,
    label: 'lightlinkPhoenix',
    name: 'LightLink Phoenix Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://replicator.phoenix.lightlink.io/rpc/v1',
    blockExplorer: {
      name: 'LightLink Phoenix Explorer',
      url: 'https://phoenix.lightlink.io'
    },
    contracts: {},
    testnet: false
  },
  linea: {
    id: 59144n,
    label: 'linea',
    name: 'Linea Mainnet',
    nativeCurrency: {
      name: 'Linea Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.linea.build',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://lineascan.build',
      apiUrl: 'https://api.lineascan.build/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 42
      }
    },
    testnet: false
  },
  lineaGoerli: {
    id: 59140n,
    label: 'lineaGoerli',
    name: 'Linea Goerli Testnet',
    nativeCurrency: {
      name: 'Linea Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.goerli.linea.build',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://goerli.lineascan.build',
      apiUrl: 'https://api-goerli.lineascan.build/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 498623
      }
    },
    testnet: true
  },
  lineaSepolia: {
    id: 59141n,
    label: 'lineaSepolia',
    name: 'Linea Sepolia Testnet',
    nativeCurrency: {
      name: 'Linea Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.sepolia.linea.build',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://sepolia.lineascan.build',
      apiUrl: 'https://api-sepolia.lineascan.build/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 227427
      }
    },
    testnet: true
  },
  lineaTestnet: {
    id: 59140n,
    label: 'lineaTestnet',
    name: 'Linea Goerli Testnet',
    nativeCurrency: {
      name: 'Linea Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.goerli.linea.build',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://goerli.lineascan.build',
      apiUrl: 'https://goerli.lineascan.build/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 498623
      }
    },
    testnet: true
  },
  lisk: {
    id: 1135n,
    label: 'lisk',
    name: 'Lisk',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.api.lisk.com',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://blockscout.lisk.com',
      apiUrl: 'https://blockscout.lisk.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xA9d71E1dd7ca26F26e656E66d6AA81ed7f745bf0'
      }
    },
    testnet: false
  },
  liskSepolia: {
    id: 4202n,
    label: 'liskSepolia',
    name: 'Lisk Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.sepolia-api.lisk.com',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://sepolia-blockscout.lisk.com',
      apiUrl: 'https://sepolia-blockscout.lisk.com/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '11155111': {
          address: '0xA0E35F56C318DE1bD5D9ca6A94Fe7e37C5663348'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11'
      },
      portal: {
        '11155111': {
          address: '0xe3d90F21490686Ec7eF37BE788E02dfC12787264'
        }
      },
      l1StandardBridge: {
        '11155111': {
          address: '0x1Fb30e446eA791cd1f011675E5F3f5311b70faF5'
        }
      }
    },
    testnet: true
  },
  localhost: {
    id: 1337n,
    label: 'localhost',
    name: 'Localhost',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'http://127.0.0.1:8545',
    blockExplorer: {},
    contracts: {},
    testnet: true
  },
  lukso: {
    id: 42n,
    label: 'lukso',
    name: 'LUKSO',
    nativeCurrency: {
      name: 'LUKSO',
      symbol: 'LYX',
      decimals: 18
    },
    providerURL: 'https://rpc.mainnet.lukso.network',
    blockExplorer: {
      name: 'LUKSO Mainnet Explorer',
      url: 'https://explorer.execution.mainnet.lukso.network',
      apiUrl: 'https://api.explorer.execution.mainnet.lukso.network/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 468183
      }
    },
    testnet: false
  },
  luksoTestnet: {
    id: 4201n,
    label: 'luksoTestnet',
    name: 'LUKSO Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'LUKSO Testnet',
      symbol: 'LYXt'
    },
    providerURL: 'https://rpc.testnet.lukso.network',
    blockExplorer: {
      name: 'LUKSO Testnet Explorer',
      url: 'https://explorer.execution.testnet.lukso.network',
      apiUrl: 'https://api.explorer.execution.testnet.lukso.network/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 605348
      }
    },
    testnet: true
  },
  lycan: {
    id: 721n,
    label: 'lycan',
    name: 'Lycan',
    nativeCurrency: {
      decimals: 18,
      name: 'Lycan',
      symbol: 'LYC'
    },
    providerURL: 'https://rpc.lycanchain.com',
    blockExplorer: {
      name: 'Lycan Explorer',
      url: 'https://explorer.lycanchain.com'
    },
    contracts: {},
    testnet: false
  },
  lyra: {
    id: 957n,
    label: 'lyra',
    name: 'Lyra Chain',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.lyra.finance',
    blockExplorer: {
      name: 'Lyra Explorer',
      url: 'https://explorer.lyra.finance',
      apiUrl: 'https://explorer.lyra.finance/api/v2'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1935198
      }
    },
    testnet: false
  },
  mainnet: {
    id: 1n,
    label: 'mainnet',
    name: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://cloudflare-eth.com',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
      apiUrl: 'https://api.etherscan.io/api'
    },
    contracts: {
      ensRegistry: {
        address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
      },
      ensUniversalResolver: {
        address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
        blockCreated: 19258213
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14353601
      }
    },
    testnet: false
  },
  mandala: {
    id: 595n,
    label: 'mandala',
    name: 'Mandala TC9',
    nativeCurrency: {
      name: 'Mandala',
      symbol: 'mACA',
      decimals: 18
    },
    providerURL: 'https://eth-rpc-tc9.aca-staging.network',
    blockExplorer: {
      name: 'Mandala Blockscout',
      url: 'https://blockscout.mandala.aca-staging.network',
      apiUrl: 'https://blockscout.mandala.aca-staging.network/api'
    },
    contracts: {},
    testnet: true
  },
  manta: {
    id: 169n,
    label: 'manta',
    name: 'Manta Pacific Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    providerURL: 'https://pacific-rpc.manta.network/http',
    blockExplorer: {
      name: 'Manta Explorer',
      url: 'https://pacific-explorer.manta.network',
      apiUrl: 'https://pacific-explorer.manta.network/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 332890
      }
    },
    testnet: false
  },
  mantaSepoliaTestnet: {
    id: 3441006n,
    label: 'mantaSepoliaTestnet',
    name: 'Manta Pacific Sepolia Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    providerURL: 'https://pacific-rpc.sepolia-testnet.manta.network/http',
    blockExplorer: {
      name: 'Manta Sepolia Testnet Explorer',
      url: 'https://pacific-explorer.sepolia-testnet.manta.network',
      apiUrl: 'https://pacific-explorer.sepolia-testnet.manta.network/api'
    },
    contracts: {
      multicall3: {
        address: '0xca54918f7B525C8df894668846506767412b53E3',
        blockCreated: 479584
      }
    },
    testnet: true
  },
  mantaTestnet: {
    id: 3441005n,
    label: 'mantaTestnet',
    name: 'Manta Pacific Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    providerURL: 'https://manta-testnet.calderachain.xyz/http',
    blockExplorer: {
      name: 'Manta Testnet Explorer',
      url: 'https://pacific-explorer.testnet.manta.network',
      apiUrl: 'https://pacific-explorer.testnet.manta.network/api'
    },
    contracts: {
      multicall3: {
        address: '0x211B1643b95Fe76f11eD8880EE810ABD9A4cf56C',
        blockCreated: 419915
      }
    },
    testnet: true
  },
  mantle: {
    id: 5000n,
    label: 'mantle',
    name: 'Mantle',
    nativeCurrency: {
      decimals: 18,
      name: 'MNT',
      symbol: 'MNT'
    },
    providerURL: 'https://rpc.mantle.xyz',
    blockExplorer: {
      name: 'Mantle Explorer',
      url: 'https://mantlescan.xyz/',
      apiUrl: 'https://api.mantlescan.xyz/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 304717
      }
    },
    testnet: false
  },
  mantleSepoliaTestnet: {
    id: 5003n,
    label: 'mantleSepoliaTestnet',
    name: 'Mantle Sepolia Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'MNT',
      symbol: 'MNT'
    },
    providerURL: 'https://rpc.sepolia.mantle.xyz',
    blockExplorer: {
      name: 'Mantle Testnet Explorer',
      url: 'https://explorer.sepolia.mantle.xyz/',
      apiUrl: 'https://explorer.sepolia.mantle.xyz/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 4584012
      }
    },
    testnet: true
  },
  mantleTestnet: {
    id: 5001n,
    label: 'mantleTestnet',
    name: 'Mantle Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'MNT',
      symbol: 'MNT'
    },
    providerURL: 'https://rpc.testnet.mantle.xyz',
    blockExplorer: {
      name: 'Mantle Testnet Explorer',
      url: 'https://explorer.testnet.mantle.xyz',
      apiUrl: 'https://explorer.testnet.mantle.xyz/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 561333
      }
    },
    testnet: true
  },
  merlin: {
    id: 4200n,
    label: 'merlin',
    name: 'Merlin',
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    providerURL: 'https://rpc.merlinchain.io',
    blockExplorer: {
      name: 'blockscout',
      url: 'https://scan.merlinchain.io',
      apiUrl: 'https://scan.merlinchain.io/api'
    },
    contracts: {},
    testnet: false
  },
  metachain: {
    id: 571n,
    label: 'metachain',
    name: 'MetaChain Mainnet',
    nativeCurrency: {
      name: 'Metatime Coin',
      symbol: 'MTC',
      decimals: 18
    },
    providerURL: 'https://rpc.metatime.com',
    blockExplorer: {
      name: 'MetaExplorer',
      url: 'https://explorer.metatime.com'
    },
    contracts: {
      multicall3: {
        address: '0x0000000000000000000000000000000000003001',
        blockCreated: 0
      }
    },
    testnet: false
  },
  metachainIstanbul: {
    id: 1453n,
    label: 'metachainIstanbul',
    name: 'MetaChain Istanbul',
    nativeCurrency: {
      name: 'Metatime Coin',
      symbol: 'MTC',
      decimals: 18
    },
    providerURL: 'https://istanbul-rpc.metachain.dev',
    blockExplorer: {
      name: 'MetaExplorer',
      url: 'https://istanbul-explorer.metachain.dev'
    },
    contracts: {
      multicall3: {
        address: '0x0000000000000000000000000000000000003001',
        blockCreated: 0
      }
    },
    testnet: true
  },
  metalL2: {
    id: 1750n,
    label: 'metalL2',
    name: 'Metal L2',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.metall2.com',
    blockExplorer: {
      name: 'Explorer',
      url: 'https://explorer.metall2.com',
      apiUrl: 'https://explorer.metall2.com/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '1': {
          address: '0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426'
        }
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 0
      },
      portal: {
        '1': {
          address: '0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956'
        }
      },
      l1StandardBridge: {
        '1': {
          address: '0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3'
        }
      }
    },
    testnet: false
  },
  meter: {
    id: 82n,
    label: 'meter',
    name: 'Meter',
    nativeCurrency: {
      decimals: 18,
      name: 'MTR',
      symbol: 'MTR'
    },
    providerURL: 'https://rpc.meter.io',
    blockExplorer: {
      name: 'MeterScan',
      url: 'https://scan.meter.io'
    },
    contracts: {},
    testnet: false
  },
  meterTestnet: {
    id: 83n,
    label: 'meterTestnet',
    name: 'Meter Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'MTR',
      symbol: 'MTR'
    },
    providerURL: 'https://rpctest.meter.io',
    blockExplorer: {
      name: 'MeterTestnetScan',
      url: 'https://scan-warringstakes.meter.io'
    },
    contracts: {},
    testnet: false
  },
  metis: {
    id: 1088n,
    label: 'metis',
    name: 'Metis',
    nativeCurrency: {
      decimals: 18,
      name: 'Metis',
      symbol: 'METIS'
    },
    providerURL: 'https://andromeda.metis.io/?owner=1088',
    blockExplorer: {
      name: 'Metis Explorer',
      url: 'https://explorer.metis.io',
      apiUrl: 'https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 2338552
      }
    },
    testnet: false
  },
  metisGoerli: {
    id: 599n,
    label: 'metisGoerli',
    name: 'Metis Goerli',
    nativeCurrency: {
      decimals: 18,
      name: 'Metis Goerli',
      symbol: 'METIS'
    },
    providerURL: 'https://goerli.gateway.metisdevops.link',
    blockExplorer: {
      name: 'Metis Goerli Explorer',
      url: 'https://goerli.explorer.metisdevops.link',
      apiUrl: 'https://goerli.explorer.metisdevops.link/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1006207
      }
    },
    testnet: false
  },
  mev: {
    id: 7518n,
    label: 'mev',
    name: 'MEVerse Chain Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'MEVerse',
      symbol: 'MEV'
    },
    providerURL: 'https://rpc.meversemainnet.io',
    blockExplorer: {
      name: 'Explorer',
      url: 'https://www.meversescan.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 86881340
      }
    },
    testnet: false
  },
  mevTestnet: {
    id: 4759n,
    label: 'mevTestnet',
    name: 'MEVerse Chain Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'MEVerse',
      symbol: 'MEV'
    },
    providerURL: 'https://rpc.meversetestnet.io',
    blockExplorer: {
      name: 'Explorer',
      url: 'https://testnet.meversescan.io/'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 64371115
      }
    },
    testnet: true
  },
  mintSepoliaTestnet: {
    id: 1686n,
    label: 'mintSepoliaTestnet',
    name: 'Mint Sepolia Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://testnet-rpc.mintchain.io',
    blockExplorer: {
      name: 'Mintchain Testnet explorer',
      url: 'https://testnet-explorer.mintchain.io'
    },
    contracts: {},
    testnet: true
  },
  mode: {
    id: 34443n,
    label: 'mode',
    name: 'Mode Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://mainnet.mode.network',
    blockExplorer: {
      name: 'Modescan',
      url: 'https://modescan.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 2465882
      },
      l2OutputOracle: {
        '1': {
          address: '0x4317ba146D4933D889518a3e5E11Fe7a53199b04'
        }
      },
      portal: {
        '1': {
          address: '0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07'
        }
      },
      l1StandardBridge: {
        '1': {
          address: '0x735aDBbE72226BD52e818E7181953f42E3b0FF21'
        }
      }
    },
    testnet: false
  },
  modeTestnet: {
    id: 919n,
    label: 'modeTestnet',
    name: 'Mode Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.mode.network',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://sepolia.explorer.mode.network',
      apiUrl: 'https://sepolia.explorer.mode.network/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '11155111': {
          address: '0x2634BD65ba27AB63811c74A63118ACb312701Bfa',
          blockCreated: 3778393
        }
      },
      portal: {
        '11155111': {
          address: '0x320e1580effF37E008F1C92700d1eBa47c1B23fD',
          blockCreated: 3778395
        }
      },
      l1StandardBridge: {
        '11155111': {
          address: '0xbC5C679879B2965296756CD959C3C739769995E2',
          blockCreated: 3778392
        }
      },
      multicall3: {
        address: '0xBAba8373113Fb7a68f195deF18732e01aF8eDfCF',
        blockCreated: 3019007
      }
    },
    testnet: true
  },
  moonbaseAlpha: {
    id: 1287n,
    label: 'moonbaseAlpha',
    name: 'Moonbase Alpha',
    nativeCurrency: {
      decimals: 18,
      name: 'DEV',
      symbol: 'DEV'
    },
    providerURL: 'https://rpc.api.moonbase.moonbeam.network',
    blockExplorer: {
      name: 'Moonscan',
      url: 'https://moonbase.moonscan.io',
      apiUrl: 'https://moonbase.moonscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 1850686
      }
    },
    testnet: true
  },
  moonbeam: {
    id: 1284n,
    label: 'moonbeam',
    name: 'Moonbeam',
    nativeCurrency: {
      decimals: 18,
      name: 'GLMR',
      symbol: 'GLMR'
    },
    providerURL: 'https://moonbeam.public.blastapi.io',
    blockExplorer: {
      name: 'Moonscan',
      url: 'https://moonscan.io',
      apiUrl: 'https://api-moonbeam.moonscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 609002
      }
    },
    testnet: false
  },
  moonbeamDev: {
    id: 1281n,
    label: 'moonbeamDev',
    name: 'Moonbeam Development Node',
    nativeCurrency: {
      decimals: 18,
      name: 'DEV',
      symbol: 'DEV'
    },
    providerURL: 'http://127.0.0.1:9944',
    blockExplorer: {},
    contracts: {},
    testnet: false
  },
  moonriver: {
    id: 1285n,
    label: 'moonriver',
    name: 'Moonriver',
    nativeCurrency: {
      decimals: 18,
      name: 'MOVR',
      symbol: 'MOVR'
    },
    providerURL: 'https://moonriver.public.blastapi.io',
    blockExplorer: {
      name: 'Moonscan',
      url: 'https://moonriver.moonscan.io',
      apiUrl: 'https://api-moonriver.moonscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 1597904
      }
    },
    testnet: false
  },
  morphHolesky: {
    id: 2810n,
    label: 'morphHolesky',
    name: 'Morph Holesky',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc-quicknode-holesky.morphl2.io',
    blockExplorer: {
      name: 'Morph Holesky Explorer',
      url: 'https://explorer-holesky.morphl2.io',
      apiUrl: 'https://explorer-api-holesky.morphl2.io/api?'
    },
    contracts: {},
    testnet: true
  },
  morphSepolia: {
    id: 2710n,
    label: 'morphSepolia',
    name: 'Morph Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc-testnet.morphl2.io',
    blockExplorer: {
      name: 'Morph Testnet Explorer',
      url: 'https://explorer-testnet.morphl2.io',
      apiUrl: 'https://explorer-api-testnet.morphl2.io/api'
    },
    contracts: {},
    testnet: true
  },
  nautilus: {
    id: 22222n,
    label: 'nautilus',
    name: 'Nautilus Mainnet',
    nativeCurrency: {
      name: 'ZBC',
      symbol: 'ZBC',
      decimals: 9
    },
    providerURL: 'https://api.nautilus.nautchain.xyz',
    blockExplorer: {
      name: 'NautScan',
      url: 'https://nautscan.com'
    },
    contracts: {},
    testnet: false
  },
  neonDevnet: {
    id: 245022926n,
    label: 'neonDevnet',
    name: 'Neon EVM DevNet',
    nativeCurrency: {
      name: 'NEON',
      symbol: 'NEON',
      decimals: 18
    },
    providerURL: 'https://devnet.neonevm.org',
    blockExplorer: {
      name: 'Neonscan',
      url: 'https://devnet.neonscan.org'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 205206112
      }
    },
    testnet: true
  },
  neonMainnet: {
    id: 245022934n,
    label: 'neonMainnet',
    name: 'Neon EVM MainNet',
    nativeCurrency: {
      name: 'NEON',
      symbol: 'NEON',
      decimals: 18
    },
    providerURL: 'https://neon-proxy-mainnet.solana.p2p.org',
    blockExplorer: {
      name: 'Neonscan',
      url: 'https://neonscan.org'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 206545524
      }
    },
    testnet: false
  },
  nexi: {
    id: 4242n,
    label: 'nexi',
    name: 'Nexi',
    nativeCurrency: {
      name: 'Nexi',
      symbol: 'NEXI',
      decimals: 18
    },
    providerURL: 'https://rpc.chain.nexi.technology',
    blockExplorer: {
      name: 'NexiScan',
      url: 'https://www.nexiscan.com',
      apiUrl: 'https://www.nexiscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0x0277A46Cc69A57eE3A6C8c158bA874832F718B8E',
        blockCreated: 25770160
      }
    },
    testnet: false
  },
  nexilix: {
    id: 240n,
    label: 'nexilix',
    name: 'Nexilix Smart Chain',
    nativeCurrency: {
      decimals: 18,
      name: 'Nexilix',
      symbol: 'NEXILIX'
    },
    providerURL: 'https://rpcurl.pos.nexilix.com',
    blockExplorer: {
      name: 'NexilixScan',
      url: 'https://scan.nexilix.com'
    },
    contracts: {
      multicall3: {
        address: '0x58381c8e2BF9d0C2C4259cA14BdA9Afe02831244',
        blockCreated: 74448
      }
    },
    testnet: false
  },
  oasisTestnet: {
    id: 4090n,
    label: 'oasisTestnet',
    name: 'Oasis Testnet',
    nativeCurrency: {
      name: 'Fasttoken',
      symbol: 'FTN',
      decimals: 18
    },
    providerURL: 'https://rpc1.oasis.bahamutchain.com',
    blockExplorer: {
      name: 'Ftnscan',
      url: 'https://oasis.ftnscan.com',
      apiUrl: 'https://oasis.ftnscan.com/api'
    },
    contracts: {},
    testnet: true
  },
  oasys: {
    id: 248n,
    label: 'oasys',
    name: 'Oasys',
    nativeCurrency: {
      name: 'Oasys',
      symbol: 'OAS',
      decimals: 18
    },
    providerURL: 'https://rpc.mainnet.oasys.games',
    blockExplorer: {
      name: 'OasysScan',
      url: 'https://scan.oasys.games',
      apiUrl: 'https://scan.oasys.games/api'
    },
    contracts: {},
    testnet: false
  },
  okc: {
    id: 66n,
    label: 'okc',
    name: 'OKC',
    nativeCurrency: {
      decimals: 18,
      name: 'OKT',
      symbol: 'OKT'
    },
    providerURL: 'https://exchainrpc.okex.org',
    blockExplorer: {
      name: 'oklink',
      url: 'https://www.oklink.com/okc'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 10364792
      }
    },
    testnet: false
  },
  oortMainnetDev: {
    id: 9700n,
    label: 'oortMainnetDev',
    name: 'OORT MainnetDev',
    nativeCurrency: {
      decimals: 18,
      name: 'OORT',
      symbol: 'OORT'
    },
    providerURL: 'https://dev-rpc.oortech.com',
    blockExplorer: {
      name: 'OORT MainnetDev Explorer',
      url: 'https://dev-scan.oortech.com'
    },
    contracts: {},
    testnet: false
  },
  opBNB: {
    id: 204n,
    label: 'opBNB',
    name: 'opBNB',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    providerURL: 'https://opbnb-mainnet-rpc.bnbchain.org',
    blockExplorer: {
      name: 'opbnbscan',
      url: 'https://mainnet.opbnbscan.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 512881
      }
    },
    testnet: false
  },
  opBNBTestnet: {
    id: 5611n,
    label: 'opBNBTestnet',
    name: 'opBNB Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'tBNB',
      symbol: 'tBNB'
    },
    providerURL: 'https://opbnb-testnet-rpc.bnbchain.org',
    blockExplorer: {
      name: 'opbnbscan',
      url: 'https://testnet.opbnbscan.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 3705108
      }
    },
    testnet: true
  },
  optimism: {
    id: 10n,
    label: 'optimism',
    name: 'OP Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://mainnet.optimism.io',
    blockExplorer: {
      name: 'Optimism Explorer',
      url: 'https://optimistic.etherscan.io',
      apiUrl: 'https://api-optimistic.etherscan.io/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      disputeGameFactory: {
        '1': {
          address: '0xe5965Ab5962eDc7477C8520243A95517CD252fA9'
        }
      },
      l2OutputOracle: {
        '1': {
          address: '0xdfe97868233d1aa22e815a266982f2cf17685a27'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 4286263
      },
      portal: {
        '1': {
          address: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed'
        }
      },
      l1StandardBridge: {
        '1': {
          address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1'
        }
      }
    },
    testnet: false
  },
  optimismGoerli: {
    id: 420n,
    label: 'optimismGoerli',
    name: 'Optimism Goerli',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://goerli.optimism.io',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://goerli-optimism.etherscan.io',
      apiUrl: 'https://goerli-optimism.etherscan.io/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '5': {
          address: '0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 49461
      },
      portal: {
        '5': {
          address: '0x5b47E1A08Ea6d985D6649300584e6722Ec4B1383'
        }
      },
      l1StandardBridge: {
        '5': {
          address: '0x636Af16bf2f682dD3109e60102b8E1A089FedAa8'
        }
      }
    },
    testnet: true
  },
  optimismSepolia: {
    id: 11155420n,
    label: 'optimismSepolia',
    name: 'OP Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.optimism.io',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://optimism-sepolia.blockscout.com',
      apiUrl: 'https://optimism-sepolia.blockscout.com/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      disputeGameFactory: {
        '11155111': {
          address: '0x05F9613aDB30026FFd634f38e5C4dFd30a197Fa1'
        }
      },
      l2OutputOracle: {
        '11155111': {
          address: '0x90E9c4f8a994a250F6aEfd61CAFb4F2e895D458F'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1620204
      },
      portal: {
        '11155111': {
          address: '0x16Fc5058F25648194471939df75CF27A2fdC48BC'
        }
      },
      l1StandardBridge: {
        '11155111': {
          address: '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1'
        }
      }
    },
    testnet: true
  },
  otimDevnet: {
    id: 41144114n,
    label: 'otimDevnet',
    name: 'Otim Devnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    providerURL: 'http://devnet.otim.xyz',
    blockExplorer: {},
    contracts: {
      batchInvoker: {
        address: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
      }
    },
    testnet: false
  },
  palm: {
    id: 11297108109n,
    label: 'palm',
    name: 'Palm',
    nativeCurrency: {
      decimals: 18,
      name: 'PALM',
      symbol: 'PALM'
    },
    providerURL: 'https://palm-mainnet.public.blastapi.io',
    blockExplorer: {
      name: 'Chainlens',
      url: 'https://palm.chainlens.com'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 15429248
      }
    },
    testnet: false
  },
  palmTestnet: {
    id: 11297108099n,
    label: 'palmTestnet',
    name: 'Palm Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'PALM',
      symbol: 'PALM'
    },
    providerURL: 'https://palm-mainnet.public.blastapi.io',
    blockExplorer: {
      name: 'Chainlens',
      url: 'https://palm.chainlens.com'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 15429248
      }
    },
    testnet: true
  },
  pgn: {
    id: 424n,
    label: 'pgn',
    name: 'PGN',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.publicgoods.network',
    blockExplorer: {
      name: 'PGN Explorer',
      url: 'https://explorer.publicgoods.network',
      apiUrl: 'https://explorer.publicgoods.network/api'
    },
    contracts: {
      l2OutputOracle: {
        '1': {
          address: '0x9E6204F750cD866b299594e2aC9eA824E2e5f95c'
        }
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 3380209
      },
      portal: {
        '1': {
          address: '0xb26Fd985c5959bBB382BAFdD0b879E149e48116c'
        }
      },
      l1StandardBridge: {
        '1': {
          address: '0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b'
        }
      }
    },
    testnet: false
  },
  pgnTestnet: {
    id: 58008n,
    label: 'pgnTestnet',
    name: 'PGN ',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.publicgoods.network',
    blockExplorer: {
      name: 'PGN Testnet Explorer',
      url: 'https://explorer.sepolia.publicgoods.network',
      apiUrl: 'https://explorer.sepolia.publicgoods.network/api'
    },
    contracts: {
      l2OutputOracle: {
        '11155111': {
          address: '0xD5bAc3152ffC25318F848B3DD5dA6C85171BaEEe'
        }
      },
      portal: {
        '11155111': {
          address: '0xF04BdD5353Bb0EFF6CA60CfcC78594278eBfE179'
        }
      },
      l1StandardBridge: {
        '11155111': {
          address: '0xFaE6abCAF30D23e233AC7faF747F2fC3a5a6Bfa3'
        }
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 3754925
      }
    },
    testnet: true
  },
  phoenix: {
    id: 13381n,
    label: 'phoenix',
    name: 'Phoenix Blockchain',
    nativeCurrency: {
      name: 'Phoenix',
      symbol: 'PHX',
      decimals: 18
    },
    providerURL: 'https://rpc.phoenixplorer.com',
    blockExplorer: {
      name: 'Phoenixplorer',
      url: 'https://phoenixplorer.com',
      apiUrl: 'https://phoenixplorer.com/api'
    },
    contracts: {
      multicall3: {
        address: '0x498cF757a575cFF2c2Ed9f532f56Efa797f86442',
        blockCreated: 5620192
      }
    },
    testnet: false
  },
  playfiAlbireo: {
    id: 1612127n,
    label: 'playfiAlbireo',
    name: 'PlayFi Albireo Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://albireo-rpc.playfi.ai',
    blockExplorer: {
      name: 'PlayFi Albireo Explorer',
      url: 'https://albireo-explorer.playfi.ai'
    },
    contracts: {
      multicall3: {
        address: '0xF9cda624FBC7e059355ce98a31693d299FACd963'
      }
    },
    testnet: true
  },
  plinga: {
    id: 242n,
    label: 'plinga',
    name: 'Plinga',
    nativeCurrency: {
      name: 'Plinga',
      symbol: 'PLINGA',
      decimals: 18
    },
    providerURL: 'https://rpcurl.mainnet.plgchain.com',
    blockExplorer: {
      name: 'Plgscan',
      url: 'https://www.plgscan.com'
    },
    contracts: {
      multicall3: {
        address: '0x0989576160f2e7092908BB9479631b901060b6e4',
        blockCreated: 204489
      }
    },
    testnet: false
  },
  plumeTestnet: {
    id: 161221135n,
    label: 'plumeTestnet',
    name: 'Plume Testnet',
    nativeCurrency: {
      name: 'Plume Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://testnet-rpc.plumenetwork.xyz/http',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://testnet-explorer.plumenetwork.xyz',
      apiUrl: 'https://testnet-explorer.plumenetwork.xyz/api'
    },
    contracts: {},
    testnet: true
  },
  polygon: {
    id: 137n,
    label: 'polygon',
    name: 'Polygon',
    nativeCurrency: {
      name: 'POL',
      symbol: 'POL',
      decimals: 18
    },
    providerURL: 'https://polygon-rpc.com',
    blockExplorer: {
      name: 'PolygonScan',
      url: 'https://polygonscan.com',
      apiUrl: 'https://api.polygonscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 25770160
      }
    },
    testnet: false
  },
  polygonAmoy: {
    id: 80002n,
    label: 'polygonAmoy',
    name: 'Polygon Amoy',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    providerURL: 'https://rpc-amoy.polygon.technology',
    blockExplorer: {
      name: 'PolygonScan',
      url: 'https://amoy.polygonscan.com',
      apiUrl: 'https://api-amoy.polygonscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 3127388
      }
    },
    testnet: true
  },
  polygonMumbai: {
    id: 80001n,
    label: 'polygonMumbai',
    name: 'Polygon Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    providerURL: 'https://rpc.ankr.com/polygon_mumbai',
    blockExplorer: {
      name: 'PolygonScan',
      url: 'https://mumbai.polygonscan.com',
      apiUrl: 'https://api-testnet.polygonscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 25770160
      }
    },
    testnet: true
  },
  polygonZkEvm: {
    id: 1101n,
    label: 'polygonZkEvm',
    name: 'Polygon zkEVM',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://zkevm-rpc.com',
    blockExplorer: {
      name: 'PolygonScan',
      url: 'https://zkevm.polygonscan.com',
      apiUrl: 'https://api-zkevm.polygonscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 57746
      }
    },
    testnet: false
  },
  polygonZkEvmCardona: {
    id: 2442n,
    label: 'polygonZkEvmCardona',
    name: 'Polygon zkEVM Cardona',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.cardona.zkevm-rpc.com',
    blockExplorer: {
      name: 'PolygonScan',
      url: 'https://cardona-zkevm.polygonscan.com',
      apiUrl: 'https://cardona-zkevm.polygonscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 114091
      }
    },
    testnet: true
  },
  polygonZkEvmTestnet: {
    id: 1442n,
    label: 'polygonZkEvmTestnet',
    name: 'Polygon zkEVM Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.public.zkevm-test.net',
    blockExplorer: {
      name: 'PolygonScan',
      url: 'https://testnet-zkevm.polygonscan.com',
      apiUrl: 'https://testnet-zkevm.polygonscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 525686
      }
    },
    testnet: true
  },
  pulsechain: {
    id: 369n,
    label: 'pulsechain',
    name: 'PulseChain',
    nativeCurrency: {
      name: 'Pulse',
      symbol: 'PLS',
      decimals: 18
    },
    providerURL: 'https://rpc.pulsechain.com',
    blockExplorer: {
      name: 'PulseScan',
      url: 'https://scan.pulsechain.com',
      apiUrl: 'https://api.scan.pulsechain.com/api'
    },
    contracts: {
      ensRegistry: {
        address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14353601
      }
    },
    testnet: false
  },
  pulsechainV4: {
    id: 943n,
    label: 'pulsechainV4',
    name: 'PulseChain V4',
    nativeCurrency: {
      name: 'V4 Pulse',
      symbol: 'v4PLS',
      decimals: 18
    },
    providerURL: 'https://rpc.v4.testnet.pulsechain.com',
    blockExplorer: {
      name: 'PulseScan',
      url: 'https://scan.v4.testnet.pulsechain.com',
      apiUrl: 'https://scan.v4.testnet.pulsechain.com/api'
    },
    contracts: {
      ensRegistry: {
        address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14353601
      }
    },
    testnet: true
  },
  qMainnet: {
    id: 35441n,
    label: 'qMainnet',
    name: 'Q Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Q',
      symbol: 'Q'
    },
    providerURL: 'https://rpc.q.org',
    blockExplorer: {
      name: 'Q Mainnet Explorer',
      url: 'https://explorer.q.org',
      apiUrl: 'https://explorer.q.org/api'
    },
    contracts: {},
    testnet: false
  },
  qTestnet: {
    id: 35443n,
    label: 'qTestnet',
    name: 'Q Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Q',
      symbol: 'Q'
    },
    providerURL: 'https://rpc.qtestnet.org',
    blockExplorer: {
      name: 'Q Testnet Explorer',
      url: 'https://explorer.qtestnet.org',
      apiUrl: 'https://explorer.qtestnet.org/api'
    },
    contracts: {},
    testnet: true
  },
  real: {
    id: 111188n,
    label: 'real',
    name: 're.al',
    nativeCurrency: {
      name: 'reETH',
      decimals: 18,
      symbol: 'reETH'
    },
    providerURL: 'https://real.drpc.org',
    blockExplorer: {
      name: 're.al Explorer',
      url: 'https://explorer.re.al',
      apiUrl: 'https://explorer.re.al/api/v2'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 695
      }
    },
    testnet: false
  },
  redbellyTestnet: {
    id: 153n,
    label: 'redbellyTestnet',
    name: 'Redbelly Network Testnet',
    nativeCurrency: {
      name: 'Redbelly Native Coin',
      symbol: 'RBNT',
      decimals: 18
    },
    providerURL: 'https://governors.testnet.redbelly.network',
    blockExplorer: {
      name: 'Ethernal',
      url: 'https://explorer.testnet.redbelly.network',
      apiUrl: 'https://ethernal.fly.dev/api'
    },
    contracts: {},
    testnet: true
  },
  redstone: {
    id: 690n,
    label: 'redstone',
    name: 'Redstone',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.redstonechain.com',
    blockExplorer: {
      name: 'Explorer',
      url: '\thttps://explorer.redstone.xyz'
    },
    contracts: {},
    testnet: false
  },
  reyaNetwork: {
    id: 1729n,
    label: 'reyaNetwork',
    name: 'Reya Network',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.reya.network',
    blockExplorer: {
      name: 'Reya Network Explorer',
      url: 'https://explorer.reya.network'
    },
    contracts: {},
    testnet: false
  },
  rollux: {
    id: 570n,
    label: 'rollux',
    name: 'Rollux Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Syscoin',
      symbol: 'SYS'
    },
    providerURL: 'https://rpc.rollux.com',
    blockExplorer: {
      name: 'RolluxExplorer',
      url: 'https://explorer.rollux.com',
      apiUrl: 'https://explorer.rollux.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 119222
      }
    },
    testnet: false
  },
  rolluxTestnet: {
    id: 57000n,
    label: 'rolluxTestnet',
    name: 'Rollux Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Syscoin',
      symbol: 'SYS'
    },
    providerURL: 'https://rpc-tanenbaum.rollux.com/',
    blockExplorer: {
      name: 'RolluxTestnetExplorer',
      url: 'https://rollux.tanenbaum.io',
      apiUrl: 'https://rollux.tanenbaum.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 1813675
      }
    },
    testnet: false
  },
  ronin: {
    id: 2020n,
    label: 'ronin',
    name: 'Ronin',
    nativeCurrency: {
      name: 'RON',
      symbol: 'RON',
      decimals: 18
    },
    providerURL: 'https://api.roninchain.com/rpc',
    blockExplorer: {
      name: 'Ronin Explorer',
      url: 'https://app.roninchain.com'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 26023535
      }
    },
    testnet: false
  },
  root: {
    id: 7668n,
    label: 'root',
    name: 'The Root Network',
    nativeCurrency: {
      decimals: 18,
      name: 'XRP',
      symbol: 'XRP'
    },
    providerURL: 'https://root.rootnet.live/archive',
    blockExplorer: {
      name: 'Rootscan',
      url: 'https://rootscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xc9C2E2429AeC354916c476B30d729deDdC94988d',
        blockCreated: 9218338
      }
    },
    testnet: false
  },
  rootPorcini: {
    id: 7672n,
    label: 'rootPorcini',
    name: 'The Root Network - Porcini',
    nativeCurrency: {
      decimals: 18,
      name: 'XRP',
      symbol: 'XRP'
    },
    providerURL: 'https://porcini.rootnet.app/archive',
    blockExplorer: {
      name: 'Rootscan',
      url: 'https://porcini.rootscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xc9C2E2429AeC354916c476B30d729deDdC94988d',
        blockCreated: 10555692
      }
    },
    testnet: true
  },
  rootstock: {
    id: 30n,
    label: 'rootstock',
    name: 'Rootstock Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Rootstock Bitcoin',
      symbol: 'RBTC'
    },
    providerURL: 'https://public-node.rsk.co',
    blockExplorer: {
      name: 'RSK Explorer',
      url: 'https://explorer.rsk.co'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 4249540
      }
    },
    testnet: false
  },
  rootstockTestnet: {
    id: 31n,
    label: 'rootstockTestnet',
    name: 'Rootstock Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Rootstock Bitcoin',
      symbol: 'tRBTC'
    },
    providerURL: 'https://public-node.testnet.rsk.co',
    blockExplorer: {
      name: 'RSK Explorer',
      url: 'https://explorer.testnet.rootstock.io'
    },
    contracts: {},
    testnet: true
  },
  rss3: {
    id: 12553n,
    label: 'rss3',
    name: 'RSS3 VSL Mainnet',
    nativeCurrency: {
      name: 'RSS3',
      symbol: 'RSS3',
      decimals: 18
    },
    providerURL: 'https://rpc.rss3.io',
    blockExplorer: {
      name: 'RSS3 VSL Mainnet Scan',
      url: 'https://scan.rss3.io',
      apiUrl: 'https://scan.rss3.io/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '1': {
          address: '0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14193
      },
      portal: {
        '1': {
          address: '0x6A12432491bbbE8d3babf75F759766774C778Db4',
          blockCreated: 19387057
        }
      },
      l1StandardBridge: {
        '1': {
          address: '0x4cbab69108Aa72151EDa5A3c164eA86845f18438'
        }
      }
    },
    testnet: false
  },
  rss3Sepolia: {
    id: 2331n,
    label: 'rss3Sepolia',
    name: 'RSS3 VSL Sepolia Testnet',
    nativeCurrency: {
      name: 'RSS3',
      symbol: 'RSS3',
      decimals: 18
    },
    providerURL: 'https://rpc.testnet.rss3.io',
    blockExplorer: {
      name: 'RSS3 VSL Sepolia Testnet Scan',
      url: 'https://scan.testnet.rss3.io',
      apiUrl: 'https://scan.testnet.rss3.io/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '11155111': {
          address: '0xDb5c46C3Eaa6Ed6aE8b2379785DF7dd029C0dC81'
        }
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 55697
      },
      portal: {
        '11155111': {
          address: '0xcBD77E8E1E7F06B25baDe67142cdE82652Da7b57',
          blockCreated: 5345035
        }
      },
      l1StandardBridge: {
        '11155111': {
          address: '0xdDD29bb63B0839FB1cE0eE439Ff027738595D07B'
        }
      }
    },
    testnet: true
  },
  saigon: {
    id: 2021n,
    label: 'saigon',
    name: 'Saigon Testnet',
    nativeCurrency: {
      name: 'RON',
      symbol: 'RON',
      decimals: 18
    },
    providerURL: 'https://saigon-testnet.roninchain.com/rpc',
    blockExplorer: {
      name: 'Saigon Explorer',
      url: 'https://saigon-app.roninchain.com'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 18736871
      }
    },
    testnet: true
  },
  sapphire: {
    id: 23294n,
    label: 'sapphire',
    name: 'Oasis Sapphire',
    nativeCurrency: {
      name: 'Sapphire Rose',
      symbol: 'ROSE',
      decimals: 18
    },
    providerURL: 'https://sapphire.oasis.io',
    blockExplorer: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/mainnet/sapphire'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 734531
      }
    },
    testnet: false
  },
  sapphireTestnet: {
    id: 23295n,
    label: 'sapphireTestnet',
    name: 'Oasis Sapphire Testnet',
    nativeCurrency: {
      name: 'Sapphire Test Rose',
      symbol: 'TEST',
      decimals: 18
    },
    providerURL: 'https://testnet.sapphire.oasis.dev',
    blockExplorer: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/testnet/sapphire'
    },
    contracts: {},
    testnet: true
  },
  satoshiVM: {
    id: 3109n,
    label: 'satoshiVM',
    name: 'SatoshiVM Alpha Mainnet',
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    providerURL: 'https://alpha-rpc-node-http.svmscan.io',
    blockExplorer: {
      name: 'blockscout',
      url: 'https://svmscan.io',
      apiUrl: 'https://svmscan.io/api'
    },
    contracts: {},
    testnet: false
  },
  satoshiVMTestnet: {
    id: 3110n,
    label: 'satoshiVMTestnet',
    name: 'SatoshiVM Testnet',
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    providerURL: 'https://test-rpc-node-http.svmscan.io',
    blockExplorer: {
      name: 'blockscout',
      url: 'https://testnet.svmscan.io',
      apiUrl: 'https://testnet.svmscan.io/api'
    },
    contracts: {},
    testnet: true
  },
  scroll: {
    id: 534352n,
    label: 'scroll',
    name: 'Scroll',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.scroll.io',
    blockExplorer: {
      name: 'Scrollscan',
      url: 'https://scrollscan.com',
      apiUrl: 'https://api.scrollscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14
      }
    },
    testnet: false
  },
  scrollSepolia: {
    id: 534351n,
    label: 'scrollSepolia',
    name: 'Scroll Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia-rpc.scroll.io',
    blockExplorer: {
      name: 'Scrollscan',
      url: 'https://sepolia.scrollscan.com',
      apiUrl: 'https://api-sepolia.scrollscan.com/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 9473
      }
    },
    testnet: true
  },
  sei: {
    id: 1329n,
    label: 'sei',
    name: 'Sei Network',
    nativeCurrency: {
      name: 'Sei',
      symbol: 'SEI',
      decimals: 18
    },
    providerURL: 'https://evm-rpc.sei-apis.com/',
    blockExplorer: {
      name: 'Seitrace',
      url: 'https://seitrace.com',
      apiUrl: 'https://seitrace.com/pacific-1/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11'
      }
    },
    testnet: false
  },
  seiDevnet: {
    id: 713715n,
    label: 'seiDevnet',
    name: 'Sei Devnet',
    nativeCurrency: {
      name: 'Sei',
      symbol: 'SEI',
      decimals: 18
    },
    providerURL: 'https://evm-rpc-arctic-1.sei-apis.com',
    blockExplorer: {
      name: 'Seitrace',
      url: 'https://seitrace.com'
    },
    contracts: {},
    testnet: true
  },
  seiTestnet: {
    id: 1328n,
    label: 'seiTestnet',
    name: 'Sei Testnet',
    nativeCurrency: {
      name: 'Sei',
      symbol: 'SEI',
      decimals: 18
    },
    providerURL: 'https://evm-rpc-testnet.sei-apis.com',
    blockExplorer: {
      name: 'Seitrace',
      url: 'https://seitrace.com'
    },
    contracts: {},
    testnet: true
  },
  sepolia: {
    id: 11155111n,
    label: 'sepolia',
    name: 'Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.sepolia.org',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
      apiUrl: 'https://api-sepolia.etherscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 751532
      },
      ensRegistry: {
        address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
      },
      ensUniversalResolver: {
        address: '0xc8Af999e38273D658BE1b921b88A9Ddf005769cC',
        blockCreated: 5317080
      }
    },
    testnet: true
  },
  shapeSepolia: {
    id: 11011n,
    label: 'shapeSepolia',
    name: 'Shape Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.shape.network',
    blockExplorer: {
      name: 'blockscout',
      url: 'https://shape-sepolia-explorer.alchemy.com',
      apiUrl: 'https://shape-sepolia-explorer.alchemy.com/api/v2'
    },
    contracts: {},
    testnet: false
  },
  shardeumSphinx: {
    id: 8082n,
    label: 'shardeumSphinx',
    name: 'Shardeum Sphinx',
    nativeCurrency: {
      name: 'SHARDEUM',
      symbol: 'SHM',
      decimals: 18
    },
    providerURL: 'https://sphinx.shardeum.org',
    blockExplorer: {
      name: 'Shardeum Explorer',
      url: 'https://explorer-sphinx.shardeum.org'
    },
    contracts: {},
    testnet: true
  },
  shibarium: {
    id: 109n,
    label: 'shibarium',
    name: 'Shibarium',
    nativeCurrency: {
      name: 'Bone',
      symbol: 'BONE',
      decimals: 18
    },
    providerURL: 'https://rpc.shibrpc.com',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://shibariumscan.io'
    },
    contracts: {
      multicall3: {
        address: '0x864Bf681ADD6052395188A89101A1B37d3B4C961',
        blockCreated: 265900
      }
    },
    testnet: false
  },
  shibariumTestnet: {
    id: 157n,
    label: 'shibariumTestnet',
    name: 'Puppynet Shibarium',
    nativeCurrency: {
      decimals: 18,
      name: 'Bone',
      symbol: 'BONE'
    },
    providerURL: 'https://puppynet.shibrpc.com',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://puppyscan.shib.io',
      apiUrl: 'https://puppyscan.shib.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xA4029b74FBA366c926eDFA7Dd10B21C621170a4c',
        blockCreated: 3035769
      }
    },
    testnet: true
  },
  shimmer: {
    id: 148n,
    label: 'shimmer',
    name: 'Shimmer',
    nativeCurrency: {
      decimals: 18,
      name: 'Shimmer',
      symbol: 'SMR'
    },
    providerURL: 'https://json-rpc.evm.shimmer.network',
    blockExplorer: {
      name: 'Shimmer Network Explorer',
      url: 'https://explorer.evm.shimmer.network',
      apiUrl: 'https://explorer.evm.shimmer.network/api'
    },
    contracts: {},
    testnet: false
  },
  shimmerTestnet: {
    id: 1073n,
    label: 'shimmerTestnet',
    name: 'Shimmer Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Shimmer',
      symbol: 'SMR'
    },
    providerURL: 'https://json-rpc.evm.testnet.shimmer.network',
    blockExplorer: {
      name: 'Shimmer Network Explorer',
      url: 'https://explorer.evm.testnet.shimmer.network',
      apiUrl: 'https://explorer.evm.testnet.shimmer.network/api'
    },
    contracts: {},
    testnet: true
  },
  skaleBlockBrawlers: {
    id: 391845894n,
    label: 'skaleBlockBrawlers',
    name: 'SKALE | Block Brawlers',
    nativeCurrency: {
      name: 'BRAWL',
      symbol: 'BRAWL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/frayed-decent-antares',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://frayed-decent-antares.explorer.mainnet.skalenodes.com'
    },
    contracts: {},
    testnet: false
  },
  skaleCalypso: {
    id: 1564830818n,
    label: 'skaleCalypso',
    name: 'SKALE | Calypso NFT Hub',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 3107626
      }
    },
    testnet: false
  },
  skaleCalypsoTestnet: {
    id: 974399131n,
    label: 'skaleCalypsoTestnet',
    name: 'SKALE Calypso Testnet',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://testnet.skalenodes.com/v1/giant-half-dual-testnet',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://giant-half-dual-testnet.explorer.testnet.skalenodes.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 103220
      }
    },
    testnet: true
  },
  skaleCryptoBlades: {
    id: 1026062157n,
    label: 'skaleCryptoBlades',
    name: 'SKALE | CryptoBlades',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/affectionate-immediate-pollux',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://affectionate-immediate-pollux.explorer.mainnet.skalenodes.com'
    },
    contracts: {},
    testnet: false
  },
  skaleCryptoColosseum: {
    id: 1032942172n,
    label: 'skaleCryptoColosseum',
    name: 'SKALE | Crypto Colosseum',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/haunting-devoted-deneb',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://haunting-devoted-deneb.explorer.mainnet.skalenodes.com'
    },
    contracts: {},
    testnet: false
  },
  skaleEuropa: {
    id: 2046399126n,
    label: 'skaleEuropa',
    name: 'SKALE | Europa Liquidity Hub',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/elated-tan-skat',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 3113495
      }
    },
    testnet: false
  },
  skaleEuropaTestnet: {
    id: 1444673419n,
    label: 'skaleEuropaTestnet',
    name: 'SKALE Europa Testnet',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://testnet.skalenodes.com/v1/juicy-low-small-testnet',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://juicy-low-small-testnet.explorer.testnet.skalenodes.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 110858
      }
    },
    testnet: true
  },
  skaleExorde: {
    id: 2139927552n,
    label: 'skaleExorde',
    name: 'SKALE | Exorde',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/light-vast-diphda',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://light-vast-diphda.explorer.mainnet.skalenodes.com'
    },
    contracts: {},
    testnet: false
  },
  skaleHumanProtocol: {
    id: 1273227453n,
    label: 'skaleHumanProtocol',
    name: 'SKALE | Human Protocol',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/wan-red-ain',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://wan-red-ain.explorer.mainnet.skalenodes.com'
    },
    contracts: {},
    testnet: false
  },
  skaleNebula: {
    id: 1482601649n,
    label: 'skaleNebula',
    name: 'SKALE | Nebula Gaming Hub',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/green-giddy-denebola',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://green-giddy-denebola.explorer.mainnet.skalenodes.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 2372986
      }
    },
    testnet: false
  },
  skaleNebulaTestnet: {
    id: 37084624n,
    label: 'skaleNebulaTestnet',
    name: 'SKALE Nebula Testnet',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 105141
      }
    },
    testnet: true
  },
  skaleRazor: {
    id: 278611351n,
    label: 'skaleRazor',
    name: 'SKALE | Razor Network',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/turbulent-unique-scheat',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com'
    },
    contracts: {},
    testnet: false
  },
  skaleTitan: {
    id: 1350216234n,
    label: 'skaleTitan',
    name: 'SKALE | Titan Community Hub',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://mainnet.skalenodes.com/v1/parallel-stormy-spica',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://parallel-stormy-spica.explorer.mainnet.skalenodes.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 2076458
      }
    },
    testnet: false
  },
  skaleTitanTestnet: {
    id: 1020352220n,
    label: 'skaleTitanTestnet',
    name: 'SKALE Titan Hub',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    providerURL: 'https://testnet.skalenodes.com/v1/aware-fake-trim-testnet',
    blockExplorer: {
      name: 'SKALE Explorer',
      url: 'https://aware-fake-trim-testnet.explorer.testnet.skalenodes.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 104072
      }
    },
    testnet: true
  },
  sketchpad: {
    id: 984123n,
    label: 'sketchpad',
    name: 'Forma Sketchpad',
    nativeCurrency: {
      symbol: 'TIA',
      name: 'TIA',
      decimals: 18
    },
    providerURL: 'https://rpc.sketchpad-1.forma.art',
    blockExplorer: {
      name: 'Sketchpad Explorer',
      url: 'https://explorer.sketchpad-1.forma.art'
    },
    contracts: {},
    testnet: true
  },
  soneiumMinato: {
    id: 1946n,
    label: 'soneiumMinato',
    name: 'Soneium Minato',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.minato.soneium.org',
    blockExplorer: {
      name: 'Minato Explorer',
      url: 'https://explorer-testnet.soneium.org',
      apiUrl: 'https://explorer-testnet.soneium.org/api/'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 1
      }
    },
    testnet: true
  },
  songbird: {
    id: 19n,
    label: 'songbird',
    name: 'Songbird Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'songbird',
      symbol: 'SGB'
    },
    providerURL: 'https://songbird-api.flare.network/ext/C/rpc',
    blockExplorer: {
      name: 'Songbird Explorer',
      url: 'https://songbird-explorer.flare.network',
      apiUrl: 'https://songbird-explorer.flare.network/api'
    },
    contracts: {},
    testnet: false
  },
  songbirdTestnet: {
    id: 16n,
    label: 'songbirdTestnet',
    name: 'Coston',
    nativeCurrency: {
      decimals: 18,
      name: 'costonflare',
      symbol: 'CFLR'
    },
    providerURL: 'https://coston-api.flare.network/ext/C/rpc',
    blockExplorer: {
      name: 'Coston Explorer',
      url: 'https://coston-explorer.flare.network',
      apiUrl: 'https://coston-explorer.flare.network/api'
    },
    contracts: {},
    testnet: true
  },
  sophonTestnet: {
    id: 531050104n,
    label: 'sophonTestnet',
    name: 'Sophon Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Sophon',
      symbol: 'SOPH'
    },
    providerURL: 'https://rpc.testnet.sophon.xyz',
    blockExplorer: {
      name: 'Sophon Block Explorer',
      url: 'https://explorer.testnet.sophon.xyz'
    },
    contracts: {
      multicall3: {
        address: '0x83c04d112adedA2C6D9037bb6ecb42E7f0b108Af',
        blockCreated: 15642
      }
    },
    testnet: true
  },
  spicy: {
    id: 88882n,
    label: 'spicy',
    name: 'Chiliz Spicy Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'CHZ',
      symbol: 'CHZ'
    },
    providerURL: 'https://spicy-rpc.chiliz.com',
    blockExplorer: {
      name: 'Chiliz Explorer',
      url: 'http://spicy-explorer.chiliz.com',
      apiUrl: 'http://spicy-explorer.chiliz.com/api'
    },
    contracts: {},
    testnet: true
  },
  storyTestnet: {
    id: 1513n,
    label: 'storyTestnet',
    name: 'Story Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'IP',
      symbol: 'IP'
    },
    providerURL: 'https://testnet.storyrpc.io',
    blockExplorer: {
      name: 'Story Testnet Explorer',
      url: 'https://testnet.storyscan.xyz'
    },
    contracts: {},
    testnet: true
  },
  stratis: {
    id: 105105n,
    label: 'stratis',
    name: 'Stratis Mainnet',
    nativeCurrency: {
      name: 'Stratis',
      symbol: 'STRAX',
      decimals: 18
    },
    providerURL: 'https://rpc.stratisevm.com',
    blockExplorer: {
      name: 'Stratis Explorer',
      url: 'https://explorer.stratisevm.com'
    },
    contracts: {},
    testnet: false
  },
  syscoin: {
    id: 57n,
    label: 'syscoin',
    name: 'Syscoin Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Syscoin',
      symbol: 'SYS'
    },
    providerURL: 'https://rpc.syscoin.org',
    blockExplorer: {
      name: 'SyscoinExplorer',
      url: 'https://explorer.syscoin.org',
      apiUrl: 'https://explorer.syscoin.org/api'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 287139
      }
    },
    testnet: false
  },
  syscoinTestnet: {
    id: 5700n,
    label: 'syscoinTestnet',
    name: 'Syscoin Tanenbaum Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Syscoin',
      symbol: 'SYS'
    },
    providerURL: 'https://rpc.tanenbaum.io',
    blockExplorer: {
      name: 'SyscoinTestnetExplorer',
      url: 'https://tanenbaum.io'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 271288
      }
    },
    testnet: false
  },
  taiko: {
    id: 167000n,
    label: 'taiko',
    name: 'Taiko Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.mainnet.taiko.xyz',
    blockExplorer: {
      name: 'Taikoscan',
      url: 'https://taikoscan.io',
      apiUrl: 'https://api.taikoscan.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xcb2436774C3e191c85056d248EF4260ce5f27A9D'
      }
    },
    testnet: false
  },
  taikoHekla: {
    id: 167009n,
    label: 'taikoHekla',
    name: 'Taiko Hekla L2',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.hekla.taiko.xyz',
    blockExplorer: {
      name: 'Taikoscan',
      url: 'https://hekla.taikoscan.network'
    },
    contracts: {},
    testnet: true
  },
  taikoJolnir: {
    id: 167007n,
    label: 'taikoJolnir',
    name: 'Taiko Jolnir (Alpha-5 Testnet)',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.jolnir.taiko.xyz',
    blockExplorer: {
      name: 'blockscout',
      url: 'https://explorer.jolnir.taiko.xyz'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 732706
      }
    },
    testnet: true
  },
  taikoKatla: {
    id: 167008n,
    label: 'taikoKatla',
    name: 'Taiko Katla (Alpha-6 Testnet)',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.katla.taiko.xyz',
    blockExplorer: {
      name: 'blockscout',
      url: 'https://explorer.katla.taiko.xyz'
    },
    contracts: {},
    testnet: false
  },
  taikoTestnetSepolia: {
    id: 167005n,
    label: 'taikoTestnetSepolia',
    name: 'Taiko (Alpha-3 Testnet)',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://rpc.test.taiko.xyz',
    blockExplorer: {
      name: 'blockscout',
      url: 'https://explorer.test.taiko.xyz'
    },
    contracts: {},
    testnet: false
  },
  taraxa: {
    id: 841n,
    label: 'taraxa',
    name: 'Taraxa Mainnet',
    nativeCurrency: {
      name: 'Tara',
      symbol: 'TARA',
      decimals: 18
    },
    providerURL: 'https://rpc.mainnet.taraxa.io',
    blockExplorer: {
      name: 'Taraxa Explorer',
      url: 'https://explorer.mainnet.taraxa.io'
    },
    contracts: {},
    testnet: false
  },
  taraxaTestnet: {
    id: 842n,
    label: 'taraxaTestnet',
    name: 'Taraxa Testnet',
    nativeCurrency: {
      name: 'Tara',
      symbol: 'TARA',
      decimals: 18
    },
    providerURL: 'https://rpc.testnet.taraxa.io',
    blockExplorer: {
      name: 'Taraxa Explorer',
      url: 'https://explorer.testnet.taraxa.io'
    },
    contracts: {},
    testnet: true
  },
  telcoinTestnet: {
    id: 2017n,
    label: 'telcoinTestnet',
    name: 'Telcoin Adiri Testnet',
    nativeCurrency: {
      name: 'Telcoin',
      symbol: 'TEL',
      decimals: 18
    },
    providerURL: 'https://rpc.telcoin.network',
    blockExplorer: {
      name: 'telscan',
      url: 'https://telscan.io'
    },
    contracts: {},
    testnet: true
  },
  telos: {
    id: 40n,
    label: 'telos',
    name: 'Telos',
    nativeCurrency: {
      decimals: 18,
      name: 'Telos',
      symbol: 'TLOS'
    },
    providerURL: 'https://mainnet.telos.net/evm',
    blockExplorer: {
      name: 'Teloscan',
      url: 'https://www.teloscan.io/'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 246530709
      }
    },
    testnet: false
  },
  telosTestnet: {
    id: 41n,
    label: 'telosTestnet',
    name: 'Telos',
    nativeCurrency: {
      decimals: 18,
      name: 'Telos',
      symbol: 'TLOS'
    },
    providerURL: 'https://testnet.telos.net/evm',
    blockExplorer: {
      name: 'Teloscan (testnet)',
      url: 'https://testnet.teloscan.io/'
    },
    contracts: {},
    testnet: true
  },
  tenet: {
    id: 1559n,
    label: 'tenet',
    name: 'Tenet',
    nativeCurrency: {
      name: 'TENET',
      symbol: 'TENET',
      decimals: 18
    },
    providerURL: 'https://rpc.tenet.org',
    blockExplorer: {
      name: 'TenetScan Mainnet',
      url: 'https://tenetscan.io',
      apiUrl: 'https://tenetscan.io/api'
    },
    contracts: {},
    testnet: false
  },
  thaiChain: {
    id: 7n,
    label: 'thaiChain',
    name: 'ThaiChain',
    nativeCurrency: {
      name: 'TCH',
      symbol: 'TCH',
      decimals: 18
    },
    providerURL: 'https://rpc.thaichain.org',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://exp.thaichain.org',
      apiUrl: 'https://exp.thaichain.org/api'
    },
    contracts: {
      multicall3: {
        address: '0x0DaD6130e832c21719C5CE3bae93454E16A84826',
        blockCreated: 4806386
      }
    },
    testnet: false
  },
  thunderTestnet: {
    id: 997n,
    label: 'thunderTestnet',
    name: '5ireChain Thunder Testnet',
    nativeCurrency: {
      name: '5ire Token',
      symbol: '5IRE',
      decimals: 18
    },
    providerURL: 'https://rpc-testnet.5ire.network',
    blockExplorer: {
      name: '5ireChain Explorer',
      url: 'https://explorer.5ire.network'
    },
    contracts: {},
    testnet: true
  },
  tron: {
    id: 728126428n,
    label: 'tron',
    name: 'Tron',
    nativeCurrency: {
      name: 'TRON',
      symbol: 'TRX',
      decimals: 6
    },
    providerURL: 'https://api.trongrid.io/jsonrpc',
    blockExplorer: {
      name: 'Tronscan',
      url: 'https://tronscan.org',
      apiUrl: 'https://apilist.tronscanapi.com/api'
    },
    contracts: {},
    testnet: false
  },
  unreal: {
    id: 18233n,
    label: 'unreal',
    name: 'Unreal',
    nativeCurrency: {
      name: 'reETH',
      decimals: 18,
      symbol: 'reETH'
    },
    providerURL: 'https://rpc.unreal-orbit.gelato.digital',
    blockExplorer: {
      name: 'Unreal Explorer',
      url: 'https://unreal.blockscout.com',
      apiUrl: 'https://unreal.blockscout.com/api/v2'
    },
    contracts: {
      multicall3: {
        address: '0x8b6B0e60D8CD84898Ea8b981065A12F876eA5677',
        blockCreated: 1745
      }
    },
    testnet: true
  },
  vechain: {
    id: 100009n,
    label: 'vechain',
    name: 'Vechain',
    nativeCurrency: {
      name: 'VeChain',
      symbol: 'VET',
      decimals: 18
    },
    providerURL: 'https://mainnet.vechain.org',
    blockExplorer: {
      name: 'Vechain Explorer',
      url: 'https://explore.vechain.org'
    },
    contracts: {},
    testnet: false
  },
  wanchain: {
    id: 888n,
    label: 'wanchain',
    name: 'Wanchain',
    nativeCurrency: {
      name: 'WANCHAIN',
      symbol: 'WAN',
      decimals: 18
    },
    providerURL: 'https://gwan-ssl.wandevs.org:56891',
    blockExplorer: {
      name: 'WanScan',
      url: 'https://wanscan.org'
    },
    contracts: {
      multicall3: {
        address: '0xcDF6A1566e78EB4594c86Fe73Fcdc82429e97fbB',
        blockCreated: 25312390
      }
    },
    testnet: false
  },
  wanchainTestnet: {
    id: 999n,
    label: 'wanchainTestnet',
    name: 'Wanchain Testnet',
    nativeCurrency: {
      name: 'WANCHAIN',
      symbol: 'WANt',
      decimals: 18
    },
    providerURL: 'https://gwan-ssl.wandevs.org:46891',
    blockExplorer: {
      name: 'WanScanTest',
      url: 'https://wanscan.org'
    },
    contracts: {
      multicall3: {
        address: '0x11c89bF4496c39FB80535Ffb4c92715839CC5324',
        blockCreated: 24743448
      }
    },
    testnet: true
  },
  wemix: {
    id: 1111n,
    label: 'wemix',
    name: 'WEMIX',
    nativeCurrency: {
      name: 'WEMIX',
      symbol: 'WEMIX',
      decimals: 18
    },
    providerURL: 'https://api.wemix.com',
    blockExplorer: {
      name: 'wemixExplorer',
      url: 'https://explorer.wemix.com'
    },
    contracts: {},
    testnet: false
  },
  wemixTestnet: {
    id: 1112n,
    label: 'wemixTestnet',
    name: 'WEMIX Testnet',
    nativeCurrency: {
      name: 'WEMIX',
      symbol: 'tWEMIX',
      decimals: 18
    },
    providerURL: 'https://api.test.wemix.com',
    blockExplorer: {
      name: 'wemixExplorer',
      url: 'https://testnet.wemixscan.com',
      apiUrl: 'https://testnet.wemixscan.com/api'
    },
    contracts: {},
    testnet: true
  },
  x1Testnet: {
    id: 195n,
    label: 'x1Testnet',
    name: 'X1 Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'OKB',
      symbol: 'OKB'
    },
    providerURL: 'https://xlayertestrpc.okx.com',
    blockExplorer: {
      name: 'OKLink',
      url: 'https://www.oklink.com/xlayer-test'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 624344
      }
    },
    testnet: true
  },
  xLayer: {
    id: 196n,
    label: 'xLayer',
    name: 'X Layer Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'OKB',
      symbol: 'OKB'
    },
    providerURL: 'https://rpc.xlayer.tech',
    blockExplorer: {
      name: 'OKLink',
      url: 'https://www.oklink.com/xlayer'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 47416
      }
    },
    testnet: false
  },
  xLayerTestnet: {
    id: 195n,
    label: 'xLayerTestnet',
    name: 'X1 Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'OKB',
      symbol: 'OKB'
    },
    providerURL: 'https://xlayertestrpc.okx.com',
    blockExplorer: {
      name: 'OKLink',
      url: 'https://www.oklink.com/xlayer-test'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 624344
      }
    },
    testnet: true
  },
  xai: {
    id: 660279n,
    label: 'xai',
    name: 'Xai Mainnet',
    nativeCurrency: {
      name: 'Xai',
      symbol: 'XAI',
      decimals: 18
    },
    providerURL: 'https://xai-chain.net/rpc',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://explorer.xai-chain.net'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 222549
      }
    },
    testnet: false
  },
  xaiTestnet: {
    id: 37714555429n,
    label: 'xaiTestnet',
    name: 'Xai Testnet',
    nativeCurrency: {
      name: 'sXai',
      symbol: 'sXAI',
      decimals: 18
    },
    providerURL: 'https://testnet-v2.xai-chain.net/rpc',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://testnet-explorer-v2.xai-chain.net'
    },
    contracts: {},
    testnet: true
  },
  xdc: {
    id: 50n,
    label: 'xdc',
    name: 'XinFin Network',
    nativeCurrency: {
      decimals: 18,
      name: 'XDC',
      symbol: 'XDC'
    },
    providerURL: 'https://rpc.xinfin.network',
    blockExplorer: {
      name: 'Blocksscan',
      url: 'https://xdc.blocksscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 71542788
      }
    },
    testnet: false
  },
  xdcTestnet: {
    id: 51n,
    label: 'xdcTestnet',
    name: 'Apothem Network',
    nativeCurrency: {
      decimals: 18,
      name: 'TXDC',
      symbol: 'TXDC'
    },
    providerURL: 'https://erpc.apothem.network',
    blockExplorer: {
      name: 'Blocksscan',
      url: 'https://apothem.blocksscan.io'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 59765389
      }
    },
    testnet: false
  },
  xrSepolia: {
    id: 2730n,
    label: 'xrSepolia',
    name: 'XR Sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'tXR',
      symbol: 'tXR'
    },
    providerURL: 'https://xr-sepolia-testnet.rpc.caldera.xyz/http',
    blockExplorer: {
      name: 'Blockscout',
      url: 'https://xr-sepolia-testnet.explorer.caldera.xyz'
    },
    contracts: {},
    testnet: true
  },
  yooldoVerse: {
    id: 50005n,
    label: 'yooldoVerse',
    name: 'Yooldo Verse',
    nativeCurrency: {
      name: 'OAS',
      symbol: 'OAS',
      decimals: 18
    },
    providerURL: 'https://rpc.yooldo-verse.xyz',
    blockExplorer: {
      name: 'Yooldo Verse Explorer',
      url: 'https://explorer.yooldo-verse.xyz'
    },
    contracts: {},
    testnet: false
  },
  yooldoVerseTestnet: {
    id: 50006n,
    label: 'yooldoVerseTestnet',
    name: 'Yooldo Verse Testnet',
    nativeCurrency: {
      name: 'OAS',
      symbol: 'OAS',
      decimals: 18
    },
    providerURL: 'https://rpc.testnet.yooldo-verse.xyz',
    blockExplorer: {
      name: 'Yooldo Verse Testnet Explorer',
      url: 'https://explorer.testnet.yooldo-verse.xyz'
    },
    contracts: {},
    testnet: true
  },
  zetachain: {
    id: 7000n,
    label: 'zetachain',
    name: 'ZetaChain',
    nativeCurrency: {
      decimals: 18,
      name: 'Zeta',
      symbol: 'ZETA'
    },
    providerURL: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
    blockExplorer: {
      name: 'ZetaScan',
      url: 'https://explorer.zetachain.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 1632781
      }
    },
    testnet: false
  },
  zetachainAthensTestnet: {
    id: 7001n,
    label: 'zetachainAthensTestnet',
    name: 'ZetaChain Athens Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Zeta',
      symbol: 'aZETA'
    },
    providerURL: 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public',
    blockExplorer: {
      name: 'ZetaScan',
      url: 'https://athens.explorer.zetachain.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 2715217
      }
    },
    testnet: true
  },
  zhejiang: {
    id: 1337803n,
    label: 'zhejiang',
    name: 'Zhejiang',
    nativeCurrency: {
      name: 'Zhejiang Ether',
      symbol: 'ZhejETH',
      decimals: 18
    },
    providerURL: 'https://rpc.zhejiang.ethpandaops.io',
    blockExplorer: {
      name: 'Beaconchain',
      url: 'https://zhejiang.beaconcha.in'
    },
    contracts: {},
    testnet: true
  },
  zilliqa: {
    id: 32769n,
    label: 'zilliqa',
    name: 'Zilliqa',
    nativeCurrency: {
      name: 'Zilliqa',
      symbol: 'ZIL',
      decimals: 18
    },
    providerURL: 'https://api.zilliqa.com',
    blockExplorer: {
      name: 'Ethernal',
      url: 'https://evmx.zilliqa.com'
    },
    contracts: {},
    testnet: false
  },
  zilliqaTestnet: {
    id: 33101n,
    label: 'zilliqaTestnet',
    name: 'Zilliqa Testnet',
    nativeCurrency: {
      name: 'Zilliqa',
      symbol: 'ZIL',
      decimals: 18
    },
    providerURL: 'https://dev-api.zilliqa.com',
    blockExplorer: {
      name: 'Ethernal',
      url: 'https://evmx.testnet.zilliqa.com'
    },
    contracts: {},
    testnet: true
  },
  zircuitTestnet: {
    id: 48899n,
    label: 'zircuitTestnet',
    name: 'Zircuit Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://zircuit1.p2pify.com',
    blockExplorer: {
      name: 'Zircuit Explorer',
      url: 'https://explorer.zircuit.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 6040287
      }
    },
    testnet: false
  },
  zkFair: {
    id: 42766n,
    label: 'zkFair',
    name: 'ZKFair Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'USD Coin',
      symbol: 'USDC'
    },
    providerURL: 'https://rpc.zkfair.io',
    blockExplorer: {
      name: 'zkFair Explorer',
      url: 'https://scan.zkfair.io',
      apiUrl: 'https://scan.zkfair.io/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 6090959
      }
    },
    testnet: false
  },
  zkFairTestnet: {
    id: 43851n,
    label: 'zkFairTestnet',
    name: 'ZKFair Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'USD Coin',
      symbol: 'USDC'
    },
    providerURL: 'https://testnet-rpc.zkfair.io',
    blockExplorer: {
      name: 'zkFair Explorer',
      url: 'https://testnet-scan.zkfair.io'
    },
    contracts: {},
    testnet: true
  },
  zkLinkNova: {
    id: 810180n,
    label: 'zkLinkNova',
    name: 'zkLink Nova',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.zklink.io',
    blockExplorer: {
      name: 'zkLink Nova Block Explorer',
      url: 'https://explorer.zklink.io'
    },
    contracts: {},
    testnet: false
  },
  zkLinkNovaSepoliaTestnet: {
    id: 810181n,
    label: 'zkLinkNovaSepoliaTestnet',
    name: 'zkLink Nova Sepolia Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    providerURL: 'https://sepolia.rpc.zklink.io',
    blockExplorer: {
      name: 'zkLink Nova Block Explorer',
      url: 'https://sepolia.explorer.zklink.io'
    },
    contracts: {},
    testnet: false
  },
  zkSync: {
    id: 324n,
    label: 'zkSync',
    name: 'ZKsync Era',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://mainnet.era.zksync.io',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://era.zksync.network/',
      apiUrl: 'https://api-era.zksync.network/api'
    },
    contracts: {
      multicall3: {
        address: '0xF9cda624FBC7e059355ce98a31693d299FACd963'
      }
    },
    testnet: false
  },
  zkSyncInMemoryNode: {
    id: 260n,
    label: 'zkSyncInMemoryNode',
    name: 'ZKsync InMemory Node',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'http://localhost:8011',
    blockExplorer: {},
    contracts: {},
    testnet: true
  },
  zkSyncLocalNode: {
    id: 270n,
    label: 'zkSyncLocalNode',
    name: 'ZKsync CLI Local Node',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'http://localhost:3050',
    blockExplorer: {},
    contracts: {},
    testnet: true
  },
  zkSyncSepoliaTestnet: {
    id: 300n,
    label: 'zkSyncSepoliaTestnet',
    name: 'ZKsync Sepolia Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.era.zksync.dev',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://sepolia-era.zksync.network/',
      apiUrl: 'https://api-sepolia-era.zksync.network/api'
    },
    contracts: {
      multicall3: {
        address: '0xF9cda624FBC7e059355ce98a31693d299FACd963'
      }
    },
    testnet: true
  },
  zksync: {
    id: 324n,
    label: 'zksync',
    name: 'ZKsync Era',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://mainnet.era.zksync.io',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://era.zksync.network/',
      apiUrl: 'https://api-era.zksync.network/api'
    },
    contracts: {
      multicall3: {
        address: '0xF9cda624FBC7e059355ce98a31693d299FACd963'
      }
    },
    testnet: false
  },
  zksyncInMemoryNode: {
    id: 260n,
    label: 'zksyncInMemoryNode',
    name: 'ZKsync InMemory Node',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'http://localhost:8011',
    blockExplorer: {},
    contracts: {},
    testnet: true
  },
  zksyncLocalNode: {
    id: 270n,
    label: 'zksyncLocalNode',
    name: 'ZKsync CLI Local Node',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'http://localhost:3050',
    blockExplorer: {},
    contracts: {},
    testnet: true
  },
  zksyncSepoliaTestnet: {
    id: 300n,
    label: 'zksyncSepoliaTestnet',
    name: 'ZKsync Sepolia Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'https://sepolia.era.zksync.dev',
    blockExplorer: {
      name: 'Etherscan',
      url: 'https://sepolia-era.zksync.network/',
      apiUrl: 'https://api-sepolia-era.zksync.network/api'
    },
    contracts: {
      multicall3: {
        address: '0xF9cda624FBC7e059355ce98a31693d299FACd963'
      }
    },
    testnet: true
  },
  zora: {
    id: 7777777n,
    label: 'zora',
    name: 'Zora',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'https://rpc.zora.energy',
    blockExplorer: {
      name: 'Explorer',
      url: 'https://explorer.zora.energy',
      apiUrl: 'https://explorer.zora.energy/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '1': {
          address: '0x9E6204F750cD866b299594e2aC9eA824E2e5f95c'
        }
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 5882
      },
      portal: {
        '1': {
          address: '0x1a0ad011913A150f69f6A19DF447A0CfD9551054'
        }
      },
      l1StandardBridge: {
        '1': {
          address: '0x3e2Ea9B92B7E48A52296fD261dc26fd995284631'
        }
      }
    },
    testnet: false
  },
  zoraSepolia: {
    id: 999999999n,
    label: 'zoraSepolia',
    name: 'Zora Sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Zora Sepolia',
      symbol: 'ETH'
    },
    providerURL: 'https://sepolia.rpc.zora.energy',
    blockExplorer: {
      name: 'Zora Sepolia Explorer',
      url: 'https://sepolia.explorer.zora.energy/',
      apiUrl: 'https://sepolia.explorer.zora.energy/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      l2OutputOracle: {
        '11155111': {
          address: '0x2615B481Bd3E5A1C0C7Ca3Da1bdc663E8615Ade9'
        }
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 83160
      },
      portal: {
        '11155111': {
          address: '0xeffE2C6cA9Ab797D418f0D91eA60807713f3536f'
        }
      },
      l1StandardBridge: {
        '11155111': {
          address: '0x5376f1D543dcbB5BD416c56C189e4cB7399fCcCB'
        }
      }
    },
    testnet: true
  },
  zoraTestnet: {
    id: 999n,
    label: 'zoraTestnet',
    name: 'Zora Goerli Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Zora Goerli',
      symbol: 'ETH'
    },
    providerURL: 'https://testnet.rpc.zora.energy',
    blockExplorer: {
      name: 'Explorer',
      url: 'https://testnet.explorer.zora.energy',
      apiUrl: 'https://testnet.explorer.zora.energy/api'
    },
    contracts: {
      gasPriceOracle: {
        address: '0x420000000000000000000000000000000000000F'
      },
      l1Block: {
        address: '0x4200000000000000000000000000000000000015'
      },
      l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007'
      },
      l2Erc721Bridge: {
        address: '0x4200000000000000000000000000000000000014'
      },
      l2StandardBridge: {
        address: '0x4200000000000000000000000000000000000010'
      },
      l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016'
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 189123
      },
      portal: {
        '5': {
          address: '0xDb9F51790365e7dc196e7D072728df39Be958ACe'
        }
      }
    },
    testnet: true
  }
}