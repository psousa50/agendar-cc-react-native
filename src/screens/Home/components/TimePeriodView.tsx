import { Icon, Text, View } from "native-base"
import React from "react"
import { TouchableOpacity } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { i18n } from "../../../localization/i18n"
import { TimePeriod } from "../../../state/models"
import { formatTimeSlot } from "../../../utils/formaters"

interface TimePeriodViewProps {
  timePeriod: TimePeriod
  onClear: () => void
  onEdit: () => void
}

export const TimePeriodView: React.FC<TimePeriodViewProps> = ({ timePeriod, onClear, onEdit }) => {
  const { startTime, endTime } = timePeriod

  const timePeriodText =
    startTime && endTime
      ? i18n.t("TimePeriod.Period", { startTime: formatTimeSlot(startTime), endTime: formatTimeSlot(endTime) })
      : startTime
      ? i18n.t("TimePeriod.From", { startTime: formatTimeSlot(startTime) })
      : endTime
      ? i18n.t("TimePeriod.Until", { endTime: formatTimeSlot(endTime) })
      : i18n.t("TimePeriod.Anytime")

  const isDefined = startTime || endTime
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEdit}>
        {isDefined ? (
          <Text style={styles.text}>{timePeriodText}</Text>
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

const styles = EStyleSheet.create({
  container: {},
  text: {
    fontSize: "0.9rem",
    textAlign: "center",
    paddingVertical: "0.1rem",
  },
  close: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  closeIcon: {
    padding: "0.2rem",
    fontSize: "1rem",
  },
})
