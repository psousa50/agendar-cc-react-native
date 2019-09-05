import { variable } from "./../variables/platform"

export const theme = (_ = variable) => {
  const contentTheme = {
    "flex": 1,
    "backgroundColor": "transparent",
    "NativeBase.Segment": {
      borderWidth: 0,
      backgroundColor: "transparent",
    },
  }

  return contentTheme
}
