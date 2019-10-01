import { Button, Text, View } from "native-base"
import React, { useEffect } from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { SelectedDateTimeView } from "../components/SelectedDateTimeView"
import { SelectedLocationView } from "../components/SelectedLocationView"
import { SelectedServiceView } from "../components/SelectedServiceView"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { AppScreenName, navigate } from "./screens"

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()
  const navigation = navigate(props.navigation)
  const stateSelectors = globalStateSelectors(globalState)

  const updateGlobalFilter = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter },
    })
  }

  const clearFilter = () => {
    updateGlobalFilter({
      serviceId: undefined,
      countyId: undefined,
      districtId: undefined,
      gpsLocation: undefined,
      startDate: undefined,
      endDate: undefined,
      startTime: undefined,
      endTime: undefined,
    })
  }

  useEffect(() => {
    updateGlobalFilter({
      region: "Continente",
      serviceId: 2,
      startDate: new Date("2019-10-03"),
      endDate: new Date("2019-10-14"),
      districtId: 12,
      countyId: 7,
    })
  }, [])

  const onSearch = () => {
    updateGlobalFilter({ ...stateSelectors.getIrnTablesFilter, selectedDate: undefined, selectedTimeSlot: undefined })
    navigation.goTo("IrnTablesResultsScreen")
  }

  const onSelectFilter = (filterScreen: AppScreenName) => () => {
    updateGlobalFilter({ ...stateSelectors.getIrnTablesFilter, selectedDate: undefined, selectedTimeSlot: undefined })
    navigation.goTo(filterScreen)
  }

  const irnFilter = stateSelectors.getIrnTablesFilter

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <SelectedServiceView irnFilter={irnFilter} onSelect={onSelectFilter("SelectIrnServiceScreen")} />
        <SelectedDateTimeView irnFilter={irnFilter} onSelect={onSelectFilter("SelectDateTimeScreen")} />
        <SelectedLocationView irnFilter={irnFilter} onSelect={onSelectFilter("SelectLocationScreen")} />
        <Button block onPress={clearFilter}>
          <Text>{"Limpar"}</Text>
        </Button>
        <Button block onPress={onSearch}>
          <Text>{"Pesquisar Horários"}</Text>
        </Button>
      </View>
    )
  }
  return <AppScreen {...props} left={null} content={renderContent} title="Agendar CC" showAds={false} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
