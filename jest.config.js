const { DISCORD_TEST_ENABLE } = process.env;

const filesToIgnore = ['__mocks__', 'setup.js'];

if (DISCORD_TEST_ENABLE) filesToIgnore.push('chatbots.discord.test.js');

export default {
  verbose: true,
  setupFilesAfterEnv: ['./src/__tests__/setup.js'],
  modulePathIgnorePatterns: filesToIgnore,
  testEnvironment: 'node',
};
