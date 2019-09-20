import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { TimeSlot } from "../irnTables/models"
import { formatTimeSlot } from "../utils/formaters"

interface DayTimeSlot {
  timeSlot: TimeSlot
}
export const DayTimeSlot: React.FC<DayTimeSlot> = ({ timeSlot, children }) => (
  <View style={styles.row}>
    <View style={styles.left}>
      <Text style={styles.time}>{formatTimeSlot(timeSlot)}</Text>
    </View>
    <View style={styles.right}>
      <View style={styles.header}>
        <View style={styles.line}></View>
      </View>
      <View style={styles.body}>
        <View style={styles.line}></View>
        <View style={styles.bodyContent}>{children}</View>
      </View>
    </View>
  </View>
)

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  left: {
    minWidth: 40,
  },
  right: {
    flex: 1,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  header: {
    minHeight: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  bodyContent: {
    padding: 20,
  },
  line: {
    minWidth: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  time: {
    fontSize: 12,
  },
})
