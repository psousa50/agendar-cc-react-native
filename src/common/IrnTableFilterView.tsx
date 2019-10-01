import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { getCountyName } from "../utils/formaters"

export const IrnTableFilterView: React.FC<IrnTableFilterState> = irnFilter => {
  const [globalState] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const county = stateSelectors.getCounty(irnFilter.countyId)
  const district = stateSelectors.getDistrict(irnFilter.districtId)
  return (
    <View style={styles.header}>
      <Text>{getCountyName(county, district)}</Text>
      <Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
  },
  locations: {
    flexDirection: "column",
  },
  location: {
    fontSize: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 5,
  },
})
