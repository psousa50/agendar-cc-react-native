jest.mock("react-native-localize", () => ({
  getLocales: () => [{ countryCode: "GB", languageTag: "en-GB", languageCode: "en", isRTL: false }],
}))
