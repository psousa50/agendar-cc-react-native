import { Button, Text, View } from "native-base"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps, renderContentOrLoading } from "../common/AppScreen"
import { IrnTableResultView } from "../common/IrnTableResultView"
import { useIrnDataFetch } from "../dataFetch/useIrnDataFetch"
import { useGlobalState } from "../GlobalStateProvider"
import {
  getIrnTableResultSummary,
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

  const irnFilter = stateSelectors.getIrnTablesFilter
  const { startDate, endDate } = irnFilter
  const irnTables = irnTablesData.irnTables

  const isAsap = !startDate && !endDate
  const irnTableResult = isAsap
    ? selectOneIrnTableResultByClosestDate(stateSelectors)(irnTables, irnFilter)
    : selectOneIrnTableResultByClosestPlace(stateSelectors)(irnTables, irnFilter)

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
        {irnTableResultSummary.irnPlaceNames.length > 1 ? (
          <Button onPress={() => navigation.goTo("MapLocationSelectorScreen")}>
            <Text>{"Select Place"}</Text>
          </Button>
        ) : null}
        <Text>{JSON.stringify(irnFilter, null, 2)}</Text>
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
