export const networks = {
  abstractTestnet: {
    id: 11124,
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
    contracts: undefined
  },
  acala: {
    id: 787,
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
    contracts: undefined
  },
  ancient8: {
    id: 888888888,
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
    }
  },
  ancient8Sepolia: {
    id: 28122024,
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
    }
  },
  anvil: {
    id: 31337,
    label: 'anvil',
    name: 'Anvil',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'http://127.0.0.1:8545',
    blockExplorer: {},
    contracts: undefined
  },
  apexTestnet: {
    id: 3993,
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
    }
  },
  arbitrum: {
    id: 42161,
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
    }
  },
  arbitrumGoerli: {
    id: 421613,
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
    }
  },
  arbitrumNova: {
    id: 42170,
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
    }
  },
  arbitrumSepolia: {
    id: 421614,
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
    }
  },
  areonNetwork: {
    id: 463,
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
    contracts: undefined
  },
  areonNetworkTestnet: {
    id: 462,
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
    contracts: undefined
  },
  artelaTestnet: {
    id: 11822,
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
    }
  },
  assetChainTestnet: {
    id: 42421,
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
    }
  },
  astar: {
    id: 592,
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
    }
  },
  astarZkEVM: {
    id: 3776,
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
    }
  },
  astarZkyoto: {
    id: 6038361,
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
    }
  },
  atletaOlympia: {
    id: 2340,
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
    }
  },
  aurora: {
    id: 1313161554,
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
    }
  },
  auroraTestnet: {
    id: 1313161555,
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
    contracts: undefined
  },
  auroria: {
    id: 205205,
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
    contracts: undefined
  },
  avalanche: {
    id: 43114,
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
    }
  },
  avalancheFuji: {
    id: 43113,
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
    }
  },
  b3: {
    id: 8333,
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
    contracts: undefined
  },
  b3Sepolia: {
    id: 1993,
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
    contracts: undefined
  },
  bahamut: {
    id: 5165,
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
    contracts: undefined
  },
  base: {
    id: 8453,
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
    }
  },
  baseGoerli: {
    id: 84531,
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
    }
  },
  baseSepolia: {
    id: 84532,
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
    }
  },
  beam: {
    id: 4337,
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
    }
  },
  beamTestnet: {
    id: 13337,
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
    }
  },
  bearNetworkChainMainnet: {
    id: 641230,
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
    contracts: undefined
  },
  bearNetworkChainTestnet: {
    id: 751230,
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
    contracts: undefined
  },
  berachainTestnet: {
    id: 80085,
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
    contracts: undefined
  },
  berachainTestnetbArtio: {
    id: 80084,
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
    }
  },
  bevmMainnet: {
    id: 11501,
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
    contracts: undefined
  },
  bitTorrent: {
    id: 199,
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
    }
  },
  bitTorrentTestnet: {
    id: 1028,
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
    contracts: undefined
  },
  bitkub: {
    id: 96,
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
    contracts: undefined
  },
  bitkubTestnet: {
    id: 25925,
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
    contracts: undefined
  },
  blast: {
    id: 81457,
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
    }
  },
  blastSepolia: {
    id: 168587773,
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
    }
  },
  bob: {
    id: 60808,
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
    }
  },
  bobSepolia: {
    id: 808813,
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
    }
  },
  boba: {
    id: 288,
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
    }
  },
  bobaSepolia: {
    id: 28882,
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
    contracts: undefined
  },
  botanixTestnet: {
    id: 3636,
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
    contracts: undefined
  },
  bronos: {
    id: 1039,
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
    contracts: undefined
  },
  bronosTestnet: {
    id: 1038,
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
    contracts: undefined
  },
  bsc: {
    id: 56,
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
    }
  },
  bscGreenfield: {
    id: 1017,
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
    contracts: undefined
  },
  bscTestnet: {
    id: 97,
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
    }
  },
  btr: {
    id: 200901,
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
    contracts: undefined
  },
  btrTestnet: {
    id: 200810,
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
    contracts: undefined
  },
  bxn: {
    id: 4999,
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
    contracts: undefined
  },
  bxnTestnet: {
    id: 4777,
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
    contracts: undefined
  },
  canto: {
    id: 7700,
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
    }
  },
  celo: {
    id: 42220,
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
    }
  },
  celoAlfajores: {
    id: 44787,
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
    }
  },
  chiliz: {
    id: 88888,
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
    contracts: undefined
  },
  chips: {
    id: 2882,
    label: 'chips',
    name: 'Chips Network',
    nativeCurrency: {
      decimals: 18,
      name: 'IOTA',
      symbol: 'IOTA'
    },
    providerURL: 'https://node.chips.ooo/wasp/api/v1/chains/iota1pp3d3mnap3ufmgqnjsnw344sqmf5svjh26y2khnmc89sv6788y3r207a8fn/evm',
    blockExplorer: {},
    contracts: undefined
  },
  classic: {
    id: 61,
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
    contracts: undefined
  },
  confluxESpace: {
    id: 1030,
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
    }
  },
  confluxESpaceTestnet: {
    id: 71,
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
    }
  },
  coreDao: {
    id: 1116,
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
    }
  },
  crab: {
    id: 44,
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
    }
  },
  cronos: {
    id: 25,
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
    }
  },
  cronosTestnet: {
    id: 338,
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
    }
  },
  cronoszkEVM: {
    id: 388,
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
    contracts: undefined
  },
  cronoszkEVMTestnet: {
    id: 282,
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
    contracts: undefined
  },
  crossbell: {
    id: 3737,
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
    }
  },
  curtis: {
    id: 33111,
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
    contracts: undefined
  },
  cyber: {
    id: 7560,
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
    }
  },
  cyberTestnet: {
    id: 111557560,
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
    }
  },
  darwinia: {
    id: 46,
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
    }
  },
  dchain: {
    id: 2716446429837000,
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
    }
  },
  dchainTestnet: {
    id: 2713017997578000,
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
    }
  },
  defichainEvm: {
    id: 1130,
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
    }
  },
  defichainEvmTestnet: {
    id: 1131,
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
    }
  },
  degen: {
    id: 666666666,
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
    contracts: undefined
  },
  dfk: {
    id: 53935,
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
    }
  },
  dodochainTestnet: {
    id: 53457,
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
    contracts: undefined
  },
  dogechain: {
    id: 2000,
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
    }
  },
  dreyerxMainnet: {
    id: 23451,
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
    contracts: undefined
  },
  dreyerxTestnet: {
    id: 23452,
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
    contracts: undefined
  },
  edgeless: {
    id: 2026,
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
    contracts: undefined
  },
  edgelessTestnet: {
    id: 202,
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
    contracts: undefined
  },
  edgeware: {
    id: 2021,
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
    }
  },
  edgewareTestnet: {
    id: 2022,
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
    contracts: undefined
  },
  ekta: {
    id: 1994,
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
    contracts: undefined
  },
  ektaTestnet: {
    id: 1004,
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
    contracts: undefined
  },
  eon: {
    id: 7332,
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
    contracts: {}
  },
  eos: {
    id: 17777,
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
    }
  },
  eosTestnet: {
    id: 15557,
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
    }
  },
  etherlink: {
    id: 42793,
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
    }
  },
  etherlinkTestnet: {
    id: 128123,
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
    contracts: undefined
  },
  evmos: {
    id: 9001,
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
    contracts: undefined
  },
  evmosTestnet: {
    id: 9000,
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
    contracts: undefined
  },
  fantom: {
    id: 250,
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
    }
  },
  fantomSonicTestnet: {
    id: 64240,
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
    contracts: undefined
  },
  fantomTestnet: {
    id: 4002,
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
    }
  },
  fibo: {
    id: 12306,
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
    contracts: undefined
  },
  filecoin: {
    id: 314,
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
    }
  },
  filecoinCalibration: {
    id: 314159,
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
    contracts: undefined
  },
  filecoinHyperspace: {
    id: 3141,
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
    contracts: undefined
  },
  flare: {
    id: 14,
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
    contracts: undefined
  },
  flareTestnet: {
    id: 114,
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
    contracts: undefined
  },
  flowMainnet: {
    id: 747,
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
    contracts: undefined
  },
  flowPreviewnet: {
    id: 646,
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
    }
  },
  flowTestnet: {
    id: 545,
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
    }
  },
  fluence: {
    id: 9999999,
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
    contracts: undefined
  },
  fluenceStage: {
    id: 123420000220,
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
    contracts: undefined
  },
  fluenceTestnet: {
    id: 52164803,
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
    contracts: undefined
  },
  forma: {
    id: 984122,
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
    }
  },
  foundry: {
    id: 31337,
    label: 'foundry',
    name: 'Foundry',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'http://127.0.0.1:8545',
    blockExplorer: {},
    contracts: undefined
  },
  fraxtal: {
    id: 252,
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
    }
  },
  fraxtalTestnet: {
    id: 2522,
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
    }
  },
  funkiMainnet: {
    id: 33979,
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
    }
  },
  funkiSepolia: {
    id: 3397901,
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
    }
  },
  fuse: {
    id: 122,
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
    }
  },
  fuseSparknet: {
    id: 123,
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
    contracts: undefined
  },
  gnosis: {
    id: 100,
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
    }
  },
  gnosisChiado: {
    id: 10200,
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
    }
  },
  gobi: {
    id: 1663,
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
    contracts: {}
  },
  goerli: {
    id: 5,
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
    }
  },
  gravity: {
    id: 1625,
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
    }
  },
  ham: {
    id: 5112,
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
    contracts: undefined
  },
  haqqMainnet: {
    id: 11235,
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
    contracts: undefined
  },
  haqqTestedge2: {
    id: 54211,
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
    contracts: undefined
  },
  hardhat: {
    id: 31337,
    label: 'hardhat',
    name: 'Hardhat',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'http://127.0.0.1:8545',
    blockExplorer: {},
    contracts: undefined
  },
  harmonyOne: {
    id: 1666600000,
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
    }
  },
  hashkeyTestnet: {
    id: 133,
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
    contracts: undefined
  },
  hedera: {
    id: 295,
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
    contracts: undefined
  },
  hederaPreviewnet: {
    id: 297,
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
    contracts: undefined
  },
  hederaTestnet: {
    id: 296,
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
    contracts: undefined
  },
  holesky: {
    id: 17000,
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
    }
  },
  immutableZkEvm: {
    id: 13371,
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
    }
  },
  immutableZkEvmTestnet: {
    id: 13473,
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
    }
  },
  inEVM: {
    id: 2525,
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
    }
  },
  iota: {
    id: 8822,
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
    contracts: undefined
  },
  iotaTestnet: {
    id: 1075,
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
    contracts: undefined
  },
  iotex: {
    id: 4689,
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
    }
  },
  iotexTestnet: {
    id: 4690,
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
    }
  },
  jbc: {
    id: 8899,
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
    }
  },
  jbcTestnet: {
    id: 88991,
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
    }
  },
  kaia: {
    id: 8217,
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
      url: 'https://kaiascope.com'
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 96002415
      }
    }
  },
  kairos: {
    id: 1001,
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
    }
  },
  kakarotSepolia: {
    id: 1802203764,
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
    contracts: undefined
  },
  karura: {
    id: 686,
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
    contracts: undefined
  },
  kava: {
    id: 2222,
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
    }
  },
  kavaTestnet: {
    id: 2221,
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
    }
  },
  kcc: {
    id: 321,
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
    }
  },
  klaytn: {
    id: 8217,
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
    }
  },
  klaytnBaobab: {
    id: 1001,
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
    }
  },
  koi: {
    id: 701,
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
    }
  },
  kroma: {
    id: 255,
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
    contracts: undefined
  },
  kromaSepolia: {
    id: 2358,
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
    contracts: undefined
  },
  l3x: {
    id: 12324,
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
    contracts: undefined
  },
  l3xTestnet: {
    id: 12325,
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
    contracts: undefined
  },
  lightlinkPegasus: {
    id: 1891,
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
    contracts: undefined
  },
  lightlinkPhoenix: {
    id: 1890,
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
    contracts: undefined
  },
  linea: {
    id: 59144,
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
    }
  },
  lineaGoerli: {
    id: 59140,
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
    }
  },
  lineaSepolia: {
    id: 59141,
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
    }
  },
  lineaTestnet: {
    id: 59140,
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
    }
  },
  lisk: {
    id: 1135,
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
    }
  },
  liskSepolia: {
    id: 4202,
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
    }
  },
  localhost: {
    id: 1337,
    label: 'localhost',
    name: 'Localhost',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    providerURL: 'http://127.0.0.1:8545',
    blockExplorer: {},
    contracts: undefined
  },
  lukso: {
    id: 42,
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
    }
  },
  luksoTestnet: {
    id: 4201,
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
    }
  },
  lycan: {
    id: 721,
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
    contracts: undefined
  },
  lyra: {
    id: 957,
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
    }
  },
  mainnet: {
    id: 1,
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
    }
  },
  mandala: {
    id: 595,
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
    contracts: undefined
  },
  manta: {
    id: 169,
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
    }
  },
  mantaSepoliaTestnet: {
    id: 3441006,
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
    }
  },
  mantaTestnet: {
    id: 3441005,
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
    }
  },
  mantle: {
    id: 5000,
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
    }
  },
  mantleSepoliaTestnet: {
    id: 5003,
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
    }
  },
  mantleTestnet: {
    id: 5001,
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
    }
  },
  merlin: {
    id: 4200,
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
    contracts: undefined
  },
  metachain: {
    id: 571,
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
    }
  },
  metachainIstanbul: {
    id: 1453,
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
    }
  },
  metalL2: {
    id: 1750,
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
    }
  },
  meter: {
    id: 82,
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
    contracts: undefined
  },
  meterTestnet: {
    id: 83,
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
    contracts: undefined
  },
  metis: {
    id: 1088,
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
      apiUrl: 'https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api'
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 2338552
      }
    }
  },
  metisGoerli: {
    id: 599,
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
    }
  },
  mev: {
    id: 7518,
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
    }
  },
  mevTestnet: {
    id: 4759,
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
    }
  },
  mintSepoliaTestnet: {
    id: 1686,
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
    contracts: undefined
  },
  mode: {
    id: 34443,
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
    }
  },
  modeTestnet: {
    id: 919,
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
    }
  },
  moonbaseAlpha: {
    id: 1287,
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
    }
  },
  moonbeam: {
    id: 1284,
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
    }
  },
  moonbeamDev: {
    id: 1281,
    label: 'moonbeamDev',
    name: 'Moonbeam Development Node',
    nativeCurrency: {
      decimals: 18,
      name: 'DEV',
      symbol: 'DEV'
    },
    providerURL: 'http://127.0.0.1:9944',
    blockExplorer: {},
    contracts: undefined
  },
  moonriver: {
    id: 1285,
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
    }
  },
  morphHolesky: {
    id: 2810,
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
    contracts: undefined
  },
  morphSepolia: {
    id: 2710,
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
    contracts: undefined
  },
  nautilus: {
    id: 22222,
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
    contracts: undefined
  },
  neonDevnet: {
    id: 245022926,
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
    }
  },
  neonMainnet: {
    id: 245022934,
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
    }
  },
  nexi: {
    id: 4242,
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
    }
  },
  nexilix: {
    id: 240,
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
    }
  },
  oasisTestnet: {
    id: 4090,
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
    contracts: undefined
  },
  oasys: {
    id: 248,
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
    contracts: undefined
  },
  okc: {
    id: 66,
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
    }
  },
  oortMainnetDev: {
    id: 9700,
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
    contracts: undefined
  },
  opBNB: {
    id: 204,
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
    }
  },
  opBNBTestnet: {
    id: 5611,
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
    }
  },
  optimism: {
    id: 10,
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
    }
  },
  optimismGoerli: {
    id: 420,
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
    }
  },
  optimismSepolia: {
    id: 11155420,
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
    }
  },
  otimDevnet: {
    id: 41144114,
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
    }
  },
  palm: {
    id: 11297108109,
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
    }
  },
  palmTestnet: {
    id: 11297108099,
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
    }
  },
  pgn: {
    id: 424,
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
    }
  },
  pgnTestnet: {
    id: 58008,
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
    }
  },
  phoenix: {
    id: 13381,
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
    }
  },
  playfiAlbireo: {
    id: 1612127,
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
    }
  },
  plinga: {
    id: 242,
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
    }
  },
  plumeTestnet: {
    id: 161221135,
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
    contracts: undefined
  },
  polygon: {
    id: 137,
    label: 'polygon',
    name: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
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
    }
  },
  polygonAmoy: {
    id: 80002,
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
    }
  },
  polygonMumbai: {
    id: 80001,
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
    }
  },
  polygonZkEvm: {
    id: 1101,
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
    }
  },
  polygonZkEvmCardona: {
    id: 2442,
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
    }
  },
  polygonZkEvmTestnet: {
    id: 1442,
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
    }
  },
  pulsechain: {
    id: 369,
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
    }
  },
  pulsechainV4: {
    id: 943,
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
    }
  },
  qMainnet: {
    id: 35441,
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
    contracts: undefined
  },
  qTestnet: {
    id: 35443,
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
    contracts: undefined
  },
  real: {
    id: 111188,
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
    }
  },
  redbellyTestnet: {
    id: 153,
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
    contracts: undefined
  },
  redstone: {
    id: 690,
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
    contracts: undefined
  },
  reyaNetwork: {
    id: 1729,
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
    contracts: undefined
  },
  rollux: {
    id: 570,
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
    }
  },
  rolluxTestnet: {
    id: 57000,
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
    }
  },
  ronin: {
    id: 2020,
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
    }
  },
  root: {
    id: 7668,
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
    }
  },
  rootPorcini: {
    id: 7672,
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
    }
  },
  rootstock: {
    id: 30,
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
    }
  },
  rootstockTestnet: {
    id: 31,
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
    contracts: undefined
  },
  rss3: {
    id: 12553,
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
    }
  },
  rss3Sepolia: {
    id: 2331,
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
    }
  },
  saigon: {
    id: 2021,
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
    }
  },
  sapphire: {
    id: 23294,
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
    }
  },
  sapphireTestnet: {
    id: 23295,
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
    contracts: undefined
  },
  satoshiVM: {
    id: 3109,
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
    contracts: undefined
  },
  satoshiVMTestnet: {
    id: 3110,
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
    contracts: undefined
  },
  scroll: {
    id: 534352,
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
    }
  },
  scrollSepolia: {
    id: 534351,
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
    }
  },
  sei: {
    id: 1329,
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
    }
  },
  seiDevnet: {
    id: 713715,
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
    contracts: undefined
  },
  seiTestnet: {
    id: 1328,
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
    contracts: undefined
  },
  sepolia: {
    id: 11155111,
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
    }
  },
  shapeSepolia: {
    id: 11011,
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
    contracts: undefined
  },
  shardeumSphinx: {
    id: 8082,
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
    contracts: undefined
  },
  shibarium: {
    id: 109,
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
    }
  },
  shibariumTestnet: {
    id: 157,
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
    }
  },
  shimmer: {
    id: 148,
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
    contracts: undefined
  },
  shimmerTestnet: {
    id: 1073,
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
    contracts: undefined
  },
  skaleBlockBrawlers: {
    id: 391845894,
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
    contracts: {}
  },
  skaleCalypso: {
    id: 1564830818,
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
    }
  },
  skaleCalypsoTestnet: {
    id: 974399131,
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
    }
  },
  skaleCryptoBlades: {
    id: 1026062157,
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
    contracts: {}
  },
  skaleCryptoColosseum: {
    id: 1032942172,
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
    contracts: {}
  },
  skaleEuropa: {
    id: 2046399126,
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
    }
  },
  skaleEuropaTestnet: {
    id: 1444673419,
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
    }
  },
  skaleExorde: {
    id: 2139927552,
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
    contracts: {}
  },
  skaleHumanProtocol: {
    id: 1273227453,
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
    contracts: {}
  },
  skaleNebula: {
    id: 1482601649,
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
    }
  },
  skaleNebulaTestnet: {
    id: 37084624,
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
    }
  },
  skaleRazor: {
    id: 278611351,
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
    contracts: {}
  },
  skaleTitan: {
    id: 1350216234,
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
    }
  },
  skaleTitanTestnet: {
    id: 1020352220,
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
    }
  },
  sketchpad: {
    id: 984123,
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
    contracts: undefined
  },
  soneiumMinato: {
    id: 1946,
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
    }
  },
  songbird: {
    id: 19,
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
    contracts: undefined
  },
  songbirdTestnet: {
    id: 16,
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
    contracts: undefined
  },
  sophonTestnet: {
    id: 531050104,
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
    }
  },
  spicy: {
    id: 88882,
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
    contracts: undefined
  },
  storyTestnet: {
    id: 1513,
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
    contracts: undefined
  },
  stratis: {
    id: 105105,
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
    contracts: undefined
  },
  syscoin: {
    id: 57,
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
    }
  },
  syscoinTestnet: {
    id: 5700,
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
    }
  },
  taiko: {
    id: 167000,
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
    }
  },
  taikoHekla: {
    id: 167009,
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
    contracts: undefined
  },
  taikoJolnir: {
    id: 167007,
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
    }
  },
  taikoKatla: {
    id: 167008,
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
    contracts: undefined
  },
  taikoTestnetSepolia: {
    id: 167005,
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
    contracts: undefined
  },
  taraxa: {
    id: 841,
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
    contracts: undefined
  },
  taraxaTestnet: {
    id: 842,
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
    contracts: undefined
  },
  telcoinTestnet: {
    id: 2017,
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
    contracts: undefined
  },
  telos: {
    id: 40,
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
    }
  },
  telosTestnet: {
    id: 41,
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
    contracts: undefined
  },
  tenet: {
    id: 1559,
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
    contracts: undefined
  },
  thaiChain: {
    id: 7,
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
    }
  },
  thunderTestnet: {
    id: 997,
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
    contracts: undefined
  },
  tron: {
    id: 728126428,
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
    contracts: undefined
  },
  unreal: {
    id: 18233,
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
    }
  },
  vechain: {
    id: 100009,
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
    contracts: undefined
  },
  wanchain: {
    id: 888,
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
    }
  },
  wanchainTestnet: {
    id: 999,
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
    }
  },
  wemix: {
    id: 1111,
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
    contracts: undefined
  },
  wemixTestnet: {
    id: 1112,
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
    contracts: undefined
  },
  x1Testnet: {
    id: 195,
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
    }
  },
  xLayer: {
    id: 196,
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
    }
  },
  xLayerTestnet: {
    id: 195,
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
    }
  },
  xai: {
    id: 660279,
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
    }
  },
  xaiTestnet: {
    id: 37714555429,
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
    contracts: undefined
  },
  xdc: {
    id: 50,
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
    }
  },
  xdcTestnet: {
    id: 51,
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
    }
  },
  xrSepolia: {
    id: 2730,
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
    contracts: undefined
  },
  yooldoVerse: {
    id: 50005,
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
    contracts: undefined
  },
  yooldoVerseTestnet: {
    id: 50006,
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
    contracts: undefined
  },
  zetachain: {
    id: 7000,
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
    }
  },
  zetachainAthensTestnet: {
    id: 7001,
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
    }
  },
  zhejiang: {
    id: 1337803,
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
    contracts: undefined
  },
  zilliqa: {
    id: 32769,
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
    contracts: undefined
  },
  zilliqaTestnet: {
    id: 33101,
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
    contracts: undefined
  },
  zircuitTestnet: {
    id: 48899,
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
    }
  },
  zkFair: {
    id: 42766,
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
    }
  },
  zkFairTestnet: {
    id: 43851,
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
    contracts: undefined
  },
  zkLinkNova: {
    id: 810180,
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
    contracts: undefined
  },
  zkLinkNovaSepoliaTestnet: {
    id: 810181,
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
    contracts: undefined
  },
  zkSync: {
    id: 324,
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
    }
  },
  zkSyncInMemoryNode: {
    id: 260,
    label: 'zkSyncInMemoryNode',
    name: 'ZKsync InMemory Node',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'http://localhost:8011',
    blockExplorer: {},
    contracts: undefined
  },
  zkSyncLocalNode: {
    id: 270,
    label: 'zkSyncLocalNode',
    name: 'ZKsync CLI Local Node',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'http://localhost:3050',
    blockExplorer: {},
    contracts: undefined
  },
  zkSyncSepoliaTestnet: {
    id: 300,
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
    }
  },
  zksync: {
    id: 324,
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
    }
  },
  zksyncInMemoryNode: {
    id: 260,
    label: 'zksyncInMemoryNode',
    name: 'ZKsync InMemory Node',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'http://localhost:8011',
    blockExplorer: {},
    contracts: undefined
  },
  zksyncLocalNode: {
    id: 270,
    label: 'zksyncLocalNode',
    name: 'ZKsync CLI Local Node',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    providerURL: 'http://localhost:3050',
    blockExplorer: {},
    contracts: undefined
  },
  zksyncSepoliaTestnet: {
    id: 300,
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
    }
  },
  zora: {
    id: 7777777,
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
    }
  },
  zoraSepolia: {
    id: 999999999,
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
    }
  },
  zoraTestnet: {
    id: 999,
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
    }
  }
}