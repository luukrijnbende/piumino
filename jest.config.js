module.exports = {
    collectCoverage: true,
    preset: 'jest-preset-angular',
    globalSetup: 'jest-preset-angular/global-setup',
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
    resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    transform: {
        '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
    },
    testEnvironment: "jsdom",
    transformIgnorePatterns: ['node_modules/(?!@angular|rxjs)'], // https://github.com/thymikee/jest-preset-angular/issues/1149#issuecomment-963506942
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ],
    clearMocks: true
};
