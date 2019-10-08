import { Button, Text, View } from "native-base"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps, renderContentOrLoading } from "../common/AppScreen"
import { IrnTableResultView } from "../common/IrnTableResultView"
import { useIrnDataFetch } from "../dataFetch/useIrnDataFetch"
import { useGlobalState } from "../GlobalStateProvider"
import {
  getIrnTableResultSummary,
  refineFilterIrnTable,
  selectOneIrnTableResultByClosestDate,
  selectOneIrnTableResultByClosestPlace,
} from "../irnTables/main"
import { GpsLocation } from "../irnTables/models"
import { globalStateSelectors } from "../state/selectors"
import { useCurrentGpsLocation } from "../utils/hooks"
import { navigate } from "./screens"

export const IrnTablesResultsScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState] = useGlobalState()
  const { irnTablesData } = useIrnDataFetch()
  const [, setCurrentGpsLocation] = useState(undefined as GpsLocation | undefined)

  useCurrentGpsLocation(setCurrentGpsLocation)

  const stateSelectors = globalStateSelectors(globalState)

  const filter = stateSelectors.getIrnTablesFilter
  const refineFilter = stateSelectors.getIrnTablesRefineFilter
  const { startDate, endDate } = filter
  const irnTables = irnTablesData.irnTables
  const irnTablesFiltered = irnTablesData.irnTables.filter(refineFilterIrnTable(refineFilter))

  const { countyId, districtId, gpsLocation } = filter
  const { date: refinedDate } = refineFilter
  const county = stateSelectors.getCounty(countyId)
  const district = stateSelectors.getDistrict(districtId)
  const location = gpsLocation || (county && county.gpsLocation) || (district && district.gpsLocation)

  const timeSlotsFilter = {
    endTime: filter.endTime,
    startTime: filter.startTime,
    timeSlot: refineFilter.timeSlot,
  }
  const isAsap = !startDate && !endDate && !refinedDate
  const irnTableResult =
    isAsap || !location
      ? selectOneIrnTableResultByClosestDate(stateSelectors)(irnTablesFiltered, location, timeSlotsFilter)
      : selectOneIrnTableResultByClosestPlace(stateSelectors)(irnTablesFiltered, location, timeSlotsFilter)

  const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <Text>{`Resultados encontrados: ${irnTables.length}`}</Text>
        {irnTableResult ? (
          <View style={styles.container}>
            <Text>{`Mais ${isAsap ? "perto" : "próximo"}:`}</Text>
            <IrnTableResultView {...irnTableResult} />
          </View>
        ) : null}
        {irnTableResultSummary.irnPlaceNames.length > 1 ? (
          <Button onPress={() => navigation.goTo("IrnTablesResultsMapScreen")}>
            <Text>{"Escolher outro local"}</Text>
          </Button>
        ) : null}
        {irnTableResultSummary.dates.length > 1 ? (
          <Button onPress={() => navigation.goTo("IrnTablesByDateScreen")}>
            <Text>{"Escolher outra data"}</Text>
          </Button>
        ) : null}
        <Text>{JSON.stringify(filter, null, 2)}</Text>
        <Text>{JSON.stringify(stateSelectors.getIrnTablesRefineFilter, null, 2)}</Text>
        <Text>{`Di = ${irnTableResultSummary.districtIds.length}`}</Text>
        <Text>{`Ct = ${irnTableResultSummary.countyIds.length}`}</Text>
        <Text>{`Pl = ${irnTableResultSummary.irnPlaceNames.length}`}</Text>
        <Text>{`Dt = ${irnTableResultSummary.dates.length}`}</Text>
        <Text>{`Ts = ${irnTableResultSummary.timeSlots.length}`}</Text>
      </View>
    )
  }

  return (
    <AppScreen
      {...props}
      content={renderContentOrLoading(irnTablesData.loading, renderContent)}
      title="Resultados"
      showAds={false}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
