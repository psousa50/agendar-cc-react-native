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

  const isPeriod = !!startDate && !!endDate && startDate !== endDate
  const startDateText = startDate && formatDateLocale(startDate)
  const endDateText = endDate && formatDateLocale(endDate)

  const startText = isPeriod
    ? startDateText
    : startDate && endDate
    ? i18n.t("DatePeriod.OneDay", { startDate: startDateText })
    : startDate
    ? i18n.t("DatePeriod.From", { startDate: startDateText })
    : endDate
    ? i18n.t("DatePeriod.To", { endDate: endDateText })
    : i18n.t("DatePeriod.Asap")

  const endText = isPeriod ? endDateText : ""

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.text}>{startText}</Text>
        <Text style={styles.text}>{endText}</Text>
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
  container: {},
  text: {
    fontSize: "0.9rem",
    textAlign: "center",
    paddingVertical: "0.2rem",
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
