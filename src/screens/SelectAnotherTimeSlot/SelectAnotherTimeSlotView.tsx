import { Text, View } from "native-base"
import { sort } from "ramda"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { sortTimes } from "../../irnTables/main"
import { TimeSlot } from "../../irnTables/models"
import { appTheme } from "../../utils/appTheme"
import { formatTimeSlot } from "../../utils/formaters"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"

interface SelectAnotherTimeSlotViewProps {
  timeSlots: TimeSlot[]
  onTimeSlotSelected: (timeSlot: TimeSlot) => void
}
export const SelectAnotherTimeSlotView: React.FC<SelectAnotherTimeSlotViewProps> = ({
  timeSlots,
  onTimeSlotSelected,
}) => {
  const sortedTimeSlots = sort(sortTimes, timeSlots)

  let lastHour = ""
  return (
    <View style={styles.container}>
      {sortedTimeSlots.map(ts => {
        const timeSlot = formatTimeSlot(ts)
        const thisHour = timeSlot.substr(0, 2)
        const showDivider = thisHour !== lastHour
        lastHour = thisHour
        return (
          <View key={ts}>
            {showDivider ? (
              <View style={styles.divider}>
                <Text style={styles.dividerText}>{`${thisHour}:00`}</Text>
              </View>
            ) : null}
            <TouchableOpacity onPress={() => onTimeSlotSelected(ts)}>
              <View style={styles.timeSlot}>
                <Text style={styles.timeSlotText}>{timeSlot}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: rs(10),
  },
  divider: {
    paddingLeft: rs(10),
    backgroundColor: appTheme.secondaryColor,
    marginTop: rs(3),
    marginBottom: rs(2),
  },
  dividerText: {
    fontSize: rfs(25),
  },
  timeSlot: {
    paddingLeft: rs(50),
    paddingVertical: rs(10),
    backgroundColor: "white",
  },
  timeSlotText: {
    fontSize: rfs(12),
  },
})
