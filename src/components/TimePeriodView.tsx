import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { i18n } from "../localization/i18n"
import { TimePeriod } from "../state/models"
import { formatTimeSlot } from "../utils/formaters"

interface TimePeriodViewProps {
  timePeriod: TimePeriod
  onClearTimePeriod: () => void
  onEditTimePeriod: () => void
}

export const TimePeriodView: React.FC<TimePeriodViewProps> = ({ timePeriod, onClearTimePeriod, onEditTimePeriod }) => {
  const { startTime, endTime } = timePeriod

  const timePeriodText =
    startTime && endTime
      ? i18n.t("TimePeriod.Period", { startTime: formatTimeSlot(startTime), endTime: formatTimeSlot(endTime) })
      : startTime
      ? i18n.t("TimePeriod.From", { startTime: formatTimeSlot(startTime) })
      : endTime
      ? i18n.t("TimePeriod.Until", { endTime: formatTimeSlot(endTime) })
      : i18n.t("TimePeriod.Anytime")

  return (
    <View style={styles.container}>
      <Text style={styles.timePeriodText}>{timePeriodText}</Text>
      <View style={styles.icons}>
        {startTime || endTime ? (
          <TouchableOpacity onPress={onClearTimePeriod}>
            <Icon style={styles.icon} name={"close-circle"} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onEditTimePeriod}>
          <Icon style={styles.icon} name={"create"} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  timePeriodText: {
    margin: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  icons: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    paddingHorizontal: 5,
    marginTop: 5,
    fontSize: 12,
  },
})
