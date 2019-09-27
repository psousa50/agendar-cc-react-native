import { Button, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { getIrnFilterCountyName, getIrnTablesFilter } from "../state/selectors"
import { formatDate } from "../utils/formaters"
import { navigate } from "./screens"

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState] = useGlobalState()
  const navigation = navigate(props.navigation)

  const renderContent = () => {
    const filter = getIrnTablesFilter(globalState)
    const location = getIrnFilterCountyName(globalState) || "Localização"
    const startDate = filter.startDate ? formatDate(filter.startDate) : ""
    const endDate = filter.endDate ? formatDate(filter.endDate) : ""
    return (
      <View>
        <Text onPress={() => navigation.goTo("IrnLocationFilterScreen")}>{location}</Text>
        <Text onPress={() => navigation.goTo("IrnDateFilterScreen")}>{`${startDate} - ${endDate}`}</Text>
        <Button style={styles.searchButton} block onPress={() => navigation.goTo("IrnTablesResultsScreen")}>
          <Text>{"Mostrar Horãrios"}</Text>
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
