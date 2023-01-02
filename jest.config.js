// Jest Configuration for Unit Tests
module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testEnvironment: 'node',
    testTimeout: 30000,
    testRegex: '.*.spec.ts$',
    collectCoverageFrom: ['**/*.(t|j)s', '!**/node_modules/**'],
    coverageDirectory: '../coverage',
    coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
    testPathIgnorePatterns: ['./test/', './prisma/'],
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
  };
  