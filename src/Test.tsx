import { Button, Text, View } from "native-base"
import React, { useState } from "react"
import { FlatList, TextInput, TouchableOpacity } from "react-native"

export const Test = () => {
  const [state, setState] = useState("")

  const renderItem = (info: any) => (
    <TouchableOpacity onPress={() => setState("pressed")}>
      <Text>{info.item}</Text>
    </TouchableOpacity>
  )

  const keyExtractor = (item: any) => item

  return (
    <View>
      <TextInput />
      <TouchableOpacity onPress={() => setState("pressed something")}>
        <Text>{"Something"}</Text>
      </TouchableOpacity>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={["jktktyukyuik", "sdjuofsoduif", "sdjufghfghofsoduif", "ghjhjjkjhk"]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <Text>{state}</Text>
      <Button onPress={() => setState("pressed button")}>
        <Text>{"Test"}</Text>
      </Button>
    </View>
  )
}
