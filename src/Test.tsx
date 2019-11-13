import React, { useEffect } from "react"
import { Button, View } from "react-native"
import { createAppContainer, createStackNavigator, NavigationScreenProps } from "react-navigation"

export const Test = () => <View></View>

export const Test1: React.FC<NavigationScreenProps> = props => {
  useEffect(() => {
    console.log("Mount Test1")
    return () => console.log("UnMount Test1")
  })

  const load = () => {
    props.navigation.navigate("Test2")
  }

  return (
    <View>
      <Button title="Hello" onPress={load} />
    </View>
  )
}

const Test2: React.FC<NavigationScreenProps> = props => {
  useEffect(() => {
    console.log("Mount Test2")
    return () => console.log("UnMount Test2")
  })

  return (
    <View>
      <Button title="Backl" onPress={() => props.navigation.goBack()} />
    </View>
  )
}

export const ContentNavigator = createStackNavigator(
  {
    Test1,
    Test2,
  },
  {
    initialRouteName: "Test1",
    headerMode: "none",
  },
)

export const AppContainer = () => createAppContainer(ContentNavigator)
