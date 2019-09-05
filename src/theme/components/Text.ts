import { variable } from "./../variables/platform"

export const theme = (variables = variable) => {
  const textTheme = {
    "fontSize": variables.DefaultFontSize - 1,
    "fontFamily": variables.fontFamily,
    "color": variables.textColor,
    ".note": {
      color: "#a7a7a7",
      fontSize: variables.noteFontSize,
    },
  }

  return textTheme
}
