import { variable } from "./../variables/platform"

export const theme = (variables = variable) => {
  const subtitleTheme = {
    fontSize: variables.subTitleFontSize,
    fontFamily: variables.titleFontfamily,
    color: variables.subtitleColor,
    textAlign: "center",
  }

  return subtitleTheme
}
