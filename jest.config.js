module.exports = {
	preset: 'ts-jest',

	testEnvironment: 'node',
	rootDir: 'src/',
	coverageDirectory: '<rootDir>../coverage',

	testMatch: ['**/?(*.)+(Spec).ts'],
};
