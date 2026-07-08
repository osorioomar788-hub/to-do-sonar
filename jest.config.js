module.exports = {
  preset: "jest-expo",

  testMatch: [
    "**/__tests__/**/*.test.js",
  ],

  collectCoverageFrom: [
    "src/api/**/*.js",
    "!src/api/**/__tests__/**",
  ],

  coverageDirectory: "coverage",

  coverageReporters: [
    "text",
    "lcov",
    "cobertura",
  ],

  clearMocks: true,
};