module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    "plugin:vue/strongly-recommended"
  ],
  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "semi": ["error", "always"],
    "indent": ["error", 2],
    "quotes": [2, "double"],
    "space-before-function-paren": ["error", "never"],
    "no-tabs": 0,
    "vue/max-attributes-per-line": ["error", {
      "singleline": 10,
    }],
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "always",
      }
    }],
    "vue/singleline-html-element-content-newline": ["error", {
      "ignoreWhenNoAttributes": true,
      "ignoreWhenEmpty": true,
      "ignores": ["pre", "textarea", "span", "strong", "b-button", "b-alert", "b-form-radio", "b-badge", "p"]
    }]
  }
};