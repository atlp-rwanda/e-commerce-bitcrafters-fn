/** @type {import('ts-jest').JestConfigWithTsJest} */

  module.exports = {
    maxWorkers: 2,  
    testTimeout: 10000,
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
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
      "!src/views/XMobileMoney.tsx",
      "!src/views/XCreditCard.tsx",
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
       '\\.(png|jpg|webp|ttf|woff|woff2|mp4)$': '<rootDir>/src/test/__mocks__/fileMock.js'
    },
    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
  };
  