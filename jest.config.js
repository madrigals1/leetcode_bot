const { DISCORD_TEST_ENABLE } = process.env;

const filesToIgnore = ['__mocks__', 'setup.ts'];

if (DISCORD_TEST_ENABLE) filesToIgnore.push('chatbots.discord.test.ts');

module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],
  modulePathIgnorePatterns: filesToIgnore,
  testEnvironment: 'node',
  transform: { '\\.ts$': ['ts-jest'] },
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 59,
      lines: 76,
      statements: 75,
    },
  },
};
