import { Icon, Text, View } from "native-base"
import React from "react"
import { TouchableOpacity } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { i18n } from "../../../localization/i18n"
import { DatePeriod } from "../../../state/models"
import { formatDateLocale } from "../../../utils/formaters"

interface DatePeriodViewProps {
  datePeriod: DatePeriod
  onClear: () => void
  onEdit: () => void
}

export const DatePeriodView: React.FC<DatePeriodViewProps> = ({ datePeriod, onClear, onEdit }) => {
  const { startDate, endDate } = datePeriod

  const startDateText = startDate ? formatDateLocale(startDate) : endDate ? undefined : i18n.t("DatePeriod.Asap")
  const endDateText = endDate && startDate !== endDate ? formatDateLocale(endDate) : undefined

  const startText =
    startDate && endDate
      ? startDate === endDate
        ? i18n.t("DatePeriod.OneDay")
        : i18n.t("DatePeriod.From")
      : startDate
      ? i18n.t("DatePeriod.From")
      : undefined

  const endText = endDate
    ? startDate
      ? startDate === endDate
        ? undefined
        : i18n.t("DatePeriod.To")
      : i18n.t("DatePeriod.Until")
    : undefined

  const textRow = (text?: string, emphasizedText?: string) => (
    <View style={styles.textContainer}>
      {text && <Text style={styles.text}>{text}</Text>}
      {emphasizedText && <Text style={styles.emphasizedText}>{emphasizedText}</Text>}
    </View>
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEdit}>
        {textRow(startText, startDateText)}
        {endDateText && textRow(endText, endDateText)}
      </TouchableOpacity>
      {startDate || endDate ? (
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
    alignItems: "center",
    paddingVertical: "0.2rem",
  },
  text: {
    fontSize: "0.8rem",
    textAlign: "center",
  },
  emphasizedText: {
    fontSize: "0.9rem",
    textAlign: "center",
    fontWeight: "bold",
    paddingHorizontal: "0.3rem",
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
