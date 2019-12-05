import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { appTheme } from "../../../utils/appTheme"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../../utils/responsive"

interface PeriodRowProps {
  active: boolean
  title: string
  value?: string
  placeholder: string
  onEdit?: () => void
  onClear?: () => void
}

export const PeriodRow: React.FC<PeriodRowProps> = ({ active, value, title, onClear, onEdit, placeholder }) => (
  <View style={styles.container}>
    <TouchableOpacity disabled={active || !onEdit} style={styles.titleContainer} onPress={onEdit}>
      <Text style={active ? styles.title : styles.inactiveTitle}>{`${title}${value ? ":" : ""}`}</Text>
    </TouchableOpacity>
    <TouchableOpacity disabled={!onEdit} style={styles.valueContainer} onPress={onEdit}>
      <Text style={value ? styles.value : styles.placeHolder}>{value || placeholder}</Text>
    </TouchableOpacity>
    <TouchableOpacity disabled={!active || !onClear} style={styles.closeContainer} onPress={onClear}>
      {active && onClear && <Icon style={styles.closeIcon} name="close" />}
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: rs(10),
    paddingHorizontal: rs(5),
    justifyContent: "space-between",
    minHeight: rs(45),
  },
  titleContainer: {
    width: "30%",
  },
  titleContainerNoValue: {
    width: "90%",
  },
  valueContainer: {
    width: "60%",
  },
  title: {
    fontSize: rfs(12),
    color: appTheme.secondaryText,
  },
  inactiveTitle: {
    fontSize: rfs(12),
    color: appTheme.secondaryTextDimmed,
  },
  value: {
    fontSize: rfs(12),
    color: appTheme.secondaryText,
  },
  placeHolder: {
    fontSize: rfs(12),
    fontStyle: "italic",
    color: appTheme.secondaryTextDimmed,
  },
  closeContainer: {
    width: "10%",
    alignItems: "center",
    paddingHorizontal: rs(5),
  },
  closeIcon: {
    fontSize: rfs(22),
  },
})
