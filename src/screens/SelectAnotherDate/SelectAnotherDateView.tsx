import moment from "moment"
import { View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { CalendarList, DateObject } from "react-native-calendars"
import { max, min } from "../../utils/collections"
import { DateString, toDateString } from "../../utils/dates"

interface SelectAnotherDateViewProps {
  dates: DateString[]
  onDateSelected: (date: DateString) => void
}
export const SelectAnotherDateView: React.FC<SelectAnotherDateViewProps> = ({ dates, onDateSelected }) => {
  const minDate = min(dates)
  const maxDate = max(dates)
  const currentDate = minDate || new Date(Date.now())
  const diffMonths = maxDate ? moment(new Date(maxDate)).diff(moment(currentDate), "month") : 0

  const markedDates = dates.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: { selected: true },
    }),
    {},
  )

  const onDayPress = (dateObject: DateObject) => {
    const date = toDateString(new Date(dateObject.dateString))
    date && onDateSelected(date)
  }

  return (
    <View style={styles.container}>
      <CalendarList
        current={currentDate}
        pastScrollRange={0}
        futureScrollRange={diffMonths}
        markedDates={markedDates}
        markingType={"simple"}
        onDayPress={onDayPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
