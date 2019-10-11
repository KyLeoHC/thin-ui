const path = require('path');
const baseConfig = require('./webpack.config.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

process.env.BABEL_MODULE = 'es';

baseConfig.entry = {
  'thin': ['./src/index.ts', './src/style/index.tsx']
};
baseConfig.output = {
  path: path.resolve(__dirname, '../dist'),
  filename: 'thin.min.js',
  library: 'ThinUI',
  libraryTarget: 'umd'
};

baseConfig.externals = {
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue'
  }
};

baseConfig.plugins = baseConfig.plugins.concat([
  new OptimizeCSSAssetsPlugin({}),
  new MiniCssExtractPlugin({
    filename: 'thin.min.css'
  })
]);

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// baseConfig.plugins.push(new BundleAnalyzerPlugin());

baseConfig.mode = 'production';

module.exports = baseConfig;
