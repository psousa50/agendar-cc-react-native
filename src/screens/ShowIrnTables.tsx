import { Card, Text, View } from "native-base"
import { sort } from "ramda"
import React, { FunctionComponent } from "react"
import { SectionList, SectionListData, SectionListRenderItem, StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useDataFetch } from "../dataFetch/useDataFetch"
import { useGlobalState } from "../GlobalStateProvider"
import { mergeIrnTablesByDate, mergeIrnTablesByLocation, sortTimes } from "../irnTables/main"
import {
  DaySchedule,
  IrnRepositoryTables,
  IrnTableDateSchedules,
  IrnTableLocationSchedules,
  LocationSchedule,
  TimeSlot,
} from "../irnTables/models"
import { getCounty, getDistrict } from "../state/selectors"
import { formatDate, formatTime, properCase } from "../utils/formaters"
import { fetchIrnTables } from "../utils/irnFetch"

export const ShowIrnTablesScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen {...props} content={() => <ShowIrnTablesContent {...props} />} title="Agendar CC" showAds={false} />
)

const ShowIrnTablesContent: React.FunctionComponent<AppScreenProps> = () => {
  const [globalState] = useGlobalState()

  const { countyId, districtId } = globalState.irnFilter
  const { state } = useDataFetch(() => fetchIrnTables({ districtId, countyId }), [] as IrnRepositoryTables)
  const irnTables = state.data

  const groupBy = "date"

  return state.isLoading ? (
    <View>
      <Text>Loading...</Text>
    </View>
  ) : (
    <View style={styles.container}>
      {groupBy === "date" ? <SectionsByDate irnTables={irnTables} /> : <SectionsByLocation irnTables={irnTables} />}
    </View>
  )
}

const SectionsByLocation: FunctionComponent<{ irnTables: IrnRepositoryTables }> = ({ irnTables }) => {
  const [globalState] = useGlobalState()

  const renderIrnTableSectionByLocation: SectionListRenderItem<DaySchedule> = ({ item }) => (
    <View style={styles.scheduleContainer}>
      <View style={styles.dateContainer}>
        <Text>{formatDate(item.date)}</Text>
      </View>
      <TimesList times={item.timeSlots} />
    </View>
  )

  const renderSectionHeaderByLocation = (info: { section: SectionListData<DaySchedule> }) => {
    const tableGroup: IrnTableLocationSchedules = info.section.tableGroup
    const district = getDistrict(globalState)(tableGroup.districtId)!
    const county = getCounty(globalState)(tableGroup.countyId)!

    return (
      <Card>
        <View style={styles.districtContainer}>
          <Text style={styles.districtText}>{`${district.name} - ${properCase(county.name)}`}</Text>
          <Text style={styles.locationText}>{tableGroup.locationName}</Text>
        </View>
      </Card>
    )
  }

  const keyExtractor = (_: DaySchedule, index: number) => index.toString()

  const mergedTables = mergeIrnTablesByLocation(irnTables)

  const sections = mergedTables.map(tableGroup => ({ tableGroup, data: tableGroup.daySchedules }))

  return (
    <SectionList
      keyExtractor={keyExtractor}
      renderItem={renderIrnTableSectionByLocation}
      sections={sections}
      renderSectionHeader={renderSectionHeaderByLocation}
    />
  )
}

const SectionsByDate: FunctionComponent<{ irnTables: IrnRepositoryTables }> = ({ irnTables }) => {
  const [globalState] = useGlobalState()

  const renderIrnTableSectionByDate: SectionListRenderItem<LocationSchedule> = ({ item }) => (
    <View style={styles.scheduleContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.locationText}>{item.locationName}</Text>
      </View>
      <TimesList times={item.timeSlots} />
    </View>
  )

  const renderSectionHeaderByDate = (info: { section: SectionListData<LocationSchedule> }) => {
    const tableGroup: IrnTableDateSchedules = info.section.tableGroup
    const district = getDistrict(globalState)(tableGroup.districtId)!
    const county = getCounty(globalState)(tableGroup.countyId)!

    return (
      <Card>
        <View style={styles.districtContainer}>
          <Text style={styles.districtText}>{`${district.name} - ${properCase(county.name)}`}</Text>
          <Text style={styles.dateText}>{formatDate(tableGroup.date)}</Text>
        </View>
      </Card>
    )
  }

  const keyExtractor = (_: LocationSchedule, index: number) => index.toString()

  const mergedTables = mergeIrnTablesByDate(irnTables)

  const sections = mergedTables.map(tableGroup => ({ tableGroup, data: tableGroup.locationSchedules }))

  return (
    <SectionList
      keyExtractor={keyExtractor}
      renderItem={renderIrnTableSectionByDate}
      sections={sections}
      renderSectionHeader={renderSectionHeaderByDate}
    />
  )
}

const TimesList: React.FunctionComponent<{ times: TimeSlot[] }> = ({ times }) => (
  <View style={styles.timesListContainer}>
    {sort(sortTimes, times).map(time => (
      <TimeSlot key={time} time={time} />
    ))}
  </View>
)

const TimeSlot: React.FunctionComponent<{ time: TimeSlot }> = ({ time }) => (
  <View style={styles.timeSlotContainer}>
    <Text style={styles.timeSlot}>{formatTime(time)}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  districtContainer: {
    alignItems: "center",
    backgroundColor: "#93cbfa",
    padding: 10,
  },
  districtText: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 15,
  },
  scheduleContainer: {
    padding: 10,
  },
  dateContainer: {
    alignItems: "center",
    backgroundColor: "#b4d9fa",
    borderWidth: StyleSheet.hairlineWidth,
  },
  timesListContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  timeSlotContainer: {
    alignItems: "center",
    backgroundColor: "#d7ebfc",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 5,
    margin: 5,
    width: 45,
  },
  timeSlot: {
    fontSize: 10,
  },
})
