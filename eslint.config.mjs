// @ts-check

import tslintPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

export default [
  {
    files: ["src/*.ts"],
    ignores: ["**/node_modules/", ".git/", "dist/", "**/dist/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        console: "readonly",
        module: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tslintPlugin,
    },
    rules: {
      ...tslintPlugin.configs.recommended.rules,
      "no-empty-function": "error",
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]
