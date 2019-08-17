module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:unicorn/recommended',
		'plugin:jsdoc/recommended',
		'plugin:jest/recommended',
		'plugin:@typescript-eslint/recommended',
	],
	env: {
		'es6': true,
		'node': true,
		'jest/globals': true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		project: './tsconfig.json',
		sourceType: 'module',
	},
	rules: {
		'curly': ['error', 'multi-line'],
		'indent': ['error', 'tab', { SwitchCase: 1 }],
		'linebreak-style': 'error',
		'no-dupe-class-members': 'off',
		'prefer-const': 'error',
		'prefer-template': 'error',
		'quotes': ['error', 'single'],
		'quote-props': ['error', 'consistent-as-needed'],

		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-require-imports': 'error',
		'@typescript-eslint/no-unused-vars': ['error', {
			args: 'all',
			varsIgnorePattern: '^_',
			argsIgnorePattern: '^_',
		}],
		'@typescript-eslint/no-use-before-define': ['error', { functions: false }],
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/prefer-readonly': 'error',
		'@typescript-eslint/type-annotation-spacing': ['error', { before: true }],

		'jsdoc/check-tag-names': ['warn', { definedTags: ['internal'] }],
		'jsdoc/require-jsdoc': ['warn', { publicOnly: true }],
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-returns': 'off',

		'unicorn/filename-case': ['error', { case: 'pascalCase' }],
	},
};
