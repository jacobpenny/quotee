var path = require('path')

module.exports = {
  entry: {
    quotes: "./src/quotes",
    background: "./src/background",
    contentScript: "./src/contentScript"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name]Bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      { 
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
}
