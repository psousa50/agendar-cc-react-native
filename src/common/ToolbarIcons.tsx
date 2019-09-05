import { Button, Icon } from "native-base"
import React from "react"

export const editBackgroundColor = "gray"

type OnPress = () => void

type ButtonIcons = {
  [k: string]: (onPress: OnPress) => JSX.Element
}

const ButtonIcon = (name: string) => (onPress: OnPress, disabled: boolean = false, color?: string) => (
  <Button transparent disabled={disabled} onPress={onPress}>
    <Icon
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
}

export const buttonIcons = (...buttons: ButtonIcons[]) => buttons
