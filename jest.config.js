module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    coverageReporters: ['html', 'json-summary', 'text'],
    coverageThreshold: {
        global: {
            branches: 90,
            statements: 90,
        },
    },
    preset: 'ts-jest',
    resetMocks: true,
    restoreMocks: true,
    testEnvironment: 'jsdom',
    testTimeout: 2500,
    setupFilesAfterEnv: ['./jest.setup.browser.js'],
};
