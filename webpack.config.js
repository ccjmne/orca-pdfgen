const webpack = require('webpack')
const slsw = require('serverless-webpack')

module.exports = {
  devtool: 'source-map',
  target: 'node',
  node: {
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        },
      },
      { test: /\.json$/, loader: 'json-loader' },
    ],
  },
  resolve: {
    symlinks: true,
  },
  output: {
    libraryTarget: 'commonjs',
    path: `${__dirname}/.webpack`,
    filename: '[name].js',
  },
  externals: ['aws-sdk'],
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  entry: slsw.lib.entries,
}
