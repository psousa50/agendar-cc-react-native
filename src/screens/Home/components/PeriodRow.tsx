import { Icon, Text, View } from "native-base"
import React from "react"
import { TouchableOpacity } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { appTheme } from "../../../utils/appTheme"

interface PeriodRowProps {
  active: boolean
  title: string
  value?: string
  onEdit?: () => void
  onClear?: () => void
}

export const PeriodRow: React.FC<PeriodRowProps> = ({ active, value, title, onClear, onEdit }) => (
  <View style={styles.container}>
    <TouchableOpacity
      disabled={active}
      style={value ? styles.titleContainer : styles.titleContainerNoValue}
      onPress={onEdit}
    >
      <Text style={active ? styles.title : styles.inactiveTitle}>{`${title}${value ? ":" : ""}`}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.valueContainer} onPress={onEdit}>
      <Text style={styles.value}>{value}</Text>
    </TouchableOpacity>
    {active && onClear && (
      <TouchableOpacity style={styles.closeContainer} onPress={onClear}>
        <Icon style={styles.closeIcon} name="close" />
      </TouchableOpacity>
    )}
  </View>
)

const styles = EStyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: "0.2rem",
    paddingBottom: "1.2rem",
    paddingHorizontal: "0.5rem",
    justifyContent: "space-between",
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
    fontSize: "0.9rem",
    color: appTheme.secondaryText,
  },
  inactiveTitle: {
    fontSize: "0.9rem",
    color: appTheme.secondaryTextDimmed,
  },
  value: {
    fontSize: "1.0rem",
    fontWeight: "bold",
    color: appTheme.secondaryText,
  },
  closeContainer: {
    width: "10%",
    alignItems: "flex-end",
    paddingHorizontal: "0.5rem",
  },
  closeIcon: {
    fontSize: "1rem",
  },
})
