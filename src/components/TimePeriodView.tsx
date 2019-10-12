import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { i18n } from "../localization/i18n"
import { TimePeriod } from "../state/models"
import { formatTimeSlot } from "../utils/formaters"

interface TimePeriodViewProps {
  timePeriod: TimePeriod
  onClear: () => void
  onEdit: () => void
}

export const TimePeriodView: React.FC<TimePeriodViewProps> = ({ timePeriod, onClear, onEdit }) => {
  const { startTime, endTime } = timePeriod

  const isDefined = startTime || endTime
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEdit}>
        {isDefined ? (
          <>
            {startTime && <Text style={styles.text}>{formatTimeSlot(startTime)}</Text>}
            {endTime && <Text style={styles.text}>{formatTimeSlot(endTime)}</Text>}
          </>
        ) : (
          <Text style={styles.text}>{i18n.t("TimePeriod.Anytime")}</Text>
        )}
      </TouchableOpacity>
      {isDefined && (
        <TouchableOpacity style={styles.close} onPress={onClear}>
          <Icon style={styles.closeIcon} name={"close"} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
  },
  editIcon: {
    padding: 5,
    fontSize: 16,
  },
  close: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  closeIcon: {
    padding: 5,
    fontSize: 16,
  },
})
