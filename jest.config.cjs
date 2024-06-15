/** @type {import('ts-jest').JestConfigWithTsJest} */

  module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
    collectCoverageFrom: [
      "**/*.{js,jsx,ts,tsx}",
      "!**/node_modules/**",
      "!.storybook/**/**.{tsx,ts, jsx, md, js}",
      "!**/*.stories.{tsx, ts}",
      "!src/test/**",
      "!**/*.d.ts",
      "!src/main.tsx",
      "!coverage/**",
      "!**/*.config.{js,cjs,ts}",
      "!.eslintrc.js",
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
      "^.+\\.jsx?$": "babel-jest",
    },
    moduleNameMapper: {
      "^.+\\.svg$": "jest-svg-transformer",
      "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    },
    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
  };
  