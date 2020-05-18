import { BABEL_ESLINT_PATH } from 'src/utils/constants';

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: BABEL_ESLINT_PATH,
  plugins: ['babel'],
  rules: {
    quotes: ['error', 'single'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 'off',
    'babel/no-unused-expressions': 'error',
    'no-unused-expressions': 'off',
  },
};
