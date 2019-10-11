const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin');
const baseConfig = require('./webpack.config.base');

baseConfig.entry = {
  'site': './site/index.ts'
};
baseConfig.output = {
  path: path.resolve(__dirname, './'),
  publicPath: '/',
  chunkFilename: '[name]/chunk.js',
  filename: '[name]/bundle.js'
};

baseConfig.plugins.push(
  new HtmlWebpackPlugin({
    filename: `site/index.html`,
    template: `./site/index.html`,
    chunks: ['site']
  }),
  new InlineSourceWebpackPlugin({
    compress: true,
    rootpath: './site'
  })
);

baseConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

baseConfig.devServer = {
  hot: true,
  inline: true,
  // open: true,
  contentBase: './',
  port: 12580,
  host: '0.0.0.0',
  disableHostCheck: true,
  stats: {
    children: false
  },
  historyApiFallback: {
    rewrites: [
      {
        from: /^\/([-a-zA-Z0-9]+)\/.*$/,
        to(context) {
          return context.parsedUrl.pathname.replace(/^\/([-a-zA-Z0-9]+)\/.*$/, `/$1/index.html`);
        }
      }
    ]
  }
};

baseConfig.mode = 'development';
baseConfig.devtool = 'cheap-module-eval-source-map';

module.exports = baseConfig;
