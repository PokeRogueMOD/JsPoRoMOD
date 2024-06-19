const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        main: "./js/main.js",
    },
    output: {
        filename: "mod.min.js",
        path: path.resolve(__dirname),
        library: "PokeRogueMOD",
        libraryTarget: "umd",
        globalObject: "this",
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.html$/i,
                use: "raw-loader",
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192, // Limit in bytes. Files smaller than this will be converted to Data URI.
                            fallback: "file-loader",
                            name: "[name].[hash].[ext]",
                            esModule: false, // Disable ES modules for compatibility
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: false,
                        passes: 3,
                    },
                    format: {
                        comments: false,
                    },
                    mangle: {
                        safari10: true,
                    },
                },
                extractComments: false,
            }),
            new CssMinimizerPlugin(),
        ],
    },
};
