const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: {
        player: './src/player.ts',
        board: './src/board.ts',
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
            template: 'html/player.html',
            filename: "index.html",
            chunks:['player']
        }),
        new HtmlWebpackPlugin({
            template: 'html/board.html',
            filename: "board.html",
            chunks:['board']
        }),
        new HtmlWebpackPlugin({
            template: 'html/admin.html',
            filename: "admin.html",
            chunks:['admin']
        }),
        new CopyPlugin([
            { from: 'assets', to:'assets' },
        ]),
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