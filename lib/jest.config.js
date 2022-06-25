module.exports = {
    collectCoverage: true,
    preset: "jest-preset-angular",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ],
    clearMocks: true
};
