process.env.NODE_ENV = 'test'

module.exports = {
  file: 'test/setup.js',
  spec: ['**/*.spec.js'],
  'node-option': ['no-warnings=ExperimentalWarning'],
}
