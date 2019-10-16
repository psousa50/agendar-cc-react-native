import { Button, Icon } from "native-base"
import React from "react"
import EStyleSheet from "react-native-extended-stylesheet"

export const editBackgroundColor = "gray"

type OnPress = () => void

type ButtonIcons = {
  [k: string]: (onPress: OnPress) => JSX.Element
}

export type IconType =
  | "AntDesign"
  | "Entypo"
  | "EvilIcons"
  | "Feather"
  | "FontAwesome"
  | "FontAwesome5"
  | "Foundation"
  | "Ionicons"
  | "MaterialCommunityIcons"
  | "MaterialIcons"
  | "Octicons"
  | "SimpleLineIcons"
  | "Zocial"
const ButtonIcon = (name: string, type?: IconType) => (onPress: OnPress, disabled: boolean = false, color?: string) => (
  <Button transparent disabled={disabled} onPress={onPress}>
    <Icon
      type={type}
      name={`${name}`}
      ios={`ios-${name}`}
      android={`md-${name}`}
      color={color}
      style={[styles.icon, color ? { color } : undefined]}
    />
  </Button>
)
export const ButtonIcons = {
  Add: ButtonIcon("add"),
  ArrowBack: ButtonIcon("arrow-back"),
  CancelEdit: ButtonIcon("arrow-back"),
  Checkmark: ButtonIcon("checkmark"),
  Close: ButtonIcon("close"),
  Delete: ButtonIcon("trash"),
  Edit: ButtonIcon("create"),
  Refresh: ButtonIcon("refresh"),
}

export const buttonIcons = (...buttons: ButtonIcons[]) => buttons

const styles = EStyleSheet.create({
  icon: {
    fontSize: "2.0rem",
  },
})
