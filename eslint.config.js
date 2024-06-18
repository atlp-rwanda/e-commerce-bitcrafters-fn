import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default [
  {
    ignores: [
      "dist",
      "coverage",
      "node_modules",
      ".eslintrc.js",
      "eslint.config.js",
      "vite.config.ts"
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      react: require("eslint-plugin-react"),
      prettier: require("eslint-plugin-prettier"),
      jest: require("eslint-plugin-jest"),
      "testing-library": require("eslint-plugin-testing-library"),
      "react-hooks": require("eslint-plugin-react-hooks"),
    },
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },
];
