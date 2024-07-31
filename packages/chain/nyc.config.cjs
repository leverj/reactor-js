module.exports = {
  include: ['src/*'],
  exclude: [
    'src/contracts/index.js',
    'src/contracts/abi',
    'src/contracts/events',
  ],
  reporter: ['text', 'html', 'json']
}
