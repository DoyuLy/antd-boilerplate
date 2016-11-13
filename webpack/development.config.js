let webpack = require('webpack')
let path = require('path')
let devServerConfig = require('./common.config.js')()

devServerConfig.debug = true;
devServerConfig.cache = true;
devServerConfig.devtool = 'eval';

devServerConfig.plugins.push(
    // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"',
        DEBUG: true
    }),
    new webpack.NoErrorsPlugin(),

    new webpack.DllReferencePlugin({
        context: path.join(__dirname, '..'),
        manifest: require("../dll/vendor-manifest.json"),
        sourceType: 'var'
    })
)

devServerConfig.devServer = {
    contentBase: path.join(__dirname, '..', 'dist'),
    stats: {
        modules: false,
        cached: false,
        colors: true,
        chunk: false
    },
    proxy: {
        '/api/*': {
            target: 'http://www.google.com',
            secure: false
        }
    },
    host: '0.0.0.0',
    port: 8080
}


module.exports = devServerConfig;