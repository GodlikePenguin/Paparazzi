/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    "roots": [
        "<rootDir>/src"
    ],
    collectCoverage: true,
    coverageDirectory: "coverage",
};
