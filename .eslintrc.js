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
    'plugin:react-hooks/recommended',
    
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins:  [
    "@typescript-eslint",
    "react"
  ],
  rules: {
  },
}
