import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { getCounty, getDistrict, getSelectedIrnTable } from "../state/selectors"
import { formatDate, getCountyName } from "../utils/formaters"

export const SelectedIrnTableScreen: React.FunctionComponent<AppScreenProps> = props => {
  const renderContent = () => {
    const [globalState] = useGlobalState()

    const selectedIrnTable = getSelectedIrnTable(globalState)

    if (selectedIrnTable) {
      const { countyId, districtId, placeName, date } = selectedIrnTable
      const county = getCounty(globalState)(countyId)
      const district = getDistrict(globalState)(districtId)
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
  return <AppScreen {...props} left={null} content={renderContent} title="Agendar CC" showAds={false} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
