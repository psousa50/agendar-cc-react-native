import React from "react"
import { StyleSheet, View } from "react-native"
import { CalendarList, DateObject } from "react-native-calendars"
import { DatePeriod } from "../../state/models"
import { appTheme } from "../../utils/appTheme"
import { addDaysToDateString, createDateStringRange, currentUtcDateString, toDateString } from "../../utils/dates"
import { useDimensions } from "../../utils/hooks"
import { responsiveScale as rs } from "../../utils/responsive"
import { DatePeriodView } from "../Home/components/DatePeriodView"

const selectedColor = appTheme.secondaryColor

interface SelectPeriodViewProps {
  datePeriod: DatePeriod
  onDatePeriodChange: (datePeriod: DatePeriod) => void
}
export const SelectDatePeriodView: React.FC<SelectPeriodViewProps> = ({ datePeriod, onDatePeriodChange }) => {
  const dimensions = useDimensions()
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
      <View style={styles.datePeriod}>
        <DatePeriodView {...datePeriod} onDatePeriodChange={onDatePeriodChange} />
      </View>
      <CalendarList
        style={styles.calendar}
        calendarWidth={dimensions.width}
        minDate={currentUtcDateString()}
        maxDate={addDaysToDateString(currentUtcDateString(), 90)}
        futureScrollRange={3}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "white",
    paddingHorizontal: rs(10),
  },
  calendar: {
    paddingBottom: rs(20),
    marginBottom: rs(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  datePeriod: {
    paddingHorizontal: rs(20),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
