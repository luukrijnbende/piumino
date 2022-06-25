module.exports = {
    collectCoverage: true,
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
    moduleDirectories: [
        "node_modules",
        "../../dist"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ],
    clearMocks: true
}