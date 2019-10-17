
'use strict'

const env = {
	test: {
	  presets: [
			'@babel/preset-env',
			'@babel/preset-react',
			['es2015', { 'modules': false}]
	  ],
	  plugins: [
			'@babel/plugin-proposal-class-properties',
			'transform-es2015-modules-commonjs',
			'babel-plugin-dynamic-import-node',
	  ],
	},
}
module.exports = { env }
