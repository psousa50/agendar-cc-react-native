import { Dimensions, Platform } from "react-native"

import { variable } from "./../variables/platform"

const deviceHeight = Dimensions.get("window").height
export const theme = (_ = variable) => {
  const containerTheme = {
    flex: 1,
    height: Platform.OS === "ios" ? deviceHeight : deviceHeight - 20,
  }

  return containerTheme
}
