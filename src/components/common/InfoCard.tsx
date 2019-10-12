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
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>{title}</Text>
      </View>
      <View style={styles.infoCard}>
        <View style={styles.infoCardContent}>{children}</View>
      </View>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  infoCard: {
    backgroundColor: "white",
    marginTop: -10,
    marginLeft: 25,
    marginRight: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  infoCardContent: {
    margin: 5,
    padding: 5,
    backgroundColor: "white",
  },
  titleBar: {
    alignItems: "flex-start",
    backgroundColor: "#3171a8",
    borderRadius: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  titleBarText: {
    textAlignVertical: "top",
    color: "white",
    fontSize: 18,
  },
})
