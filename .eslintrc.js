module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:jsdoc/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
	],
	env: {
		es6: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		project: './tsconfig.json',
		sourceType: 'module',
	},
	rules: {
		curly: ['error', 'multi-line'],
		'linebreak-style': 'error',
		'prefer-const': 'error',
		'prefer-template': 'error',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-inferrable-types': [
			'error',
			{ ignoreParameters: true },
		],
		'@typescript-eslint/prefer-readonly': 'error',
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-returns': 'off',
	},
};
