import React from "react"
import { Calendar, DateObject } from "react-native-calendars"
import { DatePeriod } from "../state/models"
import { addDays, createDateRange, datesAreEqual } from "../utils/dates"
import { formatDateYYYYMMDD } from "../utils/formaters"

interface SelectPeriodViewProps {
  datePeriod: DatePeriod
  onDateChange: (datePeriod: DatePeriod) => void
}
export const SelectPeriodView: React.FunctionComponent<SelectPeriodViewProps> = ({ datePeriod, onDateChange }) => {
  const { startDate, endDate } = datePeriod

  const onDayPress = (dateObject: DateObject) => {
    const date = new Date(dateObject.dateString)

    if (!startDate || endDate) {
      onDateChange({ startDate: date, endDate: undefined })
    } else {
      onDateChange(datesAreEqual(date, startDate) ? { startDate: undefined } : { startDate, endDate: date })
    }
  }

  const hasBothDates = !!startDate && !!endDate
  const dateRange = startDate && endDate ? createDateRange(addDays(startDate, 1), addDays(endDate, -1)) : []
  const markedDates = {
    ...(startDate
      ? { [formatDateYYYYMMDD(startDate)]: { selected: true, color: "green", startingDay: hasBothDates } }
      : {}),
    ...dateRange.reduce(
      (acc, date) => ({
        ...acc,
        [formatDateYYYYMMDD(date)]: { selected: true, color: "green" },
      }),
      {},
    ),
    ...(endDate ? { [formatDateYYYYMMDD(endDate)]: { selected: true, color: "green", endingDay: hasBothDates } } : {}),
  }

  return (
    <Calendar
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
  )
}
