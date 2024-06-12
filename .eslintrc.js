module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true },
  extends: [
    "airbnb",
    "airbnb/react",
    "airbnb/hooks",
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    "plugin:jest/style",
    "plugin:jest/recommended",
    "plugin:testing-library/react",
    'plugin:react-hooks/recommended',
    
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions:{
    "project":"./tsconfig.json",
    "ecmaFeatures":{
        "jsx":true
    },"ecmaVersion":12
  },
  plugins:  [
    "@typescript-eslint",
    "react"
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types':"off",
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
