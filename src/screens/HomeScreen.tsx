import { Button, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { getIrnFilterCountyName, getIrnTablesFilter } from "../state/selectors"
import { formatDate } from "../utils/formaters"
import { navigate } from "./screens"

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()
  const navigation = navigate(props.navigation)

  const updateGlobalFilter = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter },
    })
  }

  const clearFilter = () => {
    updateGlobalFilter({
      countyId: undefined,
      districtId: undefined,
      gpsLocation: undefined,
      startDate: undefined,
      endDate: undefined,
      startTime: undefined,
      endTime: undefined,
    })
  }

  const onSearch = () => {
    updateGlobalFilter({ selectedDate: undefined, selectedPlaceName: undefined, selectedTimeSlot: undefined })
    navigation.goTo("IrnTablesResultsScreen")
  }

  const renderContent = () => {
    const filter = getIrnTablesFilter(globalState)
    const location = getIrnFilterCountyName(globalState) || "Localização"
    const startDate = filter.startDate ? formatDate(filter.startDate) : ""
    const endDate = filter.endDate ? formatDate(filter.endDate) : ""
    return (
      <View>
        <Text onPress={() => navigation.goTo("IrnLocationFilterScreen")}>{location}</Text>
        <Text onPress={() => navigation.goTo("IrnDateFilterScreen")}>{`${startDate} - ${endDate}`}</Text>
        <Button style={styles.searchButton} block onPress={clearFilter}>
          <Text>{"Limpar"}</Text>
        </Button>
        <Button style={styles.searchButton} block onPress={onSearch}>
          <Text>{"Pesquisar Horários"}</Text>
        </Button>
      </View>
    )
  }
  return <AppScreen {...props} left={null} content={renderContent} title="Agendar CC" showAds={false} />
}

const styles = StyleSheet.create({
  searchButton: {
    marginTop: 100,
  },
})
