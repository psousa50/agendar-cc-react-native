import { Text, View } from "native-base"
import { keys } from "ramda"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { DayTimeSlot } from "../common/DayTimeSlot"
import { useIrnDataFetch } from "../dataFetch/useIrnDataFetch"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTablesByPlace, mergeIrnTablesByTimeSlotAndPlace } from "../irnTables/main"
import { TimeSlot } from "../irnTables/models"
import { getIrnFilterCountyName, getIrnTablesFilter } from "../state/selectors"
import { datesEqual } from "../utils/dates"
import { formatDate } from "../utils/formaters"
import { navigate } from "./screens"

export const IrnTablesDayScheduleScreen: React.FC<AppScreenProps> = props => {
  const navigateTo = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()

  const { irnTablesData } = useIrnDataFetch()

  const irnFilter = getIrnTablesFilter(globalState)
  const selectedDate = irnFilter.selectedDate
  const irnTables = irnTablesData.irnTables.filter(t => !selectedDate || datesEqual(selectedDate, t.date))

  const irnTablesByTimeSlotAndPlaces = mergeIrnTablesByTimeSlotAndPlace(irnTables)

  const onPlaceSelected = (placeName: string) => {
    const selectedIrnTable =
      irnFilter.districtId && selectedDate
        ? {
            countyId: irnFilter.countyId,
            districtId: irnFilter.districtId,
            date: selectedDate,
            placeName,
          }
        : undefined

    if (selectedIrnTable) {
      globalDispatch({
        type: "IRN_TABLES_SET_SELECTED",
        payload: { selectedIrnTable },
      })
      navigateTo("SelectedIrnTableScreen")
    }
  }

  const renderPlaces = (irnTablesByPlace: IrnTablesByPlace) =>
    keys(irnTablesByPlace).map((irnPlace, i) => (
      <TouchableOpacity onPress={() => onPlaceSelected(irnPlace as string)}>
        <View style={styles.places} key={i}>
          <Text style={styles.place}>{irnPlace}</Text>
        </View>
      </TouchableOpacity>
    ))

  const renderContent = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>{getIrnFilterCountyName(globalState)}</Text>
        <Text>{selectedDate && formatDate(selectedDate)}</Text>
      </View>
      <ScrollView>
        {keys(irnTablesByTimeSlotAndPlaces).map(timeSlot => (
          <DayTimeSlot key={timeSlot} timeSlot={timeSlot as TimeSlot}>
            {renderPlaces(irnTablesByTimeSlotAndPlaces[timeSlot])}
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
  places: {
    flexDirection: "column",
  },
  place: {
    fontSize: 10,
    paddingVertical: 5,
  },
})
