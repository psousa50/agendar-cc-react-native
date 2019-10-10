import { StyleProvider } from "native-base"
import React from "react"
import { getTheme } from "../../src/theme/components"
import { appTheme } from "../../src/utils/appTheme"

export const AppTest: React.FC = ({ children }) => <StyleProvider style={getTheme(appTheme)}>{children}</StyleProvider>
