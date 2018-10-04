let path = require('path');

module.exports = {
	entry: './src/xgmp.js',
	output: {
		path: path.resolve(__dirname),
		filename: './dist/xgmp.js',
		library: 'xgmp',
		libraryTarget:'umd',
		globalObject: 'typeof self !== \'undefined\' ? self : this'
	}
};