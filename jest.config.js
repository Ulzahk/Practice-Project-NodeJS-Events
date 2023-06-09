module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/dist/',
    '/node_modules/',
    '/test/',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['cobertura', 'lcov', 'text'],
  moduleNameMapper: {
    '@authentication/(.*)$': '<rootDir>/authentication/$1',
    '@common/(.*)$': '<rootDir>/common/$1',
    '@config/(.*)$': '<rootDir>/config/$1',
    '@database/(.*)$': '<rootDir>/database/$1',
    '@lists/(.*)$': '<rootDir>/lists/$1',
    '@tasks/(.*)$': '<rootDir>/tasks/$1',
    '@users/(.*)$': '<rootDir>/users/$1',
    '@mocks/(.*)$': '<rootDir>/../test/mocks/$1',
  },
  restoreMocks: true,
  rootDir: 'src',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*spec.ts'],
  preset: 'ts-jest',
  transform: {
    'ˆ.+\\.(t|j)s$': 'ts-jest',
  }
};