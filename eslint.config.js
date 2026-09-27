import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist/", "node_modules/", "references/", "playwright-report/", "test-results/"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      // Classic hook rules only. The v7 React Compiler diagnostics (purity, refs, ...) are not
      // enabled because this project does not use React Compiler; they misreport timers read in
      // event handlers.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // JSX identifiers are not tracked by core no-unused-vars without eslint-plugin-react.
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z]" }],
    },
  },
  {
    files: ["*.config.js", "tests/**/*.{js,mjs}", "scripts/**/*.mjs"],
    languageOptions: { globals: { ...globals.node } },
  },
];
