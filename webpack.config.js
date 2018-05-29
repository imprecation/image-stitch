const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./client/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist')
  },
  mode: 'development',
  devServer: {
  	port: 8081,
  	contentBase: './dist'
  },
  module: {
	rules: [
	  {
	    test: /\.(js|jsx)$/,
	    exclude: /node_modules/,
	    use: {
	    	loader: 'babel-loader',
	    	options: {
	    		presets: ['env', 'react']
	    	}
	    }
	  },
	  {
	    test: /\.css$/,
	    use: ['style-loader', 'css-loader']
	  },
	  {
	  	test: /\.scss$/,
	    use: ['style-loader', 'css-loader', 'sass-loader'],
	  }
	]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, "client"),
      "node_modules"
    ]
  }
};

