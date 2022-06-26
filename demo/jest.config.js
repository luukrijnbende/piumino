module.exports = {
    collectCoverage: true,
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.jest.json"
        },
    },
    moduleDirectories: [
        "node_modules",
        "../../dist",
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
    ],
    clearMocks: true,
}