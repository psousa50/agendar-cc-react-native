import { Icon, Text, View } from "native-base"
import React from "react"
import EStyleSheet from "react-native-extended-stylesheet"
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

const styles = EStyleSheet.create({
  container: {
    padding: 10,
  },
  infoCard: {
    backgroundColor: "white",
    marginTop: "-0.9rem",
    marginLeft: "1.5rem",
    marginRight: "1.0rem",
    borderRadius: "0.6rem",
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
    margin: "0.3rem",
    padding: "0.3rem",
    backgroundColor: "white",
  },
  icon: {
    padding: "0.3rem",
    color: colorPrimary,
    fontSize: "1.5rem",
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appTheme.brandPrimary,
    borderRadius: "0.6rem",
    paddingLeft: "1rem",
    paddingTop: "0.5rem",
    paddingBottom: "1rem",
  },
  titleBarText: {
    textAlignVertical: "top",
    color: appTheme.primaryText,
    fontSize: "1rem",
  },
})

console.log("styles=====>", JSON.stringify(styles, null, 2))
