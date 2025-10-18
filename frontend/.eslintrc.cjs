module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "next/typescript"],
  ignorePatterns: ["node_modules/", ".next/", "next.config.mjs"],
  rules: {
    "react/jsx-props-no-spreading": "off"
  }
};
