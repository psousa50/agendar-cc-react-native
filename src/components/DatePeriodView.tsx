import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { i18n } from "../localization/i18n"
import { DatePeriod } from "../state/models"
import { formatDateLocale } from "../utils/formaters"

interface DatePeriodViewProps {
  datePeriod: DatePeriod
  onClearDatePeriod: () => void
  onEditDatePeriod: () => void
}

export const DatePeriodView: React.FC<DatePeriodViewProps> = ({ datePeriod, onClearDatePeriod, onEditDatePeriod }) => {
  const { startDate, endDate } = datePeriod
  const firstLine1 = startDate ? i18n.t(["DatePeriod", "From"]) : endDate ? i18n.t(["DatePeriod", "To"]) : undefined
  const firstLine2 = startDate
    ? formatDateLocale(startDate)
    : endDate
    ? formatDateLocale(endDate)
    : i18n.t(["DatePeriod", "Asap"])
  const secondLine1 = startDate && endDate ? i18n.t(["DatePeriod", "To"]) : undefined
  const secondLine2 = startDate && endDate ? formatDateLocale(endDate) : undefined

  return (
    <View style={styles.container}>
      <View style={styles.datesText}>
        <View style={styles.row}>
          <Text style={styles.periodText1}>{firstLine1}</Text>
          <Text style={styles.periodText2}>{firstLine2}</Text>
        </View>
        {secondLine1 || secondLine2 ? (
          <View style={styles.row}>
            <Text style={styles.periodText1}>{secondLine1}</Text>
            <Text style={styles.periodText2}>{secondLine2}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.icons}>
        {startDate || endDate ? (
          <TouchableOpacity onPress={onClearDatePeriod}>
            <Icon style={styles.icon} name={"close-circle"} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onEditDatePeriod}>
          <Icon style={styles.icon} name={"create"} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  datesText: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  periodText1: {
    margin: 5,
    fontSize: 12,
    width: "30%",
  },
  periodText2: {
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
