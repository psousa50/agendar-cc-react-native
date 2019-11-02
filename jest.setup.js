jest.mock("react-native-localize", () => ({
  getLocales: () => [{ countryCode: "GB", languageTag: "en-GB", languageCode: "en", isRTL: false }],
}))

jest.mock("react-navigation", () => ({
  createStackNavigator: jest.fn(),
  createAppContainer: jest.fn(),
}))

jest.mock("@react-native-community/async-storage", () => ({}))

jest.mock("@react-native-community/geolocation", () => ({
  getCurrentPosition: jest.fn(),
}))
