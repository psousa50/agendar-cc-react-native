import moment from "moment"
import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { CalendarList, DateObject } from "react-native-calendars"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { LoadingPage } from "../common/LoadingPage"
import { useIrnDataFetch } from "../dataFetch/useIrnDataFetch"
import { useGlobalState } from "../GlobalStateProvider"
import { TimeSlot } from "../irnTables/models"
import { groupCollection, max } from "../utils/collections"
import { formatDateYYYYMMDD as formatDateYYYY_MM_DD, formatTime } from "../utils/formaters"

export const IrnTablesByDateScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()
  const { irnTablesData } = useIrnDataFetch()
  console.log("IrnTablesByDateScreen state=====>\n", globalState.irnTablesData)

  const irnTablesByDate = groupCollection(t => t.date, irnTablesData.irnTables)
  const dates = irnTablesByDate.map(g => g.key)
  const maxDate = max(dates)
  const diffMonths = maxDate ? moment(new Date(maxDate)).diff(moment(dates[0]), "month") : 0

  const markedDates = irnTablesByDate.reduce(
    (acc, cur) => ({
      ...acc,
      [formatDateYYYY_MM_DD(cur.key)]: { selected: true },
    }),
    {},
  )

  const onDayPress = (date: DateObject) => {
    const selectedDate = new Date(date.dateString)
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter: { selectedDate } },
    })
    props.navigation.navigate("IrnTablesDaySchedule")
  }

  const renderContent = () => {
    return irnTablesData.loading ? (
      <LoadingPage />
    ) : (
      <View style={styles.container}>
        <CalendarList
          pastScrollRange={0}
          futureScrollRange={diffMonths}
          markedDates={markedDates}
          markingType={"simple"}
          onDayPress={onDayPress}
        />
      </View>
    )
  }

  return <AppScreen {...props} content={renderContent} title="Horários" showAds={false} />
}

const TimeSlot: React.FunctionComponent<{ time: TimeSlot }> = ({ time }) => (
  <View style={styles.timeSlotContainer}>
    <Text style={styles.timeSlot}>{formatTime(time)}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  agendaItem: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "flex-end",
  },
  agendaItemText: {
    fontSize: 12,
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
    padding: 3,
    margin: 3,
    width: 35,
  },
  timeSlot: {
    fontSize: 8,
  },
})
