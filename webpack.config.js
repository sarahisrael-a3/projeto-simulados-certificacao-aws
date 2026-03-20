module.exports = {
  mode: 'production',
  entry: './app.js',
  output: { filename: 'bundle.min.js' },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  }
};