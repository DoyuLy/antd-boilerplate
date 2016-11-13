let webpack = require('webpack')
let path = require('path')

let commonConfig = require('./common.config.js')()

commonConfig.debug = false;
commonConfig.plugins.push(
    // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
    }),
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    new webpack.NoErrorsPlugin(),

    new webpack.DllReferencePlugin({
        context: path.join(__dirname, '..'),
        manifest: require("../dll/vendor-manifest.json"),
        sourceType: 'var'
    }),
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
    // Dedupe modules in the output
    new webpack.optimize.DedupePlugin(),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // Minify all javascript, switch loaders to minimizing mode
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            drop_debugger: true,
            warnings: false,
            dead_code: true,
            unused: true,
            //drop_console: true,
            global_defs: {
                DEBUG: false
            }
        },
        comments: false,
        sourceMap: false
    })
);
module.exports = commonConfig;
