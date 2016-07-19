const debug = true;
const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.join(__dirname, '.'),
  devtool: debug ? 'inline-sourcemap' : null,
  entry: {
    app: [
      './src/js/auto-size-transitions.js'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: [
            'transform-class-properties',
            'transform-decorators-legacy'
          ],
        }
      }
    ]
  },
  output: {
    path: `${__dirname}/dev/js`,
    publicPath: 'js/',
    filename: 'auto-size-transitions.min.js'
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
