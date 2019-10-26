import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { shadow } from "../../styles/shadows"
import { appTheme } from "../../utils/appTheme"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"
import { IconType } from "./ToolbarIcons"

const colorPrimary = appTheme.primaryText

interface InfoCardProps {
  title: string
  iconName: string
  iconType?: IconType
  onPress?: () => void
}
export const InfoCard: React.FC<InfoCardProps> = ({ title, children, onPress, iconName, iconType }) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress}>
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
    paddingHorizontal: rs(12),
    paddingBottom: rs(5),
  },
  infoCard: {
    backgroundColor: "white",
    marginTop: rs(-12),
    marginLeft: rs(12),
    marginRight: rs(12),
    borderRadius: rs(6),
    ...shadow,
  },
  infoCardContent: {
    margin: rs(3),
    padding: rs(3),
    backgroundColor: "white",
  },
  icon: {
    padding: rs(3),
    color: colorPrimary,
    fontSize: rfs(16),
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appTheme.brandPrimary,
    borderRadius: rs(6),
    paddingLeft: rs(12),
    paddingTop: rs(3),
    paddingBottom: rs(14),
  },
  titleBarText: {
    textAlignVertical: "top",
    color: appTheme.primaryText,
    fontSize: rfs(14),
    fontWeight: "bold",
  },
})
