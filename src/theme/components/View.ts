import { variable } from "./../variables/platform"

export const theme = (variables = variable) => {
  const viewTheme = {
    ".padder": {
      padding: variables.contentPadding,
    },
  }

  return viewTheme
}
