module.exports = {
  preset: "@testing-library/react-native",
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["/node_modules/(?!native-base)/"],
  setupFiles: ["./jest.setup.js"],
}
