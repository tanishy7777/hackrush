const { watch } = require('fs');
const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  // The entry point file described above
  entry: './hosting/src/index.js',
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, 'hosting/dist'),
    filename: 'bundle.js'
  },
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map',
  module: {
    rules: [
        { test: /\.css$/, use: 'css-loader' },
        { test: /\.html$/, use: 'html-loader' },
      ],
  },
}