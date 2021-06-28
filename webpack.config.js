const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = extension => isDev
	? `[name].${extension}`
	: `[name].[contenthash].${extension}`;

module.exports = {
	target: 'web',
	entry: path.resolve(__dirname,'src/index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: filename('js'),
		assetModuleFilename: '[name][ext]'
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		}
	},
	devServer: {
		port: 9100,
		hot: isDev,
		host: '0.0.0.0',
		compress: true,

	},
	devtool: isDev ? 'source-map' : false,
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			favicon: `./src/favicon.ico`
		}),
		new ImageMinimizerPlugin({
			minimizerOptions: {
				plugins: [
					["jpegtran", { progressive: true }],
					["optipng", { optimizationLevel: 5 }],
				],
			},
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: filename('css')
		}),
	],
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: ['autoprefixer'],
							}
						}
					},
					'sass-loader'
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext]'
				}
			},
			{
				test:  /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
				generator: {
					filename: `assets/img/${filename('[ext]')}`
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader",
						options: {
							sources: true,
							minimize: isProd
						}
					}
				]
			}
		]
	}
}
/*
import "core-js/stable";
import "regenerator-runtime/runtime"
require('./index.html')
добавить в index.js
*/
