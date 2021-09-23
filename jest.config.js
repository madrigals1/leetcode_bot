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
      branches: 58,
      functions: 47,
      lines: 70,
      statements: 70,
    },
  },
};
