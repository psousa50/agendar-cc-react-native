import { Button, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { getIrnFilterCountyName } from "../state/selectors"

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const renderContent = () => {
    const [globalState] = useGlobalState()

    const location = getIrnFilterCountyName(globalState) || "Localização"
    return (
      <View>
        <Text onPress={() => props.navigation.navigate("IrnLocationFilter")}>{location}</Text>
        <Button style={styles.searchButton} block onPress={() => props.navigation.navigate("IrnTablesByDateScreen")}>
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
