const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css"
});

module.exports = {

  context: path.join(process.cwd(), 'src'), //the home directory for webpack

  devtool: 'source-map', // enhance debugging by adding meta info for the browser devtools

  entry: [ 'babel-polyfill', './index.js' ],

  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
    sourceMapFilename: '[name].map'
  },

  resolve: {
    extensions: ['.js'],  // extensions that are used
    modules: [path.join(process.cwd(), 'src'), 'node_modules'] // directories where to look for modules
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    },{
        test: /\.scss$/,
        use: extractSass.extract({
            use: [{
                loader: "css-loader",
                options: {
                    sourceMap: true
                }
            }, {
                loader: "sass-loader",
                options: {
                    sourceMap: true
                }
            }],
            // use style-loader in development
            fallback: "style-loader"
        })
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      ]
    },{
      test: /\.css/,
      use: [
        {
          loader: 'css-loader',
        }
      ]
    },
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [
        { loader: 'file-loader' }
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {root: process.cwd()}),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor"
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
      extractSass
  ]
};
