/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.ts'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true
}



module.exports = config;