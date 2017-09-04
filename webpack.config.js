var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.resolve(__dirname, 'src/components');
var BUILD_DIR = path.resolve(__dirname, 'src/js');

module.exports = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'index.js'
     },
    module : {
        loaders : [
          {
            test : /\.jsx?/,
            include : APP_DIR,
            loader : 'babel-loader'
          }
        ]
    }
};
