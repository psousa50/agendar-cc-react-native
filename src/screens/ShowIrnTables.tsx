import { Card, Text, View } from "native-base"
import { sort } from "ramda"
import React from "react"
import { SectionList, SectionListData, SectionListRenderItem, StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { mergeIrnTables, sortTimes } from "../irnTables/main"
import { IrnTableLocation, IrnTableSchedule, Time } from "../irnTables/models"
import { useGlobalState } from "../state/main"
import { getCounty, getDistrict, getIrnTables } from "../state/selectors"
import { formatDate, formatTime, properCase } from "../utils/formaters"

export const ShowIrnTablesScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen {...props} content={() => <ShowIrnTablesContent {...props} />} title="Agendar CC" showAds={false} />
)

const ShowIrnTablesContent: React.FunctionComponent<AppScreenProps> = () => {
  const [globalState] = useGlobalState()

  const renderIrnTableSection: SectionListRenderItem<IrnTableSchedule> = ({ item }) => (
    <View style={styles.scheduleContainer}>
      <View style={styles.dateContainer}>
        <Text>{formatDate(item.date)}</Text>
      </View>
      <TimesList times={item.times} />
    </View>
  )

  const renderSectionHeader = (info: { section: SectionListData<IrnTableSchedule> }) => {
    const tableLocation: IrnTableLocation = info.section.tableLocation
    const district = getDistrict(globalState)(tableLocation.county.districtId)!
    const county = getCounty(globalState)(tableLocation.county.countyId)!

    return (
      <Card>
        <View style={styles.districtContainer}>
          <Text style={styles.districtText}>{`${district.name} - ${properCase(county.name)}`}</Text>
          <Text style={styles.locationText}>{tableLocation.locationName}</Text>
        </View>
      </Card>
    )
  }

  const keyExtractor = (_: IrnTableSchedule, index: number) => index.toString()

  const { countyId, districtId } = globalState
  const irnTables = getIrnTables(globalState)({ countyId, districtId })

  const mergedTables = mergeIrnTables(irnTables)

  const sections = mergedTables.map(tableLocation => ({ tableLocation, data: tableLocation.schedules }))

  return (
    <View style={styles.container}>
      <SectionList
        keyExtractor={keyExtractor}
        renderItem={renderIrnTableSection}
        sections={sections}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  )
}

const TimesList: React.FunctionComponent<{ times: Time[] }> = ({ times }) => (
  <View style={styles.timesListContainer}>
    {sort(sortTimes, times).map(time => (
      <TimeSlot key={time} time={time} />
    ))}
  </View>
)

const TimeSlot: React.FunctionComponent<{ time: Time }> = ({ time }) => (
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
    paddingLeft: 10,
    paddingRight: 10,
  },
  timeSlotContainer: {
    alignItems: "center",
    backgroundColor: "#d7ebfc",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 5,
    margin: 5,
    width: 50,
  },
  timeSlot: {
    fontSize: 10,
  },
})
