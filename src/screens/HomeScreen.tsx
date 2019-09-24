import { Button, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { getIrnFilterCountyName } from "../state/selectors"
import { navigate } from "./screens"

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState] = useGlobalState()
  const navigateTo = navigate(props.navigation)

  const renderContent = () => {
    const location = getIrnFilterCountyName(globalState) || "Localização"
    return (
      <View>
        <Text onPress={() => navigateTo("IrnLocationFilterScreen")}>{location}</Text>
        <Button style={styles.searchButton} block onPress={() => navigateTo("IrnTablesByDateScreen")}>
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
