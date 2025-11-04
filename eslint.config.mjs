// import { FlatCompat } from "@eslint/eslintrc";

// const compat = new FlatCompat({
//   // import.meta.dirname is available after Node.js v20.11.0
//   baseDirectory: import.meta.dirname,
// });

// const eslintConfig = [
//   ...compat.config({
//     extends: ["next"],
//     rules: {
//       "react/no-unescaped-entities": "off",
//       "@next/next/no-page-custom-font": "off",
//     },
//   }),
// ];

// export default eslintConfig;
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
