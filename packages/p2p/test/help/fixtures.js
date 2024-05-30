import _ from 'lodash'

export const peerIdJsons = [
  {privKey: 'CAESQK0/fGhAG26fRXLTxDyV7LpSreIfOXSJ+krI+BdTbeJq5/UphgwH8/mDsTa9HebrBuDJ6EtxNwnEAjEVyA/OQjU', pubKey: 'CAESIOf1KYYMB/P5g7E2vR3m6wbgyehLcTcJxAIxFcgPzkI1', id: '12D3KooWRRqAo5f41sQmc9BpsfqarZgd7PWUiX14Mz1htXDEc7Gp'},
  {privKey: 'CAESQGOEED1xY75lT0dqKQ1py7iYryEd1OB+l+6Co1XvUYgVV/OuL7KfE2VGxFOxmbkOyjcVdGp3otRdTnKXWvF4OBc', pubKey: 'CAESIFfzri+ynxNlRsRTsZm5Dso3FXRqd6LUXU5yl1rxeDgX', id: '12D3KooWFjh9hF2Hnj5ctFDxhz2N2zFin3Wc3P9umGWogMycKme6'},
  {privKey: 'CAESQHOTa7HhPhxUrvmHmh5LX7jbz+CKW0ou7y39sGp45cw7pYUGS7JDh8RGeWhR8URX7UqV444+Uxk/swNGSAUkNto', pubKey: 'CAESIKWFBkuyQ4fERnloUfFEV+1KleOOPlMZP7MDRkgFJDba', id: '12D3KooWLxV5yTWvS2TbgukqBRQLvWSvSrtrciw3TQBuvhJwieMw'},
  {privKey: 'CAESQFXP6qXikupDds5pFMFpqHMcB3d0O3JZ96Kvu21w8GzZtxZ0sAfRFUUN9L9Jb1tQpkPeg/OJML+hdZtQt7h3ddk', pubKey: 'CAESILcWdLAH0RVFDfS/SW9bUKZD3oPziTC/oXWbULe4d3XZ', id: '12D3KooWN94dvv9FVczTcrCf5PfM9RxRYaY7k1UYvRzq3W8gmZ7E'},
  {privKey: 'CAESQHJU/K+ZIVG7sULp2rtgUmmgrihcE0awCqJVdRSLTkokWh6lUWffNiPdKydEnwTxH2a7IN7Yj0Jo3pNy7GM4Kfc', pubKey: 'CAESIFoepVFn3zYj3SsnRJ8E8R9muyDe2I9CaN6TcuxjOCn3', id: '12D3KooWFt9xv8Y48aXGcFwiWhx88W5CthTquoAzNMvGepa28Ce2'},
  {privKey: 'CAESQJtO7Io32dBbLuSJ7Wzi1e4OGRuG0VbSqZ1yHJ9YyjJ2PWNkO6WsISstb2hs/j5LRXOHTnOD58BjA4eWeYYrYwo', pubKey: 'CAESID1jZDulrCErLW9obP4+S0Vzh05zg+fAYwOHlnmGK2MK', id: '12D3KooWDwzwWwXcccspYXqf6DiWs2vhSBRPbWKH5MBDr7Dsf45f'},
  {privKey: 'CAESQAJoMik3ScapUBNw3k+Ez41n/UthDGNLW+Q6UQdsFFKhXnCogvJxEX7aTpmmaeLQMrSmRttkLqKpsHJyv6cAMEQ', pubKey: 'CAESIF5wqILycRF+2k6Zpmni0DK0pkbbZC6iqbBycr+nADBE', id: '12D3KooWGB28NbUvV75csAgexnh9PdjCJSUsDb1Yheo1Y7s8j2gB'},
  {privKey: 'CAESQNLXOhrp0Aq6Ddj7Z9ExLMNj7tRPqflvubpzf56mgBdr4N1hBzbTHSEPvCKGzIXWUs0npJmaRyBvVUqU4AsRfR0', pubKey: 'CAESIODdYQc20x0hD7wihsyF1lLNJ6SZmkcgb1VKlOALEX0d', id: '12D3KooWQx9HJLgx99KTzXdr2vpwdGP6TbnoUHN5jLqJ5B9U9ovt'},
  {privKey: 'CAESQHO5kKq9uJ9rkmN+FXrR2MpjjKnUFNxyuCmlj4Fg6pQYllSh7/jFRu8Sh28EQofXcW7tSecZsPAl+1Aw8QB8Cnw', pubKey: 'CAESIJZUoe/4xUbvEodvBEKH13Fu7UnnGbDwJftQMPEAfAp8', id: '12D3KooWKwCAz3d7FXMfMuLRr4ZSS8uEqUsPRJyTZ1hAV669zJQT'},
  {privKey: 'CAESQFbXJS9+7ZWZbukRqKiZJwV11JIbhBu+TYFL1Q0/B4+3TrZ21mfrkYSTQx2W7OMfG70eBTJPFdRZWr/I3qnjxTQ', pubKey: 'CAESIE62dtZn65GEk0MdluzjHxu9HgUyTxXUWVq/yN6p48U0', id: '12D3KooWF7dLm5p5UDtHviDNcrWeaqTCENT3Vw2RcMdioy7jyX9D'},
  {privKey: 'CAESQOb1CTBNrgzjfMv3aEShRnLmvmvdZ9mJ3L6CsSYpodWBXJaua07w7TWlZUT0cDn/mIJSd5C0ncBOClJhOFuevyw', pubKey: 'CAESIFyWrmtO8O01pWVE9HA5/5iCUneQtJ3ATgpSYThbnr8s', id: '12D3KooWG3nwVXiBy78SWra5ntWu3WYVeHVKZ6cnQ3aT8TZcbv1y'},
  {privKey: 'CAESQKo++gno/bR9p3KzldQetMadWNgYd2271E15NeAy+2CXIWq9vzQb5DZbzewBz7vcQof8n1Kul4/p34835RuJ1iM', pubKey: 'CAESICFqvb80G+Q2W83sAc+73EKH/J9SrpeP6d+PN+UbidYj', id: '12D3KooWC4p2RLn7Qqh4KWrDkJZ6Gd9ZPtiXouYQvLhU5LNL1wBx'},
  {privKey: 'CAESQCE/R1iJz7DvxAzbYjMtyWWE35Lyo+uzYxjTh6mPPoUh9oNd8yhu4CK8nBlHZFfRn1FWpWqKfsLGPg23MCgeI7I', pubKey: 'CAESIPaDXfMobuAivJwZR2RX0Z9RVqVqin7Cxj4NtzAoHiOy', id: '12D3KooWSQeeJyufaCWunMJ2MocCSuXy6UHwSbm7TrTNZcEmnQyX'},
  {privKey: 'CAESQKDYC6QTiGJxT2h8CDB2gs2jZpjC80tqLPQuz2odngXo4R/nWmtlZOJyclvPQCygTcv2vOucjQnmTkPQb6UwI3Y', pubKey: 'CAESIOEf51prZWTicnJbz0AsoE3L9rzrnI0J5k5D0G+lMCN2', id: '12D3KooWQyA7iZtPTANXmYTHEzGpkCRydTWW2baAovT762y97jBT'},
]

