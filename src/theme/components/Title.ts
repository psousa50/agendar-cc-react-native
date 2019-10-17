import { Platform } from "react-native"

import { variable } from "./../variables/platform"

export const theme = (variables = variable) => {
  const titleTheme = {
    fontSize: variables.titleFontSize - 2,
    fontFamily: variables.titleFontfamily,
    color: variables.titleFontColor,
    fontWeight: Platform.OS === "ios" ? "600" : undefined,
    textAlign: "center",
  }

  return titleTheme
}
