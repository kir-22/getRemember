const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');
const MAIN_URL = JSON.stringify('https://getremember.com/');
module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "static/[hash].js",
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(css|scss)$/,
        use:['style-loader', 'css-loader']
      },
      {
        test: /\.(ttf|jpeg|jpg|svg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].ext',
              outputPath: 'static/'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './build',
    hot: true,
    watchContentBase: true,
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({'MAIN_URL': MAIN_URL}),
    new HtmlWebpackPlugin({template: path.join(__dirname, 'src/index.html')}),
    new MonacoWebpackPlugin({
      languages: ['abap', 'apex', 'azcli', 'bat', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'graphql', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'kotlin', 'less', 'lua', 'markdown', 'mips', 'msdax', 'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sophia', 'sql', 'st', 'swift', 'tcl', 'twig', 'typescript', 'vb', 'xml', 'yaml'],
    })
  ]
};
