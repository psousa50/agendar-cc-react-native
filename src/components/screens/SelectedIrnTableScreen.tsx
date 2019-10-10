import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { useGlobalState } from "../../GlobalStateProvider"
import { globalStateSelectors } from "../../state/selectors"
import { formatDate, getCountyName } from "../../utils/formaters"
import { AppScreen, AppScreenProps } from "../common/AppScreen"

export const SelectedIrnTableScreen: React.FunctionComponent<AppScreenProps> = props => {
  const renderContent = () => {
    const [globalState] = useGlobalState()
    const stateSelectors = globalStateSelectors(globalState)

    const selectedIrnTable = stateSelectors.getSelectedIrnTable

    if (selectedIrnTable) {
      const { countyId, districtId, placeName, date } = selectedIrnTable
      const county = stateSelectors.getCounty(countyId)
      const district = stateSelectors.getDistrict(districtId)
      const countyName = getCountyName(county, district)
      return (
        <View style={styles.container}>
          <Text>{countyName}</Text>
          <Text>{placeName}</Text>
          <Text>{formatDate(date)}</Text>
        </View>
      )
    } else {
      return <></>
    }
  }
  return <AppScreen {...props}>{renderContent()}</AppScreen>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
