import React from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { appTheme } from "../../utils/appTheme"

export const LoadingPage = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={appTheme.primaryColor} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
})
