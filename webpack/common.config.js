let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let autoprefixer = require('autoprefixer')
let precss = require('precss')
let path = require('path')

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
let ENV = process.env.npm_lifecycle_event;
let isTest = ENV === 'test' || ENV === 'test-watch';
let isProd = ENV === 'build' || ENV === 'release';

let modulesDirectories = process.env.NODE_DOCKER_MODULES ? [process.env.NODE_DOCKER_MODULES] : ['node_modules', 'other_modules']
module.exports = function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    let config = {};

    /**
     * Resolve Path
     */
    config.resolve = {
        modulesDirectories: modulesDirectories,
        alias: {
            // moment: 'moment/min/moment-with-locales'
        },
        extensions: ['', '.js', '.jsx', '.ts', '.tsx']
    }

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    config.entry = {
        main: [
            './src/main.tsx'
        ]
    };

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    config.output = {
        // Absolute output directory
        path: __dirname + '/../dist',

        // Output path from the view of the page
        // Uses webpack-dev-server in development
        publicPath: '/',

        // Filename for entry points
        // Only adds hash in build mode
        filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

        // Filename for non-entry points
        // Only adds hash in build mode
        chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js',

        library : '[name]_[hash]',
        libraryTarget: 'var'
    };

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    config.devtool = false


    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */

    // Initialize module
    config.module = {
        preLoaders: [],
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: [
                    'awesome-typescript-loader'
                ],
                exclude: [/node_modules/]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader?cacheDirectory=true'
            },
            {
                test: /\.scss/,
                loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?modules!postcss?parser=postcss-scss')
            },
            {
                test: /\.css$/,
                loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css!postcss?parser=postcss-scss')
            },
            {
                // ASSET LOADER
                // Reference: https://github.com/webpack/file-loader
                // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
                // Rename the file using the asset hash
                // Pass along the updated reference to your code
                // You can add here any file extension you want to get copied to your output
                test: /\.(ico|woff|woff2|ttf|eot)(\?.+)?$/,
                loader: 'file'
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)(\?.+)?$/,
                loader: 'file'
            },
            {
                test: /\.yaml/,
                loader: 'json!yaml'
            }
        ],
        noParse: [
            /babel-polyfill\Wdist\Wpolyfill/,
            // /moment-with-locales/,
            /antd\Wdist\Wantd\.min/
        ]
    }

    /**
     * Externals
     * Reference: https://webpack.github.io/docs/configuration.html#externals
     * Speed!
     */
    config.externals = {}

    /**
     * PostCSS
     * Reference: https://github.com/postcss/autoprefixer-core
     * Add vendor prefixes to your css
     */
    config.postcss = [
        precss({
            import: {
                extension: 'scss'
            }
        }),
        autoprefixer({
            browsers: ['last 2 version', '> 5%']
        })
        //, cssInitial()
    ];
    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [];

    config.plugins.push(
        // Webpack 1.0
        // Webpack 2.0 fixed this mispelling
        new webpack.optimize.OccurenceOrderPlugin(),

        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files
        // Disabled when in test mode or not in build mode
        new ExtractTextPlugin('[name].[hash].css', {disable: !isProd}),

        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        // Render index.html
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            favicon: './src/favicon.ico'
        })
    )
    return config


}
