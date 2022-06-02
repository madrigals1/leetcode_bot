const filesToIgnore = ['__mocks__', 'setup.ts', 'deleted'];

module.exports = {
  reporters: ['default', 'jest-junit'],
  verbose: true,
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],
  modulePathIgnorePatterns: filesToIgnore,
  testEnvironment: 'node',
  preset: 'ts-jest',
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
