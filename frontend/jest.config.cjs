/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.jsx', '**/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/__tests__/styleMock.cjs'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx', '!src/**/__tests__/**'],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 40,
      functions: 60,
      lines: 60
    }
  }
};
