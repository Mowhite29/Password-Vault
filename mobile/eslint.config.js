// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginSecurity = require('eslint-plugin-security');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    plugins: {
      security: eslintPluginSecurity
    },
    rules: {
            ...eslintPluginSecurity.configs.recommended.rules
    }
  }
]);
