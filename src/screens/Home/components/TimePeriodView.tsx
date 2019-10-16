import { Icon, Text, View } from "native-base"
import { flatten } from "ramda"
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

  const startTimeText = formatTimeSlot(startTime)
  const endTimeText = formatTimeSlot(endTime)

  const split = (block: string) => (text: string) => {
    const p = text.search(block)
    return p >= 0 ? [text.substring(0, p - 1), text.substr(p, block.length), text.substring(p + block.length)] : [text]
  }

  const normalText = (text: string, key?: string) => (
    <Text key={key} style={styles.text}>
      {text}
    </Text>
  )
  const emphasizedText = (text: string, key?: string) => (
    <Text key={key} style={styles.emphasizedText}>
      {text}
    </Text>
  )

  const replace = (text: string) =>
    flatten(split("##startTime##")(text).map(split("##endTime##"))).map((part, i) =>
      part === "##startTime##"
        ? emphasizedText(startTimeText, i.toString())
        : part === "##endTime##"
        ? emphasizedText(endTimeText, i.toString())
        : normalText(part, i.toString()),
    )

  const timePeriodElement =
    startTime && endTime
      ? startTime === endTime
        ? replace(i18n.t("TimePeriod.At"))
        : replace(i18n.t("TimePeriod.Period"))
      : startTime
      ? replace(i18n.t("TimePeriod.From"))
      : endTime
      ? replace(i18n.t("TimePeriod.Until"))
      : emphasizedText(i18n.t("TimePeriod.Anytime"))

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEdit}>
        <View style={styles.textContainer}>{timePeriodElement}</View>
      </TouchableOpacity>
      {startTime || endTime ? (
        <TouchableOpacity style={styles.close} onPress={onClear}>
          <Icon style={styles.closeIcon} name={"close"} />
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = EStyleSheet.create({
  container: {
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "0.2rem",
  },
  text: {
    fontSize: "0.8rem",
    textAlign: "center",
    textAlignVertical: "bottom",
  },
  emphasizedText: {
    fontSize: "1.1rem",
    textAlign: "center",
    textAlignVertical: "bottom",
    fontWeight: "bold",
    paddingHorizontal: "0.5rem",
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
