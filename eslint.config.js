import config from 'aberlaas/configs/eslint';

export default [
  ...config,
  {
    name: 'imoen',
    files: ['lib/**/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        serverUrl: false,
      },
    },
  },
];
