import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import {defineConfig} from "eslint/config";
import nextVitals from 'eslint-config-next/core-web-vitals'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
    ...nextVitals,
    {rules: {
        "@typescript-eslint/no-explicit-any": "off"
    }},
]);

export default eslintConfig;
