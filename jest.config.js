module.exports = {
    collectCoverage: true,
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ]
};