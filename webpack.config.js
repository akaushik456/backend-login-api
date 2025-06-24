const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  externals: [nodeExternals()], // 👈 THIS tells Webpack not to bundle node_modules
  resolve: {
    extensions: ['.js', '.json'],
  },
};
