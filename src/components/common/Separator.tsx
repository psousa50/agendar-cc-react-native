import { View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { appTheme } from "../../utils/appTheme"

export const Separator: React.FC = () => (
  <View
    style={{
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingVertical: 3,
      borderColor: appTheme.secondaryTextDimmed,
    }}
  />
)
