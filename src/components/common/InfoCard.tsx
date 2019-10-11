import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

interface InfoCardProps {
  title: string
  onPress?: () => void
}
export const InfoCard: React.FC<InfoCardProps> = ({ title, children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.titleBar}>
      <Text style={styles.titleBarText}>{title}</Text>
    </View>
    <View style={styles.infoCard}>
      <View style={styles.infoCardContainer}>{children}</View>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "transparent",
    marginLeft: 30,
  },
  infoCardContainer: {
    margin: 5,
    padding: 5,
    backgroundColor: "white",
  },
  titleBar: {
    backgroundColor: "#3171a8",
    padding: 10,
  },
  titleBarText: {
    color: "white",
    fontSize: 16,
  },
})
