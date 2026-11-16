import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "playwright-report", "test-results"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Playwright tests and config run in Node, not the browser. Playwright's fixture function is
    // called `use`, which the React hooks rule mistakes for a React hook, so it's off here.
    files: ["e2e/**/*.js", "playwright.config.js"],
    languageOptions: { globals: globals.node },
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
]);
