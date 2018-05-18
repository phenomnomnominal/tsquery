module.exports = function (wallaby) {
	return {
		files: ['src/**/*.ts', { pattern: 'test/fixtures/**/*.ts', instrument: false }],
		tests: ['test/**/*.spec.ts'],
		env: {
			type: 'node'
		}
	};
};
