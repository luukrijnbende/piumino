module.exports = {
    collectCoverage: true,
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ],
    clearMocks: true
}