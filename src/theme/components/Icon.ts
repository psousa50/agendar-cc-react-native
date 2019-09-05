import { variable } from "./../variables/platform"

export const theme = (variables = variable) => {
  const iconTheme = {
    fontSize: variables.iconFontSize,
    color: "#000",
  }

  return iconTheme
}
