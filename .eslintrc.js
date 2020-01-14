module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true,
        "jest/globals": true
    },
    "extends": [
        "eslint:recommended",
        "prettier",
        "plugin:jest/recommended",
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": 0,
        "global-require": 0,
        "eslint linebreak-style": [0, "error", "windows"],
        "curly": "off",
        "eqeqeq": "off",
        "max-len": 'off',
        "no-undef": "off",
        "no-shadow": "off",
        "func-names": "off",
        "no-console": "off",
        "no-plusplus": "off",
        "no-unused-vars": "off",
        "object-shorthand": "off",
        "no-use-before-define": "off",
        "no-underscore-dangle": "off",
        "no-trailing-spaces": "off",
        "no-bitwise": "off",
        "consistent-return": "off",
        "prefer-template": "off",
        "operator-linebreak": "off",
        "default-case": "off",
        "no-param-reassign": "off",
        "arrow-parens": "off",
        "radix": "off",
        "no-restricted-syntax": "off",
        "no-labels": "off",
        "guard-for-in": "off",
        "nonblock-statement-body-position": "off",
        "indent": "warn",
        "quotes": "warn",
        "prefer-const": "warn",
        "comma-dangle": "warn",
        "padded-blocks": "warn",
        "space-before-function-paren": "warn",
    },
    
};