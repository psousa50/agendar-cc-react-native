import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { i18n } from "../localization/i18n"
import { formatDateLocale } from "../utils/formaters"

interface PeriodViewProps {
  startDate?: Date
  endDate?: Date
  onClearDate: () => void
  onEditDate: () => void
}

export const PeriodView: React.FC<PeriodViewProps> = ({ startDate, endDate, onClearDate, onEditDate }) => {
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
        {startDate || endDate ? <Icon style={styles.icon} name={"close-circle"} onPress={onClearDate} /> : null}
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