export const bridgeInfos = [
  {
    'p2p': {
      'privKey': 'CAESQLg1OCjW/sQevFwyknIEEA3Jl6zDhVygpT9KtRnEMUfUu+OmkkJn2hBZR7jKJINWUL9mz5DYO7LzBRQOlBtGRfc',
      'pubKey': 'CAESILvjppJCZ9oQWUe4yiSDVlC/Zs+Q2Duy8wUUDpQbRkX3',
      'id': '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
    },
    'leader': '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
    'tssNode': {
      'id': '5ea86ada47b0ddb3c6a1ed3d5a8fe0637ef14b12790d846a70bb383df5ad1714',
      'secretKeyShare': 'ab3f40e0c297fe549b47b694e5aa9de0fe2aaafa5070067e1df79c27563c571a',
      'groupPublicKey': 'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
      'verificationVector': [
        '8da8e3afaf313c90b22197aa56ed0246b29a810415b757a99bd1e82572ce171e9ce92e295de3e218d19aec9c2eab5152a7d1cdf378d13d0e5e03d82e452d6705',
        'f15b7901556dfb1e9a1803ad942610f76077352c598ea525a6504ba51559990563be640c3c4ce040d2c8e614ff1ba2cc87c075a0fd361ddd6837b7236f0d9b9f',
        '851c551110d81ff4566191755b6b90ae1d5a19574cab8b65839322c5e2a6fd18fe6a04d1e882df169bf2975dc89e680d9eb2bbfe665c88092f6ffb043f32a52a',
        'beee63ed86c40ba3e69b3ca08b7b2e87fb66410ebb6e92858d75d046e0f79421095b07874350172039918e8e4e76009355aa277b1082465bc7a7c1729c724026'
      ],
      'vvec': [
        'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
        '8ec9efb927b65488d950bd62c6cb846ac67b58e4db347273b516b2d2627ac52e50fecd90cc2655289983af18b1f27712261b2dea17b4326fa313cc368a1e0111',
        '0c758e267d03aafe9f45c18e445493ae17286edfbfc3e513c6060a2c963e080ced381df3edf4a8ccbffa1969283a083f913cec8196db8360f7a15683d0adc494',
        'ae15947fdc0856a8f124ca8d9806e2daca74ec2851459da6b4a6a572c1a1e0091a32232b55e7171f6763c003fe6b7ee13c982159e8b66e8f460aa5461f411613'
      ]
    },
    'whitelistedPeers': {
      '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA': {
        'peerId':'12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
        'dkgId': '5ea86ada47b0ddb3c6a1ed3d5a8fe0637ef14b12790d846a70bb383df5ad1714'
      },
      '12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof': {
        'peerId':'12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof',
        'dkgId': '51ccda496d57f886e24a9926c35befaab6d8dda4bec815465524bc86b9611b17'
      },
      '12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3': {
        'peerId':'12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3',
        'dkgId': '342921a2f2c2f6ca8841d8cffb75bc6a2c142ec87e04e31a0203bb06b2fdea07'
      },
      '12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7': {
        'peerId':'12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7',
        'dkgId': '4bb33d936ac5633f5c2df8a31e8be959be4b7db820ef2cefce4d6ef9fc031715'
      },
      '12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs': {
        'peerId':'12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs',
        'dkgId': 'f1b6420296e8e621279137fec9c6e8cf32191d35fdb76235833319e2e29ab22c'
      },
      '12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe': {
        'peerId':'12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe',
        'dkgId': 'f6b2839c0f03fdb387da85cd8f52ea307d7fa20984c10e39a02d7bf3f247ab11'
      },
      '12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS': {
        'peerId':'12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS',
        'dkgId': '5df4ad8c1e5a6a9428279f30295e3e71419106f3aec9611da2b6088b8c21b211'
      }
    }
  },
  {
    'p2p': {
      'privKey': 'CAESQCJa3gooKUOrqv9F+gSMZNXZk/sq4Zmryw8rT0v5GYo3iHnYmx3GHIs7yiwp12HWpPddkK36dTTUZbEcpW32+kY',
      'pubKey': 'CAESIIh52JsdxhyLO8osKddh1qT3XZCt+nU01GWxHKVt9vpG',
      'id': '12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof',
    },
    'leader': '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
    'tssNode': {
      'id': '51ccda496d57f886e24a9926c35befaab6d8dda4bec815465524bc86b9611b17',
      'secretKeyShare': '57277e6be3991f151369e4d2b0ba1ea082c7b816f0c230dee45cdb1550e6221b',
      'groupPublicKey': 'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
      'verificationVector': [
        '2bcca43ac5450af86291618ff7ed41e8658a86175979fc45ebbc044a0b61c02145b77af92758d8182543b4e3c9c8d5d97da42f10df12f34f3d2fab88b741281b',
        '311750fe5bb102a27d6d2b078eb968ba2cc7613c7ad8191eef476c3cfbb9c2235d9658e4fc9a22d3fc279a78e8fe7585bff97611f8215c7cc324df7046243998',
        '93bf8edcb4845cd0fab3e94692bff9137c8f8ff50c11bb5ff35e3525b18a750a4cca3776250d721d93574ac7c2a056db802d5339f0a11a358a5597cf8aa5ff82',
        '4ddde5f8a4c2ddd3418987060fe41ada393bc2d11a837448d1e70800dd105f24f7fa2841bdfb4ad286be6581fe0447af771def13a7598ab0c466842125acd099'
      ],
      'vvec': [
        'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
        '8ec9efb927b65488d950bd62c6cb846ac67b58e4db347273b516b2d2627ac52e50fecd90cc2655289983af18b1f27712261b2dea17b4326fa313cc368a1e0111',
        '0c758e267d03aafe9f45c18e445493ae17286edfbfc3e513c6060a2c963e080ced381df3edf4a8ccbffa1969283a083f913cec8196db8360f7a15683d0adc494',
        'ae15947fdc0856a8f124ca8d9806e2daca74ec2851459da6b4a6a572c1a1e0091a32232b55e7171f6763c003fe6b7ee13c982159e8b66e8f460aa5461f411613'
      ]
    },
    'whitelistedPeers': {
      '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA': {
        'peerId':'12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
        'dkgId': '5ea86ada47b0ddb3c6a1ed3d5a8fe0637ef14b12790d846a70bb383df5ad1714'
      },
      '12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof': {
        'peerId':'12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof',
        'dkgId': '51ccda496d57f886e24a9926c35befaab6d8dda4bec815465524bc86b9611b17'
      },
      '12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3': {
        'peerId':'12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3',
        'dkgId': '342921a2f2c2f6ca8841d8cffb75bc6a2c142ec87e04e31a0203bb06b2fdea07'
      },
      '12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7': {
        'peerId':'12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7',
        'dkgId': '4bb33d936ac5633f5c2df8a31e8be959be4b7db820ef2cefce4d6ef9fc031715'
      },
      '12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs': {
        'peerId':'12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs',
        'dkgId': 'f1b6420296e8e621279137fec9c6e8cf32191d35fdb76235833319e2e29ab22c'
      },
      '12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe': {
        'peerId':'12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe',
        'dkgId': 'f6b2839c0f03fdb387da85cd8f52ea307d7fa20984c10e39a02d7bf3f247ab11'
      },
      '12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS': {
        'peerId':'12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS',
        'dkgId': '5df4ad8c1e5a6a9428279f30295e3e71419106f3aec9611da2b6088b8c21b211'
      }
    }
  },
  {
    'p2p': {
      'privKey': 'CAESQBi+43SNL2w8p4yGm3E6R0YIIomnrr2gJPFalk00Up4oo55Hbtbf6c4XeT4/UUXWKsSfgJLEXs7eiMZ+jNxW3Ao',
      'pubKey': 'CAESIKOeR27W3+nOF3k+P1FF1irEn4CSxF7O3ojGfozcVtwK',
      'id': '12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3',
    },
    'leader': '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
    'tssNode': {
      'id': '342921a2f2c2f6ca8841d8cffb75bc6a2c142ec87e04e31a0203bb06b2fdea07',
      'secretKeyShare': 'df37e0c6b0e253339e022c2dab9ae5fd1809a8bcf2acf3f6383c5e329e05d319',
      'groupPublicKey': 'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
      'verificationVector': [
        '5949682e8da7133232dca51450d09420bbe2c2787e2810c0297eb78194419b04e13fdba762201448fac6ad25b2d49a7dcb70d2135b022da8c86c2d705d644893',
        '2ea6d39b0a67037b00f55707fc1267a423b667eb1f5ce8e1e13297f26183d513447e29a9d415797e7ec769235c61b6c5004a7b1c9d29a0eeb075e3d78af34404',
        'dd4fa7cf91174a5533f66741405b7297f710e2fa6b79f07438eb9cbb4cc0791ffa15295a702729f6611e018d0d57ac55ec2108f338965cb91608055b5e14f6a5',
        'c3749f9868ed6e675665b0dfbe3cb10bccefb1ab7ee23fbe60dd8eee53eafd08351e9c412aeeebad58b2377d86a90c35c7f77e096ed810d10846f9a4c40bdd27'
      ],
      'vvec': [
        'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
        '8ec9efb927b65488d950bd62c6cb846ac67b58e4db347273b516b2d2627ac52e50fecd90cc2655289983af18b1f27712261b2dea17b4326fa313cc368a1e0111',
        '0c758e267d03aafe9f45c18e445493ae17286edfbfc3e513c6060a2c963e080ced381df3edf4a8ccbffa1969283a083f913cec8196db8360f7a15683d0adc494',
        'ae15947fdc0856a8f124ca8d9806e2daca74ec2851459da6b4a6a572c1a1e0091a32232b55e7171f6763c003fe6b7ee13c982159e8b66e8f460aa5461f411613'
      ]
    },
    'whitelistedPeers': {
      '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA': {
        'peerId':'12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
        'dkgId': '5ea86ada47b0ddb3c6a1ed3d5a8fe0637ef14b12790d846a70bb383df5ad1714'
      },
      '12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof': {
        'peerId':'12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof',
        'dkgId': '51ccda496d57f886e24a9926c35befaab6d8dda4bec815465524bc86b9611b17'
      },
      '12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3': {
        'peerId':'12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3',
        'dkgId': '342921a2f2c2f6ca8841d8cffb75bc6a2c142ec87e04e31a0203bb06b2fdea07'
      },
      '12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7': {
        'peerId':'12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7',
        'dkgId': '4bb33d936ac5633f5c2df8a31e8be959be4b7db820ef2cefce4d6ef9fc031715'
      },
      '12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs': {
        'peerId':'12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs',
        'dkgId': 'f1b6420296e8e621279137fec9c6e8cf32191d35fdb76235833319e2e29ab22c'
      },
      '12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe': {
        'peerId':'12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe',
        'dkgId': 'f6b2839c0f03fdb387da85cd8f52ea307d7fa20984c10e39a02d7bf3f247ab11'
      },
      '12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS': {
        'peerId':'12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS',
        'dkgId': '5df4ad8c1e5a6a9428279f30295e3e71419106f3aec9611da2b6088b8c21b211'
      }
    }
  },
  {
    'p2p': {
      'privKey': 'CAESQNg9ssaEYYJBkqVFXDiPLD3CKMtv5/ZTzC7Qwn5k3fGvPygwYFJp+9BG7PvfWhr3WQ+pNSIKYEfgjcdCN/r974g',
      'pubKey': 'CAESID8oMGBSafvQRuz731oa91kPqTUiCmBH4I3HQjf6/e+I',
      'id': '12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7',
    },
    'leader': '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
    'tssNode': {
      'id': '4bb33d936ac5633f5c2df8a31e8be959be4b7db820ef2cefce4d6ef9fc031715',
      'secretKeyShare': 'bce16ca57d2701756890448f5c9e83d72f357a0f10886a55197382ca07ffa326',
      'groupPublicKey': 'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
      'verificationVector': [
        'a780c24eef6c810266bb53dbe3b01a54d99337511578f361528f0d3dbcefbf0ce64de8ab46b97b9c7d401ed49fcd128ac711f9d7bb3381f34c53c936cb7bf307',
        '153152ba822b278b1399804d474967a2e30c5be3ec4681aa1ae637888ef1ea25b14b1672a2348754076fabaa08b4de0c8385a69d5d8c5f84caa713a25704c002',
        'f53d3c45c5f56bd7e418ef80937d0476f0883da4f8860fcedf6e64c45d8c28220109ec62915e336336adbacf2dbb8b8a0e6083ba6d30c99d766cf50cd1fe5fad',
        '0a2271a9b525bd99e2bce77b68c3393d7fc6f7d724ce854f2bef86d80f896809b948722c36936ce7946b8bb2eb63f0d5a7fd7186d85549a7785a8b470cbf902a'
      ],
      'vvec': [
        'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
        '8ec9efb927b65488d950bd62c6cb846ac67b58e4db347273b516b2d2627ac52e50fecd90cc2655289983af18b1f27712261b2dea17b4326fa313cc368a1e0111',
        '0c758e267d03aafe9f45c18e445493ae17286edfbfc3e513c6060a2c963e080ced381df3edf4a8ccbffa1969283a083f913cec8196db8360f7a15683d0adc494',
        'ae15947fdc0856a8f124ca8d9806e2daca74ec2851459da6b4a6a572c1a1e0091a32232b55e7171f6763c003fe6b7ee13c982159e8b66e8f460aa5461f411613'
      ]
    },
    'whitelistedPeers': {
      '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA': {
        'peerId':'12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
        'dkgId': '5ea86ada47b0ddb3c6a1ed3d5a8fe0637ef14b12790d846a70bb383df5ad1714'
      },
      '12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof': {
        'peerId':'12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof',
        'dkgId': '51ccda496d57f886e24a9926c35befaab6d8dda4bec815465524bc86b9611b17'
      },
      '12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3': {
        'peerId':'12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3',
        'dkgId': '342921a2f2c2f6ca8841d8cffb75bc6a2c142ec87e04e31a0203bb06b2fdea07'
      },
      '12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7': {
        'peerId':'12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7',
        'dkgId': '4bb33d936ac5633f5c2df8a31e8be959be4b7db820ef2cefce4d6ef9fc031715'
      },
      '12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs': {
        'peerId':'12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs',
        'dkgId': 'f1b6420296e8e621279137fec9c6e8cf32191d35fdb76235833319e2e29ab22c'
      },
      '12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe': {
        'peerId':'12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe',
        'dkgId': 'f6b2839c0f03fdb387da85cd8f52ea307d7fa20984c10e39a02d7bf3f247ab11'
      },
      '12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS': {
        'peerId':'12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS',
        'dkgId': '5df4ad8c1e5a6a9428279f30295e3e71419106f3aec9611da2b6088b8c21b211'
      }
    }
  },
  {
    'p2p': {
      'privKey': 'CAESQOtKGXd5Bkmtm8NzmWn5zkoARL2QNDXyFUEVjDvKuSVHUMObj/C7NZd9dT6OWYC3Kr2Zcj1eBt4TjQ1FdKGIz5o',
      'pubKey': 'CAESIFDDm4/wuzWXfXU+jlmAtyq9mXI9XgbeE40NRXShiM+a',
      'id': '12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs',
    },
    'leader': '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
    'tssNode': {
      'id': 'f1b6420296e8e621279137fec9c6e8cf32191d35fdb76235833319e2e29ab22c',
      'secretKeyShare': '36fa342e42b1ee489bb1d54dc14e084fde2f2c9f863e357b1eeb7f4a3f35d22c',
      'groupPublicKey': 'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
      'verificationVector': [
        'd7b7f000d4f3bd2e9068f530ebd385ce59b0979ba299cce5d28781c1bd15af2a9d9c3f00979f1fc641ee10a44a0119d00e63a92c48c7137c8510c02ab041aa02',
        '1be186c54b30d5a6dffae9cd45b8e186ff93c22fa6028675d65b5ef83cfbc20bea47081b7ddc79dfe16e112d2805aaff51f63cd5cbfd00ab709946f797153c01',
        '668088cbdd067786bd1a502c329130d96dab65712b923afe535b5a673d9bc121ca4a73e262c59eb7e860f3e70559bd5270d91682723b1031f107a14527dece85',
        'f6ae0dd9bede69e2b6e497781533d1d0e3b396bb41a9b4a9667b19405bfe9322dd387a65e95a40b8b1d774daca903a03f614b8aef99260c2ad405e8cef9507a8'
      ],
      'vvec': [
        'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
        '8ec9efb927b65488d950bd62c6cb846ac67b58e4db347273b516b2d2627ac52e50fecd90cc2655289983af18b1f27712261b2dea17b4326fa313cc368a1e0111',
        '0c758e267d03aafe9f45c18e445493ae17286edfbfc3e513c6060a2c963e080ced381df3edf4a8ccbffa1969283a083f913cec8196db8360f7a15683d0adc494',
        'ae15947fdc0856a8f124ca8d9806e2daca74ec2851459da6b4a6a572c1a1e0091a32232b55e7171f6763c003fe6b7ee13c982159e8b66e8f460aa5461f411613'
      ]
    },
    'whitelistedPeers': {
      '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA': {
        'peerId':'12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
        'dkgId': '5ea86ada47b0ddb3c6a1ed3d5a8fe0637ef14b12790d846a70bb383df5ad1714'
      },
      '12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof': {
        'peerId':'12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof',
        'dkgId': '51ccda496d57f886e24a9926c35befaab6d8dda4bec815465524bc86b9611b17'
      },
      '12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3': {
        'peerId':'12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3',
        'dkgId': '342921a2f2c2f6ca8841d8cffb75bc6a2c142ec87e04e31a0203bb06b2fdea07'
      },
      '12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7': {
        'peerId':'12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7',
        'dkgId': '4bb33d936ac5633f5c2df8a31e8be959be4b7db820ef2cefce4d6ef9fc031715'
      },
      '12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs': {
        'peerId':'12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs',
        'dkgId': 'f1b6420296e8e621279137fec9c6e8cf32191d35fdb76235833319e2e29ab22c'
      },
      '12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe': {
        'peerId':'12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe',
        'dkgId': 'f6b2839c0f03fdb387da85cd8f52ea307d7fa20984c10e39a02d7bf3f247ab11'
      },
      '12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS': {
        'peerId':'12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS',
        'dkgId': '5df4ad8c1e5a6a9428279f30295e3e71419106f3aec9611da2b6088b8c21b211'
      }
    }
  },
  {
    'p2p': {
      'privKey': 'CAESQPhYf5Eh74ZbevykoyBhb/07fzse3T13IChBVnhV9Uf16X42411YdfQkJaAeoFYodRn864Z1t4w3O3Pw/ZwPi+U',
      'pubKey': 'CAESIOl+NuNdWHX0JCWgHqBWKHUZ/OuGdbeMNztz8P2cD4vl',
      'id': '12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe',
    },
    'leader': '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
    'tssNode': {
      'id': 'f6b2839c0f03fdb387da85cd8f52ea307d7fa20984c10e39a02d7bf3f247ab11',
      'secretKeyShare': '49e27dce490cb49015da6390a7c94e999db61a900bcf197f9cb1ce2111794126',
      'groupPublicKey': 'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
      'verificationVector': [
        '2a1ca44fbc5af359e50d333e4b019b7ee9f3a985b3e6dbb71d7680f9d66ab6266435afc427510215524751b0ab5b6e521d21590b0f9d90142a82ba013e1ead85',
        'a9e8f72d2a19af3ebbe448ce4334f028b1f7fbc7b167aa18d32a1287affae72e33b91e50a924b56d55baf16e0bbd1119f92c6f45d4b7fd8115daeb9d3b972c2a',
        '6dadf7ac0283630cc4f3c6b2254ed7ba3babc19f996992e4e7c40b6fea0a672dcdee8d9bb74af9359204b10b645608f4f898dbc77b39d97dbb08de51e136a81a',
        '0a142eae256ea0fb9e2c964e79afade7ba8ece4baba1f76ddb8fb571dd8e0b14d266f1c38b6ae5e5e813b16aaec91ffd267c031f5b0aee924d57e53d7328d026'
      ],
      'vvec': [
        'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
        '8ec9efb927b65488d950bd62c6cb846ac67b58e4db347273b516b2d2627ac52e50fecd90cc2655289983af18b1f27712261b2dea17b4326fa313cc368a1e0111',
        '0c758e267d03aafe9f45c18e445493ae17286edfbfc3e513c6060a2c963e080ced381df3edf4a8ccbffa1969283a083f913cec8196db8360f7a15683d0adc494',
        'ae15947fdc0856a8f124ca8d9806e2daca74ec2851459da6b4a6a572c1a1e0091a32232b55e7171f6763c003fe6b7ee13c982159e8b66e8f460aa5461f411613'
      ]
    },
    'whitelistedPeers': {
      '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA': {
        'peerId':'12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
        'dkgId': '5ea86ada47b0ddb3c6a1ed3d5a8fe0637ef14b12790d846a70bb383df5ad1714'
      },
      '12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof': {
        'peerId':'12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof',
        'dkgId': '51ccda496d57f886e24a9926c35befaab6d8dda4bec815465524bc86b9611b17'
      },
      '12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3': {
        'peerId':'12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3',
        'dkgId': '342921a2f2c2f6ca8841d8cffb75bc6a2c142ec87e04e31a0203bb06b2fdea07'
      },
      '12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7': {
        'peerId':'12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7',
        'dkgId': '4bb33d936ac5633f5c2df8a31e8be959be4b7db820ef2cefce4d6ef9fc031715'
      },
      '12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs': {
        'peerId':'12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs',
        'dkgId': 'f1b6420296e8e621279137fec9c6e8cf32191d35fdb76235833319e2e29ab22c'
      },
      '12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe': {
        'peerId':'12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe',
        'dkgId': 'f6b2839c0f03fdb387da85cd8f52ea307d7fa20984c10e39a02d7bf3f247ab11'
      },
      '12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS': {
        'peerId':'12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS',
        'dkgId': '5df4ad8c1e5a6a9428279f30295e3e71419106f3aec9611da2b6088b8c21b211'
      }
    }
  },
  {
    'p2p': {
      'privKey': 'CAESQKdUkXwIAYckkX16vdn3Xj2VokOIpp2qJGasPCd9zcQV8xbBzmn0kXmT1q049e5o8JrCEG43GIc6dXP+co2OD9s',
      'pubKey': 'CAESIPMWwc5p9JF5k9atOPXuaPCawhBuNxiHOnVz/nKNjg/b',
      'id': '12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS',
    },
    'leader': '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
    'tssNode': {
      'id': '5df4ad8c1e5a6a9428279f30295e3e71419106f3aec9611da2b6088b8c21b211',
      'secretKeyShare': 'c27d3837c7af6013f657afbcb1d9c5dc30cf1448d731c45db81c499cab335a1f',
      'groupPublicKey': 'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
      'verificationVector': [
        '33f81a063e695c37af36db0f3486a1ddb4ab07332b367c4414d00b9209ad280480a310025dd0a8630d28ceb166cf9e138b18442740eb38bad4014dc409c815ae',
        '33adbbe74fb32fcf9f1f89d43855c5b4a9b19a9f1d0e4033d71765c6d154ba2e1fe4fc4bc64864b057e4367f12daec24fd317730810df9270d903f8de5edef81',
        'b020f384d778125bf9f5d506dd9ad287eec46ba56ef6fb9d64c15640d6d0a92fe69da6a991ff92c380d7cb6f63759c86210d3888e8101861a92996ed39df1913',
        'e2f431809f225a791e6b5cfe75b81d0c37433342d23b6dfda35eab923bb06d138fdf2bfdfc5c42e8540c34bea39ae1100422fcb14c12717f9f992bac48ef360b'
      ],
      'vvec': [
        'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
        '8ec9efb927b65488d950bd62c6cb846ac67b58e4db347273b516b2d2627ac52e50fecd90cc2655289983af18b1f27712261b2dea17b4326fa313cc368a1e0111',
        '0c758e267d03aafe9f45c18e445493ae17286edfbfc3e513c6060a2c963e080ced381df3edf4a8ccbffa1969283a083f913cec8196db8360f7a15683d0adc494',
        'ae15947fdc0856a8f124ca8d9806e2daca74ec2851459da6b4a6a572c1a1e0091a32232b55e7171f6763c003fe6b7ee13c982159e8b66e8f460aa5461f411613'
      ]
    },
    'whitelistedPeers': {
      '12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA': {
        'peerId':'12D3KooWNTok63zJ2n4f1BUjxoiCke2Qrw3rbmj9b1CEWLcG24iA',
        'dkgId': '5ea86ada47b0ddb3c6a1ed3d5a8fe0637ef14b12790d846a70bb383df5ad1714'
      },
      '12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof': {
        'peerId':'12D3KooWK17Npac4k5EqD9Me6WvEbpsHje34UEaMmyf4FdjPPaof',
        'dkgId': '51ccda496d57f886e24a9926c35befaab6d8dda4bec815465524bc86b9611b17'
      },
      '12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3': {
        'peerId':'12D3KooWLq4c7wDBDZBiP1tVVbwvmi4VhZSTcGBrUZWopfdvHxP3',
        'dkgId': '342921a2f2c2f6ca8841d8cffb75bc6a2c142ec87e04e31a0203bb06b2fdea07'
      },
      '12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7': {
        'peerId':'12D3KooWE4uPz6DnkHfrffcA5qaJpirh5CLJZXfXKY4NzMFCPEL7',
        'dkgId': '4bb33d936ac5633f5c2df8a31e8be959be4b7db820ef2cefce4d6ef9fc031715'
      },
      '12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs': {
        'peerId':'12D3KooWFFdnFgJMfwaXwtVZHGj5ui8U8c7KFx9DSH5fYDQRLmqs',
        'dkgId': 'f1b6420296e8e621279137fec9c6e8cf32191d35fdb76235833319e2e29ab22c'
      },
      '12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe': {
        'peerId':'12D3KooWRXpnbtYTiR6isHyjEbWayvChQP6um8JLVXu7RLNe9wDe',
        'dkgId': 'f6b2839c0f03fdb387da85cd8f52ea307d7fa20984c10e39a02d7bf3f247ab11'
      },
      '12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS': {
        'peerId':'12D3KooWSBHNAsuHiubML3uGMoEMZYNdZMJ7ZTMnudE5TvSZ3meS',
        'dkgId': '5df4ad8c1e5a6a9428279f30295e3e71419106f3aec9611da2b6088b8c21b211'
      }
    }
  }
]

export function getBridgeInfos(count) {
  const infos = _.cloneDeep(bridgeInfos).splice(0, count)
  const peers = infos.map(info => info.p2p.id)
  infos.forEach(info => info.whitelistedPeers = _.pick(info.whitelistedPeers, peers))
  return infos
}

export function getBootstrapNodes () {  return [`/ip4/127.0.0.1/tcp/10006/p2p/${bridgeInfos[0].p2p.id}`]}