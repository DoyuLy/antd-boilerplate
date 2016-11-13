let webpack = require('webpack')
let path = require('path')

let commonConfig = require('./common.config.js')()

commonConfig.entry = {
    vendor: [
        'babel-polyfill',

        'mobx',
        'mobx-react',
        'mobx-react-devtools',

        'react',
        'react-dom',
        'react-router',
        'antd'
    ]
}
commonConfig.output = {
    path: path.join(__dirname, '..', 'dist', 'dll'),
    filename: 'dll.[name].js',
    library: '[name]_[hash]',
    libraryTarget: 'var'
}
commonConfig.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    new webpack.NoErrorsPlugin(),
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
    // Dedupe modules in the output
    new webpack.optimize.DedupePlugin(),
    new webpack.DllPlugin({
        path: path.join(__dirname, '..', 'dll', '[name]-manifest.json'),
        name: '[name]_[hash]'
    }),
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
    }),
    // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
    })
]

commonConfig.resolve.root = path.resolve(__dirname, 'src')

module.exports = commonConfig;
