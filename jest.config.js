module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/dist/',
    '/node_modules/',
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
    '@common/(.*)$': '<rootDir>/common/$1',
    '@config/(.*)$': '<rootDir>/config/$1',
    '@database/(.*)$': '<rootDir>/database/$1',
    '@users/(.*)$': '<rootDir>/users/$1',
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