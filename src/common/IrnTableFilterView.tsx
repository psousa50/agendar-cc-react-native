import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnFilterState } from "../state/models"
import { getCounty } from "../state/selectors"
import { getCountyName } from "../utils/formaters"

export const IrnTableFilterView: React.FC<IrnFilterState> = irnFilter => {
  const [globalState] = useGlobalState()

  const county = getCounty(globalState)(irnFilter.countyId)
  const district = getCounty(globalState)(irnFilter.districtId)
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
