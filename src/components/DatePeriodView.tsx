import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { i18n } from "../localization/i18n"
import { DatePeriod } from "../state/models"
import { formatDateLocale } from "../utils/formaters"

interface DatePeriodViewProps {
  datePeriod: DatePeriod
  onClear: () => void
  onEdit: () => void
}

export const DatePeriodView: React.FC<DatePeriodViewProps> = ({ datePeriod, onClear, onEdit }) => {
  const { startDate, endDate } = datePeriod

  const isDefined = startDate || endDate
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEdit}>
        {isDefined ? (
          <>
            {startDate && <Text style={styles.text}>{formatDateLocale(startDate)}</Text>}
            {endDate && <Text style={styles.text}>{formatDateLocale(endDate)}</Text>}
          </>
        ) : (
          <Text style={styles.text}>{i18n.t("DatePeriod.Asap")}</Text>
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
