import { Button, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { getIrnFilterCountyName } from "../state/selectors"

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen {...props} left={null} content={() => <HomeContent {...props} />} title="Agendar CC" showAds={false} />
)

const HomeContent: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState] = useGlobalState()

  const location = getIrnFilterCountyName(globalState) || "Localização"
  return (
    <View>
      <Text onPress={() => props.navigation.navigate("IrnLocationFilter")}>{location}</Text>
      <Button style={styles.searchButton} block onPress={() => props.navigation.navigate("IrnTablesByDate")}>
        <Text>{"Mostrar Horãrios"}</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  searchButton: {
    marginTop: 100,
  },
})
