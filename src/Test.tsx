import { View } from "native-base"
import React from "react"
import { RadioButton } from "./components/common/RadioButton"

export const Test = () => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
      <RadioButton id={"1"} selected={false} label={"Continente"} onSelected={() => undefined} />
      <RadioButton id={"1"} selected={true} label={"Continente"} onSelected={() => undefined} />
    </View>
  )
}
