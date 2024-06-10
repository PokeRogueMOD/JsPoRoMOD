const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./js/main.js",
    output: {
        filename: "mod.min.js",
        path: path.resolve(__dirname),
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
                type: "asset/resource",
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
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
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["mod.min.js"],
        }),
    ],
};
