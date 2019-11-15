import React from "react"
import { StyleSheet, View } from "react-native"
import { Calendar, DateObject } from "react-native-calendars"
import { i18n } from "../../localization/i18n"
import { DatePeriod } from "../../state/models"
import { appTheme } from "../../utils/appTheme"
import { addDaysToDateString, createDateStringRange, currentUtcDateString, toDateString } from "../../utils/dates"
import { responsiveScale as rs } from "../../utils/responsive"
import { DatePeriodView } from "../Home/components/DatePeriodView"
import { MainButton } from "../Home/components/MainButton"

const selectedColor = appTheme.secondaryColor

interface SelectPeriodViewProps {
  datePeriod: DatePeriod
  onDatePeriodChange: (datePeriod: DatePeriod) => void
  onConfirm: () => void
}
export const SelectDatePeriodView: React.FC<SelectPeriodViewProps> = ({
  datePeriod,
  onDatePeriodChange,
  onConfirm,
}) => {
  const { startDate, endDate } = datePeriod

  const onDayPress = (dateObject: DateObject) => {
    const date = toDateString(dateObject.dateString)

    if (!startDate || endDate) {
      onDatePeriodChange({ startDate: date, endDate: undefined })
    } else {
      onDatePeriodChange({ startDate, endDate: date })
    }
  }

  const hasBothDates = !!startDate && !!endDate
  const dateRange =
    startDate && endDate
      ? createDateStringRange(addDaysToDateString(startDate, 1), addDaysToDateString(endDate, -1))
      : []
  const markedDates = {
    ...(startDate
      ? {
          [startDate]: {
            selected: true,
            color: selectedColor,
            startingDay: hasBothDates,
          },
        }
      : {}),
    ...dateRange.reduce(
      (acc, date) => ({
        ...acc,
        [date]: { selected: true, color: selectedColor },
      }),
      {},
    ),
    ...(endDate
      ? {
          [endDate]: {
            selected: true,
            color: selectedColor,
            endingDay: hasBothDates && startDate !== endDate,
          },
        }
      : {}),
  }

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        minDate={currentUtcDateString()}
        maxDate={addDaysToDateString(currentUtcDateString(), 90)}
        current={dateRange[0]}
        markedDates={markedDates}
        markingType="period"
        onDayPress={onDayPress}
        theme={{
          "stylesheet.day.period": {
            base: {
              overflow: "hidden",
              height: 34,
              alignItems: "center",
              width: 38,
            },
          },
        }}
      />
      <DatePeriodView {...datePeriod} onDatePeriodChange={onDatePeriodChange} />
      <MainButton style={styles.button} onPress={onConfirm} text={i18n.t("DatePeriod.Confirm")} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: rs(10),
  },
  calendar: {
    paddingBottom: rs(30),
    marginBottom: rs(20),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    marginBottom: rs(20),
  },
})
