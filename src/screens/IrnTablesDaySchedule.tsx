import { Text, View } from "native-base"
import { keys } from "ramda"
import React from "react"
import { StyleSheet } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { DayTimeSlot } from "../common/DayTimeSlot"
import { useIrnDataFetch } from "../dataFetch/useIrnDataFetch"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTablesByLocation, mergeIrnTablesByTimeSlotAndLocation } from "../irnTables/main"
import { TimeSlot } from "../irnTables/models"
import { getIrnFilterCountyName, getIrnTablesFilter } from "../state/selectors"
import { datesEqual } from "../utils/dates"
import { formatDate } from "../utils/formaters"

export const IrnTablesDayScheduleScreen: React.FC<AppScreenProps> = props => {
  const [globalState] = useGlobalState()

  const { irnTablesData } = useIrnDataFetch()

  const selectedDate = getIrnTablesFilter(globalState).selectedDate
  const irnTables = irnTablesData.irnTables.filter(t => !selectedDate || datesEqual(selectedDate, t.date))

  const irnTablesByTimeSlotAndLocation = mergeIrnTablesByTimeSlotAndLocation(irnTables)

  console.log("irnTablesByTimeSlotAndLocation=====>", irnTablesByTimeSlotAndLocation)

  const renderLocations = (irnTablesByLocation: IrnTablesByLocation) =>
    keys(irnTablesByLocation).map((location, i) => (
      <View style={styles.locations} key={i}>
        <Text style={styles.location}>{location}</Text>
      </View>
    ))

  const renderContent = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>{getIrnFilterCountyName(globalState)}</Text>
        <Text>{selectedDate && formatDate(selectedDate)}</Text>
      </View>
      <ScrollView>
        {keys(irnTablesByTimeSlotAndLocation).map(timeSlot => (
          <DayTimeSlot key={timeSlot} timeSlot={timeSlot as TimeSlot}>
            {renderLocations(irnTablesByTimeSlotAndLocation[timeSlot])}
          </DayTimeSlot>
        ))}
      </ScrollView>
    </View>
  )

  return <AppScreen {...props} content={renderContent} title="Horários" showAds={false} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
  },
  locations: {
    flexDirection: "column",
  },
  location: {
    fontSize: 10,
    paddingVertical: 5,
  },
})
