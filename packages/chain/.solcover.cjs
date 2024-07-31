module.exports = {
  mocha: {
    sort: true, //fixme
  },
 // fixme:coverage: skipFiles are not skipped ...
  skipFiles: [
    'mocks/ERC1155Mock.sol',
    'mocks/ERC20Mock.sol',
    'mocks/ERC721Mock.sol',
  ],
  istanbulReporter:	['html', 'text', 'json']
}
