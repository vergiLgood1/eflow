import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "prisma/generated/**",
    "tests/**",
    "src/shared/**",
    "src/features/workspace/**",
    "src/features/templates/**",
    "src/features/activity/**",
    "src/features/explore/**",
    "src/features/account/**",
    "src/features/authentication/**",
    "src/app/**",
  ]),
]);

export default eslintConfig;
