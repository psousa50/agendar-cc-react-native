import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { i18n } from "../localization/i18n"
import { DatePeriod } from "../state/models"
import { formatDateLocale } from "../utils/formaters"

interface PeriodViewProps {
  datePeriod: DatePeriod
  onClearDate: () => void
  onEditDate: () => void
}

export const PeriodView: React.FC<PeriodViewProps> = ({ datePeriod, onClearDate, onEditDate }) => {
  const { startDate, endDate } = datePeriod
  const periodText =
    startDate && endDate
      ? i18n.t(["DatePeriod", "OnThePeriod"], {
          startDate: formatDateLocale(startDate),
          endDate: formatDateLocale(endDate),
        })
      : startDate
      ? i18n.t(["DatePeriod", "FromTheDay"], { startDate: formatDateLocale(startDate) })
      : endDate
      ? i18n.t(["DatePeriod", "UntilTheDay"], { endDate: formatDateLocale(endDate) })
      : i18n.t(["DatePeriod", "Asap"])

  return (
    <View style={styles.container}>
      <Text style={styles.periodText}>{periodText}</Text>
      <View style={styles.icons}>
        {startDate || endDate ? (
          <TouchableOpacity onPress={onClearDate}>
            <Icon style={styles.icon} name={"close-circle"} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onEditDate}>
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
    alignItems: "center",
  },
  icons: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  icon: {
    paddingHorizontal: 5,
    marginTop: 5,
    fontSize: 12,
  },
  danger: {
    color: "red",
  },
  periodText: {
    margin: 5,
    fontSize: 12,
  },
})
