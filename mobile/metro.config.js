const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  const { sourceExts } = config.resolver;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-sass-transformer")
  };
  config.resolver = {
    ...resolver,
    sourceExts: [...sourceExts, "scss", "sass"]
  };

  return config;
})();