import { Button, Icon, NativeBase, Text } from "native-base"
import React from "react"
import EStyleSheet from "react-native-extended-stylesheet"
import { IconType } from "../../../components/common/ToolbarIcons"

interface MainButtonProps extends NativeBase.Button {
  iconName: string
  iconType?: IconType
  text: string
  color?: string
}

export const MainButton: React.FC<MainButtonProps> = ({ color, iconName, iconType, text, ...props }) => (
  <Button
    style={[styles.button, color ? { backgroundColor: color } : undefined]}
    iconLeft
    block
    success
    rounded
    {...props}
  >
    <Icon type={iconType} name={iconName} />
    <Text>{text}</Text>
  </Button>
)

const styles = EStyleSheet.create({
  button: {
    marginTop: "1rem",
    marginHorizontal: "1.0rem",
  },
})
