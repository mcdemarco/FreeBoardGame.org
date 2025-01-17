var path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

var config = {
  mode: 'development',
  target: 'node',
  externals: [nodeExternals()],

  entry: {
    server_fbg: path.resolve(__dirname, 'src/server_fbg.tsx'),
    server_bgio: path.resolve(__dirname, 'src/server_bgio.tsx'),
  },

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'server-dist'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js',
  },

  plugins: [
    new CleanWebpackPlugin(['server-dist'], { root: __dirname, dry: false, exclude: [] }),
    new HardSourceWebpackPlugin(),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '*'],
    modules: ['node_modules', 'src'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: true,
                    },
                  },
                ],
              ],
              plugins: ['@babel/plugin-syntax-dynamic-import'],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|webp|svg|mp3|wav)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'null-loader',
          },
        ],
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      },
    ],
  },
};

module.exports = config;
