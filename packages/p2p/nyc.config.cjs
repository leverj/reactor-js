module.exports = {
  // include: ['src/NetworkNode.js'],
  include: ['src/*'],
  exclude: [
    'src/abi',
    // 'src/contracts/index.js',
    // 'src/contracts/abi',
    // 'src/contracts/events',
  ],
  reporter: ['text', 'html', 'json'],
}
