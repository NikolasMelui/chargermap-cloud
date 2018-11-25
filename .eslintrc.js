module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['loopback', 'prettier'],
  parserOptions: {
    ecmaVersion: 8
  },
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ]
  }
};
