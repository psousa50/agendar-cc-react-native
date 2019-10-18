import React from "react"
import { StyleSheet, Text, View } from "react-native"

interface ErrorPageProps {
  errorMessage: string
}
export const ErrorPage: React.FC<ErrorPageProps> = ({ errorMessage }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{errorMessage}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
  },
})
