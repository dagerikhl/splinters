import next from "eslint-config-next";
import nextWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

export default [
  ...next,
  ...nextWebVitals,
  ...nextTypescript,
  prettier,
  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },
];
