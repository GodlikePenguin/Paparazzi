module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ["node", "@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:node/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    env: {
        node: true
    },
    rules: {
        "@typescript-eslint/no-var-requires": "off",
        "node/no-unsupported-features/es-syntax": [
            "error",
            { ignores: ["modules"] }
        ],
        "quotes": ["error", "double"]
    },
    settings: {
        node: {
            tryExtensions: [".js", ".json", ".node", ".ts"]
        }
    }
};
