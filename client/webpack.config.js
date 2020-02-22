const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: {
        index: './src/index.ts',
        admin: './src/admin.ts'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css'
        }),
        new HtmlWebpackPlugin({
            template: 'html/index.html',
            chunks:['index']
        }),
        new HtmlWebpackPlugin({
            template: 'html/admin.html',
            filename: "admin.html",
            chunks:['admin']
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                'file-loader',
              ],
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.css' ],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};