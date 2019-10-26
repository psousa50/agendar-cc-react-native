import { Button, Icon, NativeBase, Text } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { IconType } from "../../../components/common/ToolbarIcons"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../../utils/responsive"

interface MainButtonProps extends NativeBase.Button {
  iconName?: string
  iconType?: IconType
  text: string
  color?: string
}

export const MainButton: React.FC<MainButtonProps> = ({ color, iconName, iconType, text, style, ...props }) => (
  <Button
    style={[styles.button, color ? { backgroundColor: color } : undefined, style]}
    iconLeft
    block
    success
    rounded
    {...props}
  >
    {iconName && <Icon type={iconType} name={iconName} />}
    <Text>{text}</Text>
  </Button>
)

const styles = StyleSheet.create({
  button: {
    marginTop: rs(5),
    marginBottom: rs(10),
    marginHorizontal: rs(12),
    fontSize: rfs(12),
  },
})
