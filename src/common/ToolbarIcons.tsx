import { Button, Icon } from "native-base"
import React from "react"

export const editBackgroundColor = "gray"

type OnPress = () => void

type ButtonIcons = {
  [k: string]: (onPress: OnPress) => JSX.Element
}

type IconType =
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
      style={color ? { color } : undefined}
    />
  </Button>
)
export const ButtonIcons = {
  Add: ButtonIcon("add"),
  Delete: ButtonIcon("trash"),
  Edit: ButtonIcon("create"),
  Refresh: ButtonIcon("refresh"),
  ArrowBack: ButtonIcon("arrow-back"),
  CancelEdit: ButtonIcon("arrow-back"),
  Checkmark: ButtonIcon("checkmark"),
}

export const buttonIcons = (...buttons: ButtonIcons[]) => buttons
