import React from "react"
import { StyleSheet, Text, View } from "react-native"

export const App = () => {
  return (
    <View>
      <Text style={styles.container}>Hello 1234</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    color: "red",
  },
})
