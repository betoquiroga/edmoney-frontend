import globals from "globals"
import pluginJs from "@eslint/js"
import * as tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import pluginPrettier from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
  },

  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          semi: false,
          endOfLine: "auto",
        },
      ],
    },
  },
  prettierConfig,

  {
    rules: {
      camelcase: "error",
      "spaced-comment": "error",
      quotes: ["error", "double"],
      "no-duplicate-imports": "error",
    },
  },
  {
    files: ["tailwind.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]
