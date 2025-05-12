const path = require('path');

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: /node_modules/
  });

  config.ignoreWarnings = [
    {
      module: /@react-aria\/ssr/,
      message: /Failed to parse source map/
    }
  ];

  return config;
};
