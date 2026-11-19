module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    // listing-filter and search-keyword are key-value blocks (one row per field), which the
    // rule is meant to exempt; its key-value check only passes when every component in the
    // project is that model, so set their limits explicitly.
    'xwalk/max-cells': ['error', { '*': 4, 'listing-filter': 7, 'search-keyword': 6 }],
  },
};
