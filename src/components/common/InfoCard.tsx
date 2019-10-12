import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { appTheme } from "../../utils/appTheme"
import { IconType } from "./ToolbarIcons"

const colorPrimary = appTheme.primaryText

interface InfoCardProps {
  title: string
  iconName: string
  iconType?: IconType
  onPress?: () => void
}
export const InfoCard: React.FC<InfoCardProps> = ({ title, children, onPress, iconName, iconType }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Icon style={styles.icon} type={iconType} name={iconName} />
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
  icon: {
    padding: 5,
    color: colorPrimary,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appTheme.brandPrimary,
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
