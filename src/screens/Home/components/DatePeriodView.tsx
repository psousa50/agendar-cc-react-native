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
    padding: "0.1rem",
    fontSize: "1rem",
  },
})
