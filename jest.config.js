// more options:
// https://jestjs.io/docs/en/configuration
module.exports = {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'vue'
  ],
  transform: {
    '.*\\.vue$': 'vue-jest',
    '.*\\.[tj]sx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    // 'node_modules/(?!(@babel/runtime)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '<rootDir>/**/__tests__/*.spec.(js|jsx|ts|tsx)'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx,vue}',
    '!**/style/**',
    '!**/demo/**'
  ],
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coverageDirectory: '<rootDir>/coverage'
};
