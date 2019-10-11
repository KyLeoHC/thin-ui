const path = require('path');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const devMode = process.env.BUILD_ENV === 'development';

process.env.NODE_ENV = devMode ? 'development' : 'production';

const baseConfig = {
  entry: {},
  resolve: {
    extensions: ['.ts', '.tsx', '.d.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src'),
      'style': path.resolve(__dirname, '../site/style')
    }
  },
  resolveLoader: {
    modules: [
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(vue|[jt]sx?)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../site')
        ],
        exclude: [/node_modules/],
        options: {
          formatter: require('eslint-formatter-friendly')
        }
      },
      {
        test: /\.([jt]s)x?$/,
        // 如果还有其它需要babel处理的模块，请在这里添加
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../site'),
          path.resolve(__dirname, '../types')
        ],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.less/,
        exclude: /node_modules/,
        use: [
          {
            loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {}
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BUILD_ENV: JSON.stringify(process.env.BUILD_ENV)
      }
    })
  ],
  stats: {
    children: false,
    chunkModules: false,
    entrypoints: false,
    modules: false,
    // Display bailout reasons
    optimizationBailout: true
  }
};

// 收集需要检查样式规范的目录或者文件
const fileSuffix = '{vue,htm,html,css,less}';
baseConfig.plugins.push(
  new StyleLintPlugin({
    files: [
      `site/styles/**/*.${fileSuffix}`,
      `site/components/**/*.${fileSuffix}`,
      `src/style/**/*.${fileSuffix}`,
      `src/components/**/*.${fileSuffix}`
    ]
  })
);

module.exports = baseConfig;
